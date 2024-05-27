import { graphql } from "./dato";

export const Post = graphql(`
  query Post($slug: String!) {
    post(filter: { slug: { eq: $slug } }) {
      id
      slug
      title
      date
      excerpt
      content {
        __typename
        links
        blocks {
          __typename
          ... on ProductRecord {
            id
            shopifyProductId
          }
          ... on ImageRecord {
            id
            image {
              responsiveImage(imgixParams: { auto: format, w: 1200 }) {
                srcSet
                webpSrcSet
                sizes
                src
                width
                height
                aspectRatio
                alt
                title
                base64
                bgColor
              }
            }
          }
        }
        value
      }
      image {
        responsiveImage(imgixParams: { w: 640, h: 640 }) {
          width
          height
          src
          alt
        }
      }
      _status
      _firstPublishedAt
      _seoMetaTags {
        __typename
        attributes
        content
        tag
      }
    }
  }
`);
