import { NextResponse } from "next/server";

import { client, graphql } from "~/graphql/shopify";

export const runtime = "edge";

const Products = graphql(`
  query Products($after: String) {
    collection(handle: "in-stock") {
      products(first: 100, after: $after) {
        edges {
          node {
            id
            vendor
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`);

async function request(after: string | undefined) {
  return (await client.request(Products, { after })).collection?.products;
}

export async function GET() {
  const products: { id: string; vendor: string }[] = [];

  let after: undefined | string = undefined;
  let hasMoreData = true;

  while (hasMoreData) {
    const _products = await request(after);

    if (!_products) {
      throw new Error("No result");
    }

    _products.edges.forEach((edge) => {
      products.push(edge.node);
    });

    const pageInfo = _products.pageInfo;

    // Determine if there is more data to fetch
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      after = _products.pageInfo.endCursor ?? undefined;
    } else {
      hasMoreData = false; // Stop the while loop
    }
  }

  return NextResponse.json({ products });
}
