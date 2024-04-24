import { NextResponse } from "next/server";

import { shopify } from "~/lib/shopify";
import { type ProductFieldsFragment } from "~/storefront";

export const runtime = "edge";

export async function GET() {
  const products: ProductFieldsFragment[] = [];

  let after: undefined | string = undefined;
  let hasMoreData = true;

  while (hasMoreData) {
    const { collection } = await shopify.Products({ after });

    if (!collection) {
      throw new Error("No products");
    }

    collection.products.edges.forEach(({ node }) => {
      products.push(node);
    });

    const pageInfo = collection.products.pageInfo;

    // Determine if there is more data to fetch
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      after = collection.products.pageInfo.endCursor ?? undefined;
    } else {
      hasMoreData = false; // Stop the while loop
    }
  }

  return NextResponse.json({ products });
}
