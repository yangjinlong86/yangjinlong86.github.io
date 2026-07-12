import React from 'react'
import Layout from '../components/layout'
import PropTypes from 'prop-types'
import SEO from '../components/seo'

import { Link, graphql } from 'gatsby'

const TagsPage = ({
  location: { pathname },
  data: {
    allMarkdownRemark: { group },
  },
}) => (
  <Layout pageName="标签">
    <ul className="css-tags">
      {group.map((tag) => (
        <li key={tag.fieldValue} className="css-tag">
          <Link to={`/tag/${tag.fieldValue}/`}>
            #{tag.fieldValue} <sup>{tag.totalCount}</sup>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const Head = ({ location }) => (
  <SEO title="标签库" pathname={location.pathname} />
)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
    ) {
      group(field: {frontmatter: {tags: SELECT}}) {
        fieldValue
        totalCount
      }
    }
  }
`
