/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment CartFields on Cart {\n  __typename\n  id\n  totalQuantity\n  checkoutUrl\n  cost {\n    subtotalAmount {\n      amount\n      currencyCode\n    }\n    totalAmount {\n      amount\n      currencyCode\n    }\n    totalTaxAmount {\n      amount\n      currencyCode\n    }\n  }\n  lines(first: 250) {\n    __typename\n    edges {\n      __typename\n      node {\n        ... on CartLine {\n          __typename\n          ...LineItemFields\n        }\n      }\n    }\n  }\n}\n\nquery GetCart($cartId: ID!) {\n  cart(id: $cartId) {\n    ...CartFields\n  }\n}\n\nmutation RemoveCartItem($cartId: ID!, $lineItemId: ID!) {\n  cartLinesRemove(cartId: $cartId, lineIds: [$lineItemId]) {\n    cart {\n      ...CartFields\n    }\n  }\n}\n\nmutation UpdateCartItem($cartId: ID!, $lineItemId: ID!, $quantity: Int!) {\n  cartLinesUpdate(\n    cartId: $cartId\n    lines: [{id: $lineItemId, quantity: $quantity}]\n  ) {\n    cart {\n      ...CartFields\n    }\n  }\n}\n\nmutation AddCartItem($cartId: ID!, $lineItem: CartLineInput!) {\n  cartLinesAdd(cartId: $cartId, lines: [$lineItem]) {\n    cart {\n      ...CartFields\n    }\n  }\n}\n\nmutation CreateCart($input: CartInput) {\n  cartCreate(input: $input) {\n    cart {\n      ...CartFields\n    }\n    userErrors {\n      code\n      message\n    }\n  }\n}\n\nmutation CartAttributesUpdate($cartId: ID!, $buyerIdentidy: CartBuyerIdentityInput!, $attributes: [AttributeInput!]!) {\n  cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {\n    __typename\n  }\n  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentidy) {\n    __typename\n    cart {\n      checkoutUrl\n    }\n  }\n}": types.CartFieldsFragmentDoc,
    "fragment LineItemFields on CartLine {\n  __typename\n  id\n  quantity\n  cost {\n    __typename\n    totalAmount {\n      amount\n      currencyCode\n    }\n  }\n  merchandise {\n    __typename\n    ... on ProductVariant {\n      __typename\n      id\n      title\n      product {\n        __typename\n        id\n        title\n        vendor\n        productType\n      }\n      image {\n        __typename\n        id\n        url(transform: {maxHeight: 128, maxWidth: 128, scale: 2})\n        altText\n        width\n        height\n      }\n      price {\n        __typename\n        amount\n        currencyCode\n      }\n    }\n  }\n}": types.LineItemFieldsFragmentDoc,
    "query ShippingPolicy {\n  shop {\n    shippingPolicy {\n      title\n      body\n      url\n    }\n  }\n}\n\nquery Terms {\n  shop {\n    termsOfService {\n      body\n    }\n    privacyPolicy {\n      body\n    }\n  }\n}": types.ShippingPolicyDocument,
    "fragment PaginatedProductList on ProductConnection {\n  edges {\n    node {\n      ...ProductFields\n    }\n    cursor\n  }\n  pageInfo {\n    hasNextPage\n  }\n}": types.PaginatedProductListFragmentDoc,
    "query Product($id: ID!) {\n  product(id: $id) {\n    ...ProductFields\n    seo {\n      title\n      description\n    }\n  }\n}": types.ProductDocument,
    "fragment ProductFields on Product {\n  id\n  handle\n  title\n  description\n  availableForSale\n  totalInventory\n  vendor\n  productType\n  thruga: metafield(namespace: \"custom\", key: \"thruga\") {\n    value\n    type\n  }\n  country: metafield(namespace: \"custom\", key: \"country\") {\n    value\n    type\n  }\n  region: metafield(namespace: \"custom\", key: \"region\") {\n    value\n    type\n  }\n  wineType: metafield(namespace: \"custom\", key: \"wine_type\") {\n    value\n    type\n  }\n  framleidandi: metafield(namespace: \"custom\", key: \"framleidandi\") {\n    value\n    type\n  }\n  raektun: metafield(namespace: \"custom\", key: \"raektun\") {\n    value\n    type\n  }\n  abv: metafield(namespace: \"custom\", key: \"abv\") {\n    value\n    type\n  }\n  magn: metafield(namespace: \"custom\", key: \"magn\") {\n    value\n    type\n  }\n  variants(first: 10) {\n    edges {\n      node {\n        ...VariantFields\n      }\n    }\n  }\n}": types.ProductFieldsFragmentDoc,
    "query Products($after: String, $filters: [ProductFilter!]) {\n  collection(handle: \"in-stock\") {\n    products(first: 100, after: $after, filters: $filters) {\n      ...PaginatedProductList\n    }\n  }\n}\n\nquery ProductsByIds($ids: [ID!]!) {\n  nodes(ids: $ids) {\n    ... on Product {\n      __typename\n      ...ProductFields\n    }\n  }\n}": types.ProductsDocument,
    "fragment VariantFields on ProductVariant {\n  __typename\n  id\n  title\n  availableForSale\n  quantityAvailable\n  image {\n    __typename\n    id\n    url(transform: {maxHeight: 1200, maxWidth: 1200, scale: 2})\n    altText\n    width\n    height\n  }\n  price {\n    __typename\n    amount\n    currencyCode\n  }\n  compareAtPrice {\n    __typename\n    amount\n    currencyCode\n  }\n}": types.VariantFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment CartFields on Cart {\n  __typename\n  id\n  totalQuantity\n  checkoutUrl\n  cost {\n    subtotalAmount {\n      amount\n      currencyCode\n    }\n    totalAmount {\n      amount\n      currencyCode\n    }\n    totalTaxAmount {\n      amount\n      currencyCode\n    }\n  }\n  lines(first: 250) {\n    __typename\n    edges {\n      __typename\n      node {\n        ... on CartLine {\n          __typename\n          ...LineItemFields\n        }\n      }\n    }\n  }\n}\n\nquery GetCart($cartId: ID!) {\n  cart(id: $cartId) {\n    ...CartFields\n  }\n}\n\nmutation RemoveCartItem($cartId: ID!, $lineItemId: ID!) {\n  cartLinesRemove(cartId: $cartId, lineIds: [$lineItemId]) {\n    cart {\n      ...CartFields\n    }\n  }\n}\n\nmutation UpdateCartItem($cartId: ID!, $lineItemId: ID!, $quantity: Int!) {\n  cartLinesUpdate(\n    cartId: $cartId\n    lines: [{id: $lineItemId, quantity: $quantity}]\n  ) {\n    cart {\n      ...CartFields\n    }\n  }\n}\n\nmutation AddCartItem($cartId: ID!, $lineItem: CartLineInput!) {\n  cartLinesAdd(cartId: $cartId, lines: [$lineItem]) {\n    cart {\n      ...CartFields\n    }\n  }\n}\n\nmutation CreateCart($input: CartInput) {\n  cartCreate(input: $input) {\n    cart {\n      ...CartFields\n    }\n    userErrors {\n      code\n      message\n    }\n  }\n}\n\nmutation CartAttributesUpdate($cartId: ID!, $buyerIdentidy: CartBuyerIdentityInput!, $attributes: [AttributeInput!]!) {\n  cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {\n    __typename\n  }\n  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentidy) {\n    __typename\n    cart {\n      checkoutUrl\n    }\n  }\n}"): typeof import('./graphql').CartFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment LineItemFields on CartLine {\n  __typename\n  id\n  quantity\n  cost {\n    __typename\n    totalAmount {\n      amount\n      currencyCode\n    }\n  }\n  merchandise {\n    __typename\n    ... on ProductVariant {\n      __typename\n      id\n      title\n      product {\n        __typename\n        id\n        title\n        vendor\n        productType\n      }\n      image {\n        __typename\n        id\n        url(transform: {maxHeight: 128, maxWidth: 128, scale: 2})\n        altText\n        width\n        height\n      }\n      price {\n        __typename\n        amount\n        currencyCode\n      }\n    }\n  }\n}"): typeof import('./graphql').LineItemFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ShippingPolicy {\n  shop {\n    shippingPolicy {\n      title\n      body\n      url\n    }\n  }\n}\n\nquery Terms {\n  shop {\n    termsOfService {\n      body\n    }\n    privacyPolicy {\n      body\n    }\n  }\n}"): typeof import('./graphql').ShippingPolicyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PaginatedProductList on ProductConnection {\n  edges {\n    node {\n      ...ProductFields\n    }\n    cursor\n  }\n  pageInfo {\n    hasNextPage\n  }\n}"): typeof import('./graphql').PaginatedProductListFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Product($id: ID!) {\n  product(id: $id) {\n    ...ProductFields\n    seo {\n      title\n      description\n    }\n  }\n}"): typeof import('./graphql').ProductDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ProductFields on Product {\n  id\n  handle\n  title\n  description\n  availableForSale\n  totalInventory\n  vendor\n  productType\n  thruga: metafield(namespace: \"custom\", key: \"thruga\") {\n    value\n    type\n  }\n  country: metafield(namespace: \"custom\", key: \"country\") {\n    value\n    type\n  }\n  region: metafield(namespace: \"custom\", key: \"region\") {\n    value\n    type\n  }\n  wineType: metafield(namespace: \"custom\", key: \"wine_type\") {\n    value\n    type\n  }\n  framleidandi: metafield(namespace: \"custom\", key: \"framleidandi\") {\n    value\n    type\n  }\n  raektun: metafield(namespace: \"custom\", key: \"raektun\") {\n    value\n    type\n  }\n  abv: metafield(namespace: \"custom\", key: \"abv\") {\n    value\n    type\n  }\n  magn: metafield(namespace: \"custom\", key: \"magn\") {\n    value\n    type\n  }\n  variants(first: 10) {\n    edges {\n      node {\n        ...VariantFields\n      }\n    }\n  }\n}"): typeof import('./graphql').ProductFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Products($after: String, $filters: [ProductFilter!]) {\n  collection(handle: \"in-stock\") {\n    products(first: 100, after: $after, filters: $filters) {\n      ...PaginatedProductList\n    }\n  }\n}\n\nquery ProductsByIds($ids: [ID!]!) {\n  nodes(ids: $ids) {\n    ... on Product {\n      __typename\n      ...ProductFields\n    }\n  }\n}"): typeof import('./graphql').ProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment VariantFields on ProductVariant {\n  __typename\n  id\n  title\n  availableForSale\n  quantityAvailable\n  image {\n    __typename\n    id\n    url(transform: {maxHeight: 1200, maxWidth: 1200, scale: 2})\n    altText\n    width\n    height\n  }\n  price {\n    __typename\n    amount\n    currencyCode\n  }\n  compareAtPrice {\n    __typename\n    amount\n    currencyCode\n  }\n}"): typeof import('./graphql').VariantFieldsFragmentDoc;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
