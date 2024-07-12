import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductsGrid } from "~/app/_components/products-grid";
import { client } from "~/graphql/shopify";
import { getProductTypeFromSlug } from "~/lib/commerce";
import { Products } from "~/lib/products";
import { type SearchParams } from "~/lib/search-params";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: { category: string };
  searchParams: SearchParams;
}

export function generateMetadata({ params }: Props): Metadata {
  const productType = getProductTypeFromSlug(params.category);
  if (!productType) {
    throw notFound();
  }
  const title = `${productType} - Somm`;
  return {
    title,
    description: `${productType} til sölu á Somm`,
    openGraph: { title },
  };
}

export default async function Page({
  params: { category },
  searchParams,
}: Props) {
  const productType = getProductTypeFromSlug(category);
  if (!productType) {
    throw notFound();
  }
  const { collection } = await client.request(Products, {
    filters: [{ productType }],
  });
  const products = collection?.products;
  if (!products?.edges.length) {
    return "Engar vörur";
  }
  return <ProductsGrid products={products} />;
}
