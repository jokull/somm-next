import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { client, graphql } from "~/graphql/shopify";
import { getSlugFromProductType } from "~/lib/commerce";

export async function GET(
  request: Request,
  { params }: { params: { vendor: string; id: string } },
) {
  const { id } = params;
  const { product } = await client.request(
    graphql(`
      query Product($id: ID!) {
        product(id: $id) {
          title
          framleidandi: metafield(namespace: "custom", key: "framleidandi") {
            value
            type
          }
          wineType: metafield(namespace: "custom", key: "wine_type") {
            value
            type
          }
        }
      }
    `),
    {
      id: `gid://shopify/Product/${params.id}`,
    },
  );
  const slug = getSlugFromProductType(product?.wineType?.value);
  if (!slug) {
    notFound();
  }
  return NextResponse.redirect(new URL(`/${slug}/${id}`, request.url), 301); // 301 for permanent redirect
}
