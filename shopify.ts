import { type DocumentNode, type GraphQLError } from "graphql";
import { print } from "graphql/language/printer";
import { z } from "zod";

import { env } from "./env";
import { getSdk } from "./storefront";

const responseSchema = z.union([
  z.object({ errors: z.array(z.unknown()) }),
  z.object({ data: z.unknown() }),
]);

export function getRequester<T extends RequestInit = RequestInit>({
  initialOptions,
  globalFetch,
}: {
  globalFetch: typeof fetch;
  initialOptions?: Partial<T>;
}) {
  async function inner<R, V>(
    doc: DocumentNode,
    variables?: V,
    options?: Partial<T>,
  ) {
    const res = await globalFetch(
      `https://somm-is.myshopify.com/api/2024-04/graphql`,
      {
        body: JSON.stringify({ query: print(doc), variables }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Shopify-Storefront-Access-Token":
            env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        method: "POST",
        ...(options ?? {}),
        ...(initialOptions ?? {}),
      },
    );

    const result = responseSchema.parse(await res.json());

    if ("errors" in result) {
      const errors = result.errors as GraphQLError[];
      const { message } = errors[0] ?? { message: "Unknown error" };
      throw new Error(message);
    }

    return result.data as R;
  }
  return inner;
}

export function getShopifyClient() {
  return getSdk(getRequester({ globalFetch: fetch }));
}
