---

slug: "/two-nextjs-blog-problems"

description: "半夜想起网站还有问题没解决，挑灯疯狂Google，终于找到了解决办法。"
title: "Tailwind Nextjs Starter Blog 的两个配置问题"
date: "2024-06-05 01:12:48"
summary: "半夜想起网站还有问题没解决，挑灯疯狂Google，终于找到了解决办法。"
tags: ['coding']
draft: false
---

晚上加班的时候喝了一瓶东鹏，回到家睡不着觉，想起博客有个路由问题还没解决，挑灯疯狂Google，终于找到了解决办法。

问题一，我基于 `Tailwind Nextjs Starter Blog` 搭建的博客，配置好之后 `yarn build`，把生成的静态文件直接配在nginx下。

OK，看似一切正常，然而在文章页面刷新或者直接复制粘贴文章链接访问，就直接到我配置的404页面了。。。

检查了nginx的配置，没有问题，所以我猜可能是路由的问题，搜到了以下两个链接，试着配了以下，问题解决。

[nextjs-page-goes-to-404-on-refresh](https://stackoverflow.com/questions/54815348/nextjs-page-goes-to-404-on-refresh)

[nextjs-404-error-on-reload-refresh-action](https://stackoverflow.com/questions/62208254/nextjs-404-error-on-reload-refresh-action)

在`next.config.js` 配置 `exportTrailingSlash: true`，然后重新打包即可。
```javascript
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    images: {
      unoptimized: true,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
    output: 'export',
    exportTrailingSlash: true,
  })
}
```

问题二，部署到nginx下访问，发现文章里的图片不显示，我的文章图片在mdx同路径的`images`目录下，yarn build 完之后没有这个目录，不知道在哪配置。

后来把图片全部移动到`public`目录下，把引用图片的地方改成`![alt text](./q1.png)`，打包之后就能正常访问图片了。