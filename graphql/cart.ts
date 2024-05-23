import { type FragmentOf, type ResultOf } from "gql.tada";

import { graphql } from "./shopify";

const lineItemFragment = graphql(`
  fragment LineItemFields on CartLine @_unmask {
    __typename
    id
    quantity
    cost {
      __typename
      totalAmount {
        amount
      }
    }
    merchandise {
      __typename
      ... on ProductVariant {
        __typename
        id
        title
        product {
          __typename
          id
          title
          vendor
          productType
        }
        image {
          __typename
          id
          url(transform: { maxHeight: 128, maxWidth: 128, scale: 2 })
          altText
          width
          height
        }
        price {
          __typename
          amount
          currencyCode
        }
      }
    }
  }
`);

export const cartFragment = graphql(
  `
    fragment Cart on Cart @_unmask {
      __typename
      id
      totalQuantity
      checkoutUrl
      cost {
        subtotalAmount {
          __typename
          amount
          currencyCode
        }
        totalAmount {
          __typename
          amount
          currencyCode
        }
        totalTaxAmount {
          __typename
          amount
          currencyCode
        }
      }
      lines(first: 250) {
        __typename
        edges {
          __typename
          node {
            ... on CartLine {
              ...LineItemFields
            }
          }
        }
      }
    }
  `,
  [lineItemFragment],
);

export const GetCartQuery = graphql(
  `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...Cart
      }
    }
  `,
  [cartFragment],
);

export type Cart = NonNullable<ResultOf<typeof GetCartQuery>["cart"]>;

export type CartLine = Extract<
  FragmentOf<typeof lineItemFragment>,
  { __typename: "CartLine" }
>;
