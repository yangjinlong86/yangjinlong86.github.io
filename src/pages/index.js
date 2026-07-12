import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'

function IndexPage({ data }) {
  const posts = data.allMarkdownRemark.edges
  
  return (
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
                        fontSize: '1.8em',
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
    </Layout>
  )
}

export default IndexPage

export const Head = ({ location }) => (
  <SEO 
    title="主页" 
    pathname={location.pathname} 
    description="一步一步，走出自己的轨迹"
  />
)

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
    ) {
      edges {
        node {
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
