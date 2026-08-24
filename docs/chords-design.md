# 和弦库页面详细设计文档

> 状态:v1.0 / 待实施
> 范围:基于 chords-db 的静态吉他和弦「常用指法浏览 + 和弦查询」两大功能
> 原则:纯静态构建期渲染,无后端、无运行时第三方依赖

## 1. 背景与目标

在博客(Astro 静态站)中新增 `/chords` 板块:

1. **常用指法**:展示 C、D、E、F、G、A、B 七个自然大调的常用和弦指法图(SVG)
2. **和弦查询**:输入如 `Cmaj7`、`Am7`、`Gsus4`,定位到对应指法图

## 2. 数据源与许可

| 项 | 说明 |
|---|---|
| 来源 | [chords-db](https://github.com/tombatossals/chords-db)(MIT © David Rubert) |
| 本地化 | 已拷贝至 `vendor/chords-db/`(guitar.json 372KB + LICENSE + README.md),**不依赖外部目录**,CI 可构建 |
| 许可义务 | `/chords` 页面底部保留署名:「和弦数据来源 chords-db (MIT)」及链接 |

### 2.1 原始数据结构(guitar.json)

```jsonc
{
  "keys": ["C", "C#", ...],
  "chords": {
    "C": [
      { "key": "C", "suffix": "major",
        "positions": [{
          "frets":   [-1,3,2,0,1,0],  // 6弦→1弦,-1=闷音(x),0=空弦(o)
          "fingers": [0,3,2,0,1,0],   // 0=无手指标注
          "baseFret": 1,              // 图窗口起始品位
          "barres": [],               // 横按品
          "capo": false } ] } ] }
}
```

已核实(七自然调):20 种目标后缀共 **140 个和弦**,每和弦 3~7 个把位,`baseFret` 分布 1~13。

## 3. 数据管线(步骤 1)

### 3.1 脚本 `scripts/build-chords.mjs`

- 输入:`vendor/chords-db/guitar.json`
- 输出:`src/data/chords.json`
- 运行方式:手动执行 `node scripts/build-chords.mjs`,产物提交入库;`npm run build` 不执行该脚本(保证 CI 无额外依赖、构建确定性)
- 要求:**幂等、输出稳定**(固定 key/suffix 遍历顺序),重复运行 diff 为空

### 3.2 过滤规则

- 调性:`['C','D','E','F','G','A','B']`(七自然调,升降调暂不做,见 §10)
- 后缀(20 种,全部七调覆盖):

```
major, minor, 7, maj7, m7, m7b5, dim, dim7, aug,
sus2, sus4, 6, m6, 69, 9, add9, m9, maj9, 7sus4, 5
```

- 每和弦保留**前 3 个把位**(chords-db 已按可玩性大致排序)
- 删除 `midi` 字段(渲染不需要);保留 `frets/fingers/baseFret/barres/capo`
- 过滤 `positions` 为空的条目

### 3.3 输出 schema(`src/data/chords.json`,预计 ~50KB)

```jsonc
[
  { "key": "C", "suffix": "major", "positions": [ /* ≤3 个 */ ] }
]
```

按 key 字母序 → suffix 按 §3.2 顺序排列。展示层常量(名称映射、别名表)放代码,不入 JSON。

## 4. 展示层设计(步骤 2)

### 4.1 组件 `src/components/ChordDiagram.astro`

Props:`name`(显示名如 "Cmaj7")、`position`(单个 position 对象)。
构建期渲染为 **inline SVG**,零 JS。

SVG 规格(viewBox `0 0 120 150`):

```
┌──────────────────────┐
│        Cmaj7         │ ← 名称,居中,y=14,粗体
│   ×   o             │ ← 空弦o/闷音x 行,y=30
│  ╆═══════════╥       │ ← 弦线×6(竖),nut 加粗(baseFret=1 时)
│  ╟─●──●──●─╢│       │ ← 品丝×5(横),圆点 r=8+白色指法数字
│  ╟─────────╢│       │    barre: 圆角矩形横跨首尾按弦
│  ╟─────────╢3       │ ← 右侧品位标注 "3fr"(baseFret>1)
│  ╟─────────╢        │
└──────────────────────┘
```

- 几何:弦间距 x=20(起点 x=20),品间距 y=20(顶部弦 y=40);颜色用 `currentColor`,继承站点文字色,自动适配主题
- 映射规则:
  - `frets[i] === -1` → 该弦上方画 `×`;`=== 0` → 画空心圈
  - `frets[i] > 0` → 实心圆点,内写 `fingers[i]`(为 0 则不写)
  - `barres[]` → 对应品的横向圆角条(从首个按弦画到末个按弦)
  - `baseFret > 1` → 网格左侧省略 nut,左侧标 `{baseFret}fr`(v1.2:由右侧移到左侧,避免溢出被裁切)
  - `capo: true` 与 barres 同样渲染(视觉一致)

### 4.2 展示层常量 `src/lib/chords.ts`

```ts
export const KEYS = ['C','D','E','F','G','A','B'];
export const SUFFIX_ORDER = ['major','minor', /* …§3.2 全部 */ ];
export const SUFFIX_DISPLAY: Record<string,string>; // major:'', minor:'m', 69:'6/9', m7b5:'m7♭5'…
export function chordName(key, suffix): string      // 'C' + 'maj7' → 'Cmaj7'
export const SUFFIX_ALIASES: Record<string,string[]>; // 见 §6.2
```

## 5. 页面设计(步骤 3、4)

### 5.1 各调页 `src/pages/chords/[key].astro`

- `getStaticPaths()`:由 `KEYS` 生成 7 页(`/chords/C/` … `/chords/B/`)
- 复用 `BaseLayout`(title=`{key}调和弦指法`) + `Layout`(pageName=`{key} 调常用和弦`)
- 结构:
  1. 调性切换 Tab(7 个链接,当前高亮)
  2. 和弦卡片网格:`grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))`,移动端自适应
  3. 每卡片:和弦名标题 + 1~3 个 ChordDiagram;卡片 `id={anchor}` 供查询跳转
  4. 锚点命名:`#{key小写}-{suffix}`,如 `#c-maj7`
  5. 页脚署名(chords-db MIT)
- 样式:组件内 `<style>` scoped,遵循站点浅色主题与现有字号体系

### 5.2 首页 `src/pages/chords/index.astro`

结构自上而下:

1. 标题「和弦指法库」+ 一句说明
2. **查询框**(§6)+ 结果下拉列表
3. 七调导航大卡片(每调显示该调和弦数,点击进入对应页)
4. 署名页脚

### 5.3 菜单接入(步骤 5)

`src/consts.ts` 的 `menu` 数组新增 `{ name: '和弦', href: '/chords' }`;图标名从 Header 现有 iconfont 中选取(优先音乐类,回退 `music`)。

## 6. 和弦查询规格(步骤 4)

### 6.1 索引与数据传递

- 构建期:首页 frontmatter `import chords from '../data/chords.json'`,生成轻量索引 `[["C","major","C"],["C","maj7","Cmaj7"],…]`(140 条,约 5KB)
- 通过 `<script type="application/json" id="chord-index">` 内嵌进 HTML;inline 脚本读取,**无网络请求**

### 6.2 解析与匹配规则

输入归一化:`trim → 去空格 → 首字母大写其余小写`。
解析:首位根音 `[A-G]`,剩余部分查别名表得规范 suffix。

别名表(节选,完整版见 `src/lib/chords.ts`):

| suffix | 别名 |
|---|---|
| major | `''`、`maj`、`M` |
| minor | `m`、`min`、`小` |
| 7 | `dom7` |
| maj7 | `M7`、`ma7` |
| m7 | `min7` |
| m7b5 | `ø` |
| dim | `°`、`减` |
| dim7 | `°7` |
| aug | `+`、`增` |
| sus4 | `sus`(缺省挂弦=4)、`挂4` |
| sus2 | `挂2` |

### 6.3 交互

- 输入即时过滤(200ms 防抖),下拉最多列 12 条:`Cmaj7 — C调 · 3个指法`
- 点击/回车 → 跳转 `/chords/{key}/#{anchor}`,目标卡片短暂高亮(`:target` 或 scrollIntoView + class)
- 未收录(如 `F#m7`):提示「暂未收录该调/和弦」
- 纯原生 JS,`is:inline`,风格与 `/editor` 一致

## 7. 文件清单

| 文件 | 动作 | 说明 |
|---|---|---|
| `vendor/chords-db/{guitar.json,LICENSE,README.md}` | 新增(已完成) | 数据源本地化 |
| `scripts/build-chords.mjs` | 新增 | 过滤脚本 |
| `src/data/chords.json` | 生成 | ~50KB 提交入库 |
| `src/lib/chords.ts` | 新增 | 常量/映射/别名 |
| `src/components/ChordDiagram.astro` | 新增 | SVG 指法图 |
| `src/pages/chords/index.astro` | 新增 | 首页+查询 |
| `src/pages/chords/[key].astro` | 新增 | 七个调页 |
| `src/consts.ts` | 修改 | menu +1 |

## 8. 验证计划(步骤 6)

1. `node scripts/build-chords.mjs` 幂等性:连续两次运行 diff 为空
2. `npm run build`:唯一官方验证手段,必须通过
3. 抽查产物:`dist/chords/index.html` 含内嵌索引;`dist/chords/C/index.html` 含 20 张 SVG;抽查 `G/bass?` 等边界(高 baseFret 渲染)
4. `npm run preview` + curl 校验路由与锚点存在性

## 9. 工作量与风险

- 工作量:约半天
- 风险与对策:
  - *个别把位 baseFret 高(≥8)* → 前 3 把位通常靠前;渲染层正确标注 `{n}fr` 即可
  - *首页内嵌索引体积* → 仅存三元组,5KB 级,可忽略
  - *YAML/JSX 转义* → 无 frontmatter 引号陷阱(不走 Markdown 管道)

## 10. 后续扩展(本次不做)

- 升降调(C#/Db 等,注意源数据命名不一致:C# vs Db)、ukulele/piano 乐器切换、更多后缀(m11/13 等,七调已全覆盖 55 种)、指法试听(Web Audio 合成,可用 midi 字段——届时恢复导出)

## 11. 追加设计:级数和弦页(v1.1)

### 11.1 需求与路由

每调展示 **7 个级数和弦**(I ii iii IV V vi vii°)的按法,独立页面:

- `src/pages/chords/degrees/[key].astro`,`getStaticPaths` 生成 7 页(`/chords/degrees/C/` …)
- 入口:`/chords` 首页横幅卡 + 各调页顶部「按级数查看」链接;页内七调 Tab 切换,并回链全部和弦页

### 11.2 乐理数据(硬编码表,可审计)

- 级数模式:`I=major, ii=minor, iii=minor, IV=major, V=major, vi=minor, vii°=dim`
- 七调音阶表(SCALES)逐调列出 I~VII 音级,推导 (root, suffix) 对
- **升根音问题**:D/E/A/B 调的三级、六级、七级及 B 调五级含 F#/C#/G#/D#/A# 根音。处理:从全 12 调源数据取材,等音映射 `D#→Eb、G#→Ab、A#→Bb`(指法物理相同),**显示名用正确乐理名**(如 B 调 vii° 显示 A#dim)。源 JSON 内部键名为 `Csharp/Fsharp`,需名称转换
- 新增 10 个 (root,suffix) 对:F#m、C#m、G#m、D#m、Bm、F#、Bb、Edim、C#dim、A#dim → chords.json 共 150 条

### 11.3 数据管线变更(scripts/build-chords.mjs)

- 抽出 `normalizePosition()` 复用;新增 DEGREE_PATTERN + SCALES 表
- 输出增加 `src/data/degrees.json`:`{ [key]: [{deg, func, root, suffix}] }`;任一引用无法解析或窗口校验失败即抛错中断
- 附带收益:查询索引自动收录 F#m 等,首页输入 `F#m7` 类带变音记号查询需同步增强解析器(根音后允许 `#`/`b`)

### 11.4 页面结构(degrees/[key].astro)

1. 调性 Tab(复用样式)+ 说明行(级数含义)
2. 卡片网格:每卡片 = 级数徽标(I~vii°)+ 功能标签(主/下属/属/导)+ 和弦名 + 前 2 个把位图
3. 底部:常用进行提示(I–V–vi–IV、I–vi–ii–V)+ 回链「查看该调全部 20 种和弦」

### 11.5 验证

- 脚本断言:degrees.json 引用全部可在 chords.json 解析
- 端到端:7 页 × 7 卡片 × ≤2 SVG;坐标校验同 §8 方法;语义抽查 F#m 首把位必须为经典 244222(bf=2)
