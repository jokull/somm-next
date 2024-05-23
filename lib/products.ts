import { graphql } from "~/graphql/shopify";

export const variantFragment = graphql(`
  fragment VariantFields on ProductVariant @_unmask {
    __typename
    id
    title
    availableForSale
    quantityAvailable
    image {
      __typename
      id
      url(transform: { maxHeight: 1200, maxWidth: 1200, scale: 2 })
      altText
      width
      height
    }
    price {
      __typename
      amount
      currencyCode
    }
    compareAtPrice {
      __typename
      amount
      currencyCode
    }
  }
`);

export const productFragment = graphql(
  `
    fragment ProductFields on Product @_unmask {
      id
      handle
      title
      description
      availableForSale
      totalInventory
      vendor
      productType
      featuredImage {
        __typename
        id
        url(transform: { maxHeight: 250, maxWidth: 250, scale: 2 })
        altText
        width
        height
      }
      thruga: metafield(namespace: "custom", key: "thruga") {
        value
        type
      }
      country: metafield(namespace: "custom", key: "country") {
        value
        type
      }
      region: metafield(namespace: "custom", key: "region") {
        value
        type
      }
      wineType: metafield(namespace: "custom", key: "wine_type") {
        value
        type
      }
      framleidandi: metafield(namespace: "custom", key: "framleidandi") {
        value
        type
      }
      abv: metafield(namespace: "custom", key: "abv") {
        value
        type
      }
      magn: metafield(namespace: "custom", key: "magn") {
        value
        type
      }
      variants(first: 10) {
        edges {
          node {
            ...VariantFields
          }
        }
      }
    }
  `,
  [variantFragment],
);

export const paginatedProductsFragment = graphql(
  `
    fragment PaginatedProductList on ProductConnection @_unmask {
      edges {
        node {
          ...ProductFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `,
  [productFragment],
);

export const Products = graphql(
  `
    query Products($after: String, $filters: [ProductFilter!]) {
      collection(handle: "in-stock") {
        products(first: 100, after: $after, filters: $filters) {
          ...PaginatedProductList
        }
      }
    }
  `,
  [paginatedProductsFragment],
);
