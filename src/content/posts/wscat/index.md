---

slug: "/wscat"

description: "通过 wscat，可以快速验证 WebSocket 服务器的连接、消息发送和接收功能，是开发和调试的实用工具。"
title: "使用wscat进行WebSocket通信测试"
date: 2025-07-23
summary: "通过 wscat，可以快速验证 WebSocket 服务器的连接、消息发送和接收功能，是开发和调试的实用工具。"
tags: ['coding']
draft: false
---

wscat 是基于 Node.js 的命令行工具，可以方便地进行 WebSocket 通信测试。

### wscat安装

```bash
npm install -g wscat
```

### 创建WebSocket服务器

```bash
wscat --listen 8080
```

### 测试连接WebSocket服务器

```bash
wscat -c ws://localhost:8080
```

### 用法

```bash
wscat [选项] (--listen < 端口 > | --connect < 网址 >)
```

### 选项

```text
-V, --version 输出版本号
--auth <用户名：密码> 添加基本 HTTP 认证头
--ca < 证书机构 > 指定证书机构（仅用于 --connect）
--cert < 客户端 SSL 证书 > 指定客户端 SSL 证书（仅用于 --connect）
--host < 主机 > 可选主机
--key < 密钥 > 指定客户端 SSL 证书的密钥（仅用于 --connect）
--max-redirects [数量] 允许的最大重定向次数（默认：10）
--no-color 无颜色模式运行
--passphrase [密码短语] 指定客户端 SSL 证书密钥的密码短语（仅用于 --connect）。若不提供值，将提示输入
--proxy <[协议://] 主机 [: 端口]> 通过代理连接。代理必须支持 CONNECT 方法
--slash 启用控制帧的斜杠命令（/ping [数据]、/pong [数据]、/close [代码 [, 原因]]）（仅用于 --connect）
-c, --connect < 网址 > 连接到 WebSocket 服务器
-H, --header < 头信息：值 > 设置 HTTP 头信息。重复该选项可设置多个（仅用于 --connect）（默认：[]）
-l, --listen < 端口 > 监听端口
-L, --location 跟随重定向
-n, --no-check 不检查未授权证书（仅用于 --connect）
-o, --origin < 源 > 可选的源信息
-p, --protocol < 版本 > 可选的协议版本
-P, --show-ping-pong 当收到 ping 或 pong 帧时打印通知（仅用于 --connect）
-s, --subprotocol < 协议 > 可选的子协议。重复该选项可指定多个（默认：[]）
-w, --wait < 秒数 > 执行命令后等待指定秒数（-1 表示保持连接打开）
-x, --execute < 命令 > 连接后执行命令。重复该选项可执行多个（仅用于 --connect）（默认：[]）
-h, --help 显示命令帮助
```

通过 wscat，可以快速验证 WebSocket 服务器的连接、消息发送和接收功能，是开发和调试的实用工具。Github: https://github.com/websockets/wscat