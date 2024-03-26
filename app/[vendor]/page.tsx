import { ProductsGrid } from "~/app/_components/products-grid";
import { getVendorFromSlug } from "~/lib/commerce";
import { getFirstSearchParam, type SearchParams } from "~/lib/search-params";
import { shopify } from "~/lib/shopify";

export const runtime = "edge";

export default async function Page({
  params: { vendor },
  searchParams,
}: {
  params: { vendor: string };
  searchParams: SearchParams;
}) {
  const wineType = getFirstSearchParam(searchParams, "wineType");
  const vendorName = getVendorFromSlug(vendor)?.shopifyVendor ?? "";
  const { collection } = await shopify.Products({
    filters: [
      {
        productVendor: vendorName,
      },
      wineType
        ? {
            productMetafield: {
              namespace: "custom",
              key: "wine_type",
              value: wineType,
            },
          }
        : null,
    ].filter(Boolean),
  });
  const products = collection?.products;
  if (!products) {
    return "Empty";
  }
  return <ProductsGrid products={products} />;
}
