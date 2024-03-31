import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductsGrid } from "~/app/_components/products-grid";
import { getVendorFromSlug } from "~/lib/commerce";
import { getFirstSearchParam, type SearchParams } from "~/lib/search-params";
import { shopify } from "~/lib/shopify";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: { vendor: string };
  searchParams: SearchParams;
}

export function generateMetadata({ params }: Props): Metadata {
  const vendorName = getVendorFromSlug(params.vendor)?.name;
  if (!vendorName) {
    throw notFound();
  }
  return {
    title: `${vendorName} - Somm`,
    description: `Vín flutt inn af ${vendorName} til sölu á Somm`,
  };
}

export default async function Page({
  params: { vendor },
  searchParams,
}: Props) {
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
  if (!products?.edges.length) {
    return "Engar vörur";
  }
  return <ProductsGrid products={products} />;
}
