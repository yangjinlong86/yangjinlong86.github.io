---

slug: "/gatsby-learning"

description: "Gatsby是个好东西，这玩意用了上瘾。"
title: Gatsby 入门
date: "2019-05-27"
summary: "Gatsby是个好东西，这玩意用了上瘾。"
tags: ['coding']

---

### 什么是 Gatsby

[Gatsby](https://www.gatsbyjs.org/)是一个基于React的免费开源的静态网站生成框架，可以快速构建网站和APP。

### 为什么用 Gatsby

- 基于 React
- 插件丰富
- 静态文件
- 速度飞快

### Gatsby 环境准备

1. 安装 [nodejs](https://nodejs.org/)

2. 安装 `gatsby-cli`

   ```shell
   npm install --global gatsby-cli
   ```

3. 安装 git
4. 选个顺手的代码编辑器，推荐使用 [vs code](https://code.visualstudio.com/)

### 使用 Gatsby starters

Gatsby 提供了一些 starter 以便快速构建网站，这些 starter 在他们的 [github](https://github.com/gatsbyjs) 上，通过`gatsby new`命令，可以基于 starter 创建一个本地 Gatsby 网站。

使用以下命令可以基于 `gatsby-starter-hello-world` starter 创建一个 Gatsby 网站。

```shell
gatsby new hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world
```

项目创建完后，进入`hello-word` 目录，执行 `gatsby develop` 来启动项目，默认端口号为`8000`。

### 认识 Gatsby 的页面

在编辑器中打开`src/pages/index.js`，该文件中的代码表示创建了一个组件，该组件包含一个div和字符串"hello world"。

```javascript
import React from "react"

export default () => <div>Hello world!</div>
```

in pure javascript:

```javascript
import React from "react"

export default () => React.createElement("div", null, "Hello world!")
```

### Components

一个组件是网站的构建块，是一段自包含的代码，描述了UI的一部分。Gatsby 是基于React 编写的。当我们谈使用和定义组件时，实际上是在说React组件——自包含的代码片段(通常使用JSX编写)，它可以接受输入并返回描述UI部分的React元素。

原生的HTML定义一个button

```html
<button class="primary-button">Click me</button>
```

在React中，可以定义一个button组件，来替代原生的button

```html
<PrimaryButton>Click me</PrimaryButton>
```

#### sub-component

在`src/components`目录下新建一个`header.js`

```javascript
import React from "react"

export default () => <h1>This is a header.</h1>
```

在`src/pages`目录下新建一个`about.js`，引入Header组件

```javascript
import React from "react"
import Header from "../components/header"

export default () => (
  <div style={{ color: `teal` }}>
    <Header /> 
    <p>Such wow. Very React.</p>
  </div>
)
```

如果想让header的文本支持自定义，需要修改header.js成如下：

```javascript
import React from "react"

export default props => <h1>{props.headerText}</h1>
```

然后在about.js中，指定headerText属性的值即可

```javascript
import React from "react"
import Header from "../components/header"

export default () => (
  <div style={{ color: `teal` }}>
    <Header headerText="About Gatsby" /> 
    <p>Such wow. Very React.</p>
  </div>
)
```

### Props

想要让这些可重用的组件具有动态性，能够为它们赋值，就可以使用 props 来完成此操作。props 是 React components 提供的属性。

在上面的例子中，我们通过 `headerText="About Gatsby"` 来引入` Header` sub-component

### Link

#### 使用 \<Link/> 组件

修改index.js

```javascript
import React from "react"
import { Link } from "gatsby"
import Header from "../components/header"

export default () => (
    <div style={{ color: 'teal'}}>
        <Link to="/contact/">Contact</Link>
        <Header headerText="Hello Gatsby!"/>
        <p>what is this...</p>
    </div>
)
```

新建一个contact.js

```javascript
import React from "react"
import { Link } from "gatsby"
import Header from "../components/header"

export default () => (
    <div style={{ color: 'teal'}}>
        <Link to="/contact/">Contact</Link>
        <Header headerText="Contact"/>
        <p>you can follow me on github</p>
    </div>
)
```

### 小结

- 了解 Gatsby
- Gatsby 环境准备
- 使用 Gatsby starters 创建网站
- JSX 语法
- Components
- Gatsby page components 和 sub-components
- React “props” 和重用 React components

