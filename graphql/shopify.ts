import { initGraphQLTada } from "gql.tada";
import { GraphQLClient } from "graphql-request";

import { env } from "~/env.ts";

import type { introspection } from "./shopify-env.d.ts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    Decimal: string;
    URL: string;
  };
}>();

export const client = new GraphQLClient(
  "https://somm-is.myshopify.com/api/2024-04/graphql",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Storefront-Access-Token":
        env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    cache: "no-cache",
  },
);
