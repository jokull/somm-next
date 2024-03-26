import { getFirstSearchParam, type SearchParams } from "~/lib/search-params";
import { shopify } from "~/lib/shopify";

import { ProductsGrid } from "./_components/products-grid";

export const runtime = "edge";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const wineType = getFirstSearchParam(searchParams, "wineType");
  const { collection } = await shopify.Products({
    filters: wineType
      ? [
          {
            productMetafield: {
              namespace: "custom",
              key: "wine_type",
              value: wineType,
            },
          },
        ]
      : {},
  });
  const products = collection?.products;
  if (!products) {
    return "Empty";
  }
  return <ProductsGrid products={products} />;
}
