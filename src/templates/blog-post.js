import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import Info from '../components/PostInfo'
import SEO from '../components/seo'
import GiscusComment from '../components/GiscusComment'
// 引入代码高亮组件
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
// 初始化代码高亮组件
deckDeckGoHighlightElement()

// 博客文章页面组件
class BlogPostTemplate extends React.Component {
  // 组件挂载完成后执行
  componentDidMount = () => {
    // 获取当前页面的hash值
    let pre = location.hash || ''
    // 如果存在hash值，将对应目录项设为激活状态
    if (pre)
      document.querySelector(`.css-toc a[href*="${pre}"]`).className = 'active'
    // 获取所有目录项
    let all = document.querySelectorAll(`.css-toc a`)
    // 为每个目录项添加点击事件监听器
    for (let item of Array.from(all)) {
      item.addEventListener('click', (e) => {
        // 如果之前有激活项，取消其激活状态
        if (pre) {
          let menuItem = document.querySelector(`.css-toc a[href*="${pre}"]`)
          menuItem.className = ''
        }
        // 将当前点击项设为激活状态
        item.className = 'active'
        pre = item.hash
      })
    }
    // 添加滚动事件监听器，用于实现目录的自动高亮
    document.addEventListener('scroll', () => {
      // 获取所有标题元素
      let list = Array.from(document.querySelectorAll('h2,h3,h4,h5,h6'))
      if (list.length === 0) return
      // 存储已经滚动过的标题
      let passedList = []
      // 遍历标题元素，找出已经滚动过的
      for (let item of list) {
        let top = item.getBoundingClientRect().top
        if (top <= 50) passedList.push(item)
      }
      // 如果没有滚动过任何标题，直接返回
      if (!passedList.length) return // 第一条的情况
      // 获取最后一个滚动过的标题
      let last = passedList[passedList.length - 1]
      // 如果当前激活项不是最后一个滚动过的标题
      if (pre !== last.hash) {
        // 取消之前激活项的激活状态
        if (pre) {
          let preItem = document.querySelector(`.css-toc a[href*="${pre}"]`)
          if (preItem) preItem.className = ''
        }
        // 将最后一个滚动过的标题对应的目录项设为激活状态
        let menuItem = document.querySelector(
          `.css-toc a[href*="${encodeURIComponent(last.id)}"]`
        )
        menuItem.className = 'active'
        pre = menuItem.hash
      }
    })
  }
  // 渲染函数
  render() {
    // 获取文章数据
    const post = this.props.data.markdownRemark
    // 获取页面上下文信息
    const { slug, previous, next } = this.props.pageContext
    return (
      // 使用布局组件，传入目录内容
      <Layout aside={post.tableOfContents}>
        <h1>{post.frontmatter.title}</h1>
        <Info date={post.frontmatter.date} tags={post.frontmatter.tags} />
        <div
          className="css-post-main"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <hr />
        <ul className="button-wrapper">
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                <button>上一篇: {previous.frontmatter.title}</button>
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                <button>下一篇: {next.frontmatter.title}</button>
              </Link>
            )}
          </li>
        </ul>
        
        {/* 添加Giscus评论组件 */}
        <GiscusComment slug={slug} />
      </Layout>
    )
  }
}

export default BlogPostTemplate

// 页面头部SEO信息
export const Head = ({ data, location }) => {
  // 获取文章数据
  const post = data.markdownRemark
  // 获取页面路径
  const pathname = location.pathname
  // 获取文章描述
  const siteDescription = post.frontmatter.description || post.excerpt
  return <SEO
    title={post.frontmatter.title}
    description={siteDescription}
    keywords={post.frontmatter.tags}
    pathname={pathname}
  />
}


// GraphQL查询，用于获取文章数据
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(truncate: true, pruneLength: 100)
      html
      tableOfContents
      frontmatter {
        title
        tags
        description
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
