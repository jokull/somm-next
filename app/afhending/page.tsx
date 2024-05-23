import { type Metadata } from "next";

import { client, graphql } from "~/graphql/shopify";

import { Prose } from "../_components/prose";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Afhending — Somm",
};

export default async function Page() {
  const result = await client.request(
    graphql(`
      query ShippingPolicy {
        shop {
          shippingPolicy {
            body
          }
        }
      }
    `),
  );
  return (
    <Prose
      html={`
        ${result.shop.shippingPolicy?.body ?? ""}
      `}
    />
  );
}
