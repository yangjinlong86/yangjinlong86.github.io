import React from 'react'
import { Link, graphql } from 'gatsby'
import Pagination from '../components/Pagination'
import SEO from '../components/seo'

import Layout from '../components/layout'
/**
 * 归档页面
 */
class BlogIndex extends React.Component {
  render() {
    // 获取页面数据和位置信息
    const { data, location } = this.props
    // 获取文章列表
    const posts = data.allMarkdownRemark.edges
    // 获取分页信息
    const { totalPage, currentPage } = this.props.pageContext
    return (
      // 使用布局组件
      <Layout>
        <div className="css-archive">
          {posts.map(({ node }, index) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <React.Fragment key={node.fields.slug}>
                {(index === 0 ||
                  (index > 0 &&
                    posts[index - 1].node.frontmatter.year !==
                    node.frontmatter.year)) && (
                    <div
                      className="year-title"
                      style={{
                        marginTop: index === 0 ? '0rem' : '2rem',
                        marginBottom: '1.2rem',
                      }}
                    >
                      {node.frontmatter.year}
                    </div>
                  )}
                <div className="item">
                  <span className="date">{node.frontmatter.date}</span>
                  <Link className="title" to={node.fields.slug}>
                    {title}
                  </Link>
                </div>
              </React.Fragment>
            )
          })}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          prefix={'/archive/'}
        />
      </Layout>
    )
  }
}

export default BlogIndex

// 页面头部SEO信息
export const Head = ({ location }) => (
  <SEO
    title="归档"
    pathname={location.pathname}
    description="一步一步，走出自己的轨迹"
  />
)

// GraphQL查询，用于获取文章列表数据
export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(truncate: true)
          fields {
            slug
          }
          frontmatter {
            year: date(formatString: "YYYY")
            date(formatString: "MM-DD")
            title
          }
        }
      }
    }
  }
`
