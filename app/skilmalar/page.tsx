import { type Metadata } from "next";

import { shopify } from "~/lib/shopify";

import { Prose } from "../_components/prose";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Skilmálar — Somm",
};

export default async function Page() {
  const result = await shopify.Terms();
  return (
    <Prose
      html={`
        ${result.shop.termsOfService?.body ?? ""}
        ${result.shop.privacyPolicy?.body ?? ""}
      `}
    />
  );
}
