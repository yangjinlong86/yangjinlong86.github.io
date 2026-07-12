import React from 'react'
import { Link, graphql } from 'gatsby'
import SEO from '../components/seo'
import Layout from '../components/layout'
import Info from '../components/PostInfo'
import Pagination from '../components/Pagination'

// 标签描述映射表
const tagDescriptionMap = {}

/**
 * 特定标签的博客列表页面
 */
class BlogIndex extends React.Component {
  render() {
    // 获取页面数据
    const { data } = this.props
    // 获取文章列表
    const posts = data.allMarkdownRemark.edges
    // 获取分页信息和标签信息
    const { totalPage, currentPage, tag } = this.props.pageContext
    return (
      // 使用布局组件，传入标签名和描述
      <Layout pageName={tag} pageDescript={tagDescriptionMap[tag]}>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div className="list-item" key={node.fields.slug}>
              <div className="list-title">
                <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                  {title}
                </Link>
              </div>
              <Info date={node.frontmatter.date} tags={node.frontmatter.tags} />
              <p className="list-excerpt">
                {node.frontmatter.description || node.excerpt}
              </p>
            </div>
          )
        })}
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          prefix={`/tag/${tag}/`}
        />
      </Layout>
    )
  }
}

export default BlogIndex

// 页面头部SEO信息
export const Head = ({ location, pageContext }) => (
  <SEO
    title={pageContext.tag}
    pathname={location.pathname}
    description={tagDescriptionMap[pageContext.tag]}
  />
)

// GraphQL查询，用于获取特定标签的文章列表数据
export const pageQuery = graphql`
  query ($tag: String!, $skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      filter: {frontmatter: {tags: {in: [$tag]}}}
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(truncate: true, pruneLength: 100)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            tags
            description
          }
        }
      }
    }
  }
`
