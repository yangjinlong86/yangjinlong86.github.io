---
slug: "x-forwarded-for-principle"
description: "X-Forwarded-For (XFF) 原理详解：代理链如何传递客户端真实 IP，格式、解析、伪造风险与可信代理配置"
title: "X-Forwarded-For (XFF) 原理详解"
date: "2026-07-12 14:00:00"
summary: "X-Forwarded-For (XFF) 原理：代理链 IP 追加、格式解析、伪造风险与可信代理配置"
tags: ['coding']
---

## 一、为什么需要 XFF

当客户端直连服务器时，服务器从 TCP 连接就能拿到客户端 IP，写进访问日志、做限流风控都没问题。但现代 Web 架构几乎没有"直连"——请求通常要经过 CDN、反向代理、负载均衡器等多层代理：

```
客户端  ──▶  CDN  ──▶  反向代理/负载均衡  ──▶  应用服务器
```

此时应用服务器看到的 TCP 来源 IP 是**最后一跳代理的 IP**，而不是真实客户端 IP。于是限流、风控、日志统计全部失真。

`X-Forwarded-For`（简称 **XFF**）就是为解决这个问题而生：它是一个 HTTP 请求头，用来在代理链中传递"原始客户端 IP"以及中间经过的各级代理 IP。

> XFF 并不属于任何正式 HTTP 规范（事实标准），它的标准化版本是 `Forwarded` 头（RFC 7239），但实际工程中 XFF 用得远比 Forwarded 多。

## 二、原理：代理链逐跳追加 IP

XFF 的核心机制是：请求在代理链中逐跳转发时，每一跳代理都会把相关信息写入 XFF，使 XFF 从左到右依次记录 **客户端 → 第一跳代理 → … → 最近一跳代理** 的完整路径。

以 MDN 文档中的例子为例，请求经过两层代理：

```
客户端                代理1                 代理2                服务器
203.0.113.195   →   2001:db8:85a3:…    →   198.51.100.178   →   应用服务器

服务器最终收到:
  X-Forwarded-For: 203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348, 198.51.100.178
  ───────────────  ────────────────────────────────────────────────────  ───────────────────────────────────────────
   最左 = 客户端           中间 = 代理1                          最右 = 最近一跳代理(代理2)
```

要点：

- **最左**是原始客户端 IP（`203.0.113.195`）
- **最右**是离服务器最近的代理 IP（`198.51.100.178`）
- 一条 XFF 头可以包含多个 IP，用逗号分隔

## 三、语法格式

```
X-Forwarded-For: <client>, <proxy1>, <proxy2>, …, <proxyN>
```

- `<client>`：客户端 IP（IPv4 或 IPv6）
- `<proxy>`：各级代理 IP，按转发顺序排列

几个合法示例：

```
# 单个客户端 IP（IPv6）
X-Forwarded-For: 2001:db8:85a3:8d3:1319:8a2e:370:7348

# 单个客户端 IP（IPv4）
X-Forwarded-For: 203.0.113.195

# 客户端 + 一个代理
X-Forwarded-For: 203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348
```

## 四、解析规则：小心多个 XFF 头

一个请求里**可能存在多个 `X-Forwarded-For` 头**。规范要求把它们当成一个连续列表处理：从第一个头的第一个 IP 开始，到最后一个头的最后一个 IP 结束。

合并方式有两种，效果等价：

```
方式A：先把所有 XFF 值用逗号拼接，再按逗号拆成列表
方式B：每个 XFF 头各自按逗号拆成列表，再把列表顺序拼接
```

⚠️ **只读其中一个头是错误的**——会漏掉其他头里的 IP，导致安全判断失真。有些反向代理会自动合并多个 XFF 头，但不要依赖这个行为。

## 五、如何取出真实客户端 IP

由于最左的 IP 可能被伪造（见下一节），不能无脑取 `XFF[0]`。取真实客户端 IP 有两种常见做法：

**方法 1：按可信代理跳数，从右往左数**

预先配置"服务器到公网之间有几层可信反代"。设跳数为 N，则从 XFF 最右往左数 N 个是可信代理，再往左一个才是客户端：

```
XFF: [client, proxy1, proxy2]   # 假设 2 层可信反代
                       ↑       ↑
                     跳过2个可信代理，再往左 = client
```

- 若只有 1 层反代：它追加的就是客户端 IP，取**最右**那个。
- 若有 3 层反代：最后 3 个都是内部代理 IP，要再往左取。

**方法 2：配置可信代理 IP 段，从右往左跳过**

配置可信代理的 IP/IP 段白名单，从 XFF 最右往左扫描，跳过所有在白名单里的 IP，**第一个不在白名单的 IP** 即为目标客户端 IP。

```
XFF: 9.9.9.9, 1.2.3.4, 10.0.0.2(可信), 10.0.0.1(可信)
                                  ↑ 跳过可信，往左
                          ↑ 1.2.3.4 不在白名单 → 取它
```

注意：这个"第一个可信 IP"可能属于某个不可信的中间代理，而非真实客户端，但它已是可用于安全用途的最合理标识。

## 六、安全风险：XFF 可被伪造

这是 XFF 最关键的安全特性：**最左的 IP 完全可以由客户端伪造**。客户端在发请求时可以自己塞一个任意 `X-Forwarded-For` 头：

```
攻击者(真实IP 1.2.3.4) 伪造请求头:
   X-Forwarded-For: 9.9.9.9, 8.8.8.8
        │
        ▼
   可信反代(10.0.0.1) 收到，追加真实来源 1.2.3.4
        │  转发: X-Forwarded-For: 9.9.9.9, 8.8.8.8, 1.2.3.4
        ▼
   应用服务器
        ✗ 若取最左(9.9.9.9)   → 被伪造欺骗，限流/封禁打到无辜 IP
        ✓ 若取可信代理追加的(1.2.3.4) → 命中真实攻击者
```

如果服务器直接暴露在公网（即使前面挂了反代），那么整个 XFF 列表都不可信——因为攻击者可以绕过反代直连服务器，塞任意 XFF。

误用 XFF 的后果：

- **限流绕过**：每次伪造不同 IP，逃过基于 IP 的限流
- **访问控制绕过**：伪造白名单 IP 骗过 IP 黑/白名单
- **内存耗尽**：塞超长 XFF 头，撑爆解析逻辑

## 七、防御：只信任可信代理追加的部分

正确做法的黄金法则：**只有可信代理追加的 IP 才可用于安全用途**。

```
XFF: [不可信区 ..............] [可信区 (可信代理追加)]
     ← 伪造风险，仅作统计 →   ← 可用于限流/风控 →

取值方向:                   从右往左，跳过可信代理后取第一个
```

工程上：

1. 应用服务器**不直接对公网暴露**，只接受可信反代的请求；
2. 在反代/网关层用 `real_ip` 模块把 XFF 解析成真实客户端 IP，再传给应用；
3. 应用只信任反代设置好的 `$remote_addr` 或解析后的真实 IP，不再自己解析 XFF。

## 八、相关头对比

| 头 | 含义 | 是否标准 |
|---|---|---|
| `X-Forwarded-For` | 客户端 + 各级代理 IP 链 | 非正式标准（事实标准） |
| `Forwarded` | 统一转发信息（IP、Host、Proto） | RFC 7239 正式标准 |
| `X-Real-IP` | 单个客户端 IP（通常由 Nginx 设置） | 非标准（Nginx 约定） |
| `X-Forwarded-Host` | 原始 Host | 非标准 |
| `X-Forwarded-Proto` | 原始协议（http/https） | 非标准 |

`Forwarded` 头语法更结构化，例如：

```
Forwarded: for=203.0.113.195;proto=https;host=example.com
```

虽然更规范，但因为 XFF 已被几乎所有代理、框架、CDN 广泛支持，迁移成本高，所以 `Forwarded` 至今用得不多。

## 九、实践：在 Nginx 与代码中取真实 IP

**Nginx 配置（ngx_http_realip_module）**：

```nginx
# 设置可信代理(自己的反代/CDN 出口 IP)
set_real_ip_from 10.0.0.0/8;
set_real_ip_from 198.51.100.178;

# 从 XFF 取真实 IP
real_ip_header X-Forwarded-For;

# 递归：从右往左跳过所有可信代理 IP
real_ip_recursive on;
```

配置后，Nginx 的 `$remote_addr` 就会被替换为真实客户端 IP，下游应用直接用 `$remote_addr` 即可。

**Node.js 示例**：

```js
// trustedProxyCount: 服务器到公网之间的可信反代层数
function getClientIp(req, trustedProxyCount) {
  // 合并所有 XFF 头(规范要求)
  const xffRaw = req.headers['x-forwarded-for']
  const list = String(xffRaw || '').split(',').map(s => s.trim()).filter(Boolean)
  if (list.length) {
    // 从右往左跳过 trustedProxyCount 个可信代理，再往左一个即客户端
    const idx = list.length - trustedProxyCount - 1
    if (idx >= 0) return list[idx]
  }
  // 没有可信代理时，直接用 TCP 来源 IP
  return req.socket.remoteAddress
}
```

⚠️ 永远不要在生产环境直接信任 `req.headers['x-forwarded-for']` 的第一个值——它可能被任意客户端伪造。

## 十、总结

- **XFF 是什么**：传递客户端真实 IP 的 HTTP 请求头，经代理链逐跳追加。
- **格式**：`client, proxy1, …, proxyN`，最左客户端、最右最近代理。
- **解析**：多个 XFF 头要合并成一个列表，不能只取一个。
- **取值**：从右往左跳过可信代理，取第一个不可信 IP（安全用途）。
- **安全**：最左可伪造；安全相关用途只用可信代理追加的部分；服务器不应直接暴露公网。
- **标准**：XFF 非正式标准，正式版本是 `Forwarded`(RFC 7239)，但实际工程 XFF 仍是主流。

## 参考资料

- [MDN: X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)
- [RFC 7239: Forwarded HTTP Extension](https://datatracker.ietf.org/doc/html/rfc7239)
- [httptoolkit: What is X-Forwarded-For and when can you trust it?](https://httptoolkit.com/)
