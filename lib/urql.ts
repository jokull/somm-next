import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, fetchExchange } from "urql";

import { env } from "~/env";
import { type MutationCartLinesUpdateArgs } from "~/storefront";

import { GetCartDocument, type UpdateCartItemMutation } from "./gql/graphql";

export const client = new Client({
  url: "https://somm-is.myshopify.com/api/2024-04/graphql",
  fetch,
  fetchOptions: {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Storefront-Access-Token":
        env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
  },
  exchanges: [
    cacheExchange({
      optimistic: {
        cartLinesUpdate: (args: MutationCartLinesUpdateArgs, cache) => {
          const response = cache.readQuery({
            query: GetCartDocument.toString(),
            variables: { cartId: args.cartId },
          });
          if (response?.cart) {
            return {
              ...response,
              cart: {
                ...response.cart,
                lines: {
                  ...response.cart.lines,
                  edges: response.cart.lines.edges.flatMap((edge) => {
                    if (edge.node.__typename !== "CartLine") {
                      return edge;
                    } else {
                      const id = edge.node.id;
                      const quantity = args.lines.find(
                        (line) => line.id === id,
                      )?.quantity;
                      return {
                        ...edge,
                        node: {
                          ...edge.node,
                          quantity: quantity ?? edge.node.quantity,
                        },
                      };
                    }
                  }),
                },
              },
            } satisfies {
              cart: NonNullable<
                NonNullable<UpdateCartItemMutation["cartLinesUpdate"]>["cart"]
              >;
            };
          }
          return null;
        },
      },
    }),
    fetchExchange,
  ],
});