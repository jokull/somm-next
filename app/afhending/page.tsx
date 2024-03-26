import { shopify } from "~/lib/shopify";

import { Prose } from "../_components/prose";

export const runtime = "edge";

export default async function Page() {
  const result = await shopify.ShippingPolicy();
  return (
    <Prose
      html={`
        ${result.shop.shippingPolicy?.body ?? ""}
      `}
    />
  );
}
