import Link from "next/link";
import { Fragment } from "react";

import { dato } from "~/lib/dato";
import { getFirstSearchParam, type SearchParams } from "~/lib/search-params";
import { shopify } from "~/lib/shopify";

import { DatoImage } from "./_components/dato-image";
import { ProductEmbed } from "./_components/product-embed";
import { ProductsGrid } from "./_components/products-grid";

export const runtime = "edge";

async function Posts() {
  const posts = await dato.Posts();
  const ids = posts.allPosts.flatMap(({ content }) =>
    content.blocks.map(({ shopifyProductId }) => shopifyProductId),
  );
  const { nodes } = await shopify.ProductsByIds({
    ids: ids.map((id) => `gid://shopify/Product/${id}`),
  });
  const products = nodes.flatMap((node) =>
    node?.__typename === "Product" ? [node] : [],
  );
  return (
    <div>
      {posts.allPosts.map(({ id, slug, title, excerpt, image, date }) => (
        <Fragment key={id}>
          <div className="mx-auto my-8 grid grid-cols-[auto,1fr] gap-4 md:max-w-3xl md:gap-8">
            <div className="max-w-32 sm:max-w-none">
              <DatoImage
                data={image.responsiveImage}
                className="overflow-hidden rounded-md shadow-xl"
              />
            </div>
            <div>
              <h1 className="mb-0.5 text-xl md:mb-2 md:text-4xl">{title}</h1>
              <p className="mb-4 text-xs sm:text-sm">{excerpt}</p>
              <div className="flex justify-between text-sm">
                <time
                  suppressHydrationWarning
                  className="italic text-neutral-500"
                >
                  {new Date(`${date}T00:00:00`).toLocaleDateString()}
                </time>
                <Link className="text-[blue]" href={`/blogg/${slug}`}>
                  Lesa meira
                </Link>
              </div>
              <div className="mt-4 hidden w-full grid-cols-2 gap-4 md:grid">
                {products.map((product) => (
                  <ProductEmbed key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 md:hidden">
            {products.map((product) => (
              <ProductEmbed key={product.id} product={product} />
            ))}
          </div>
          <hr className="mx-auto my-8 h-px w-1/3 bg-neutral-400" />
        </Fragment>
      ))}
    </div>
  );
}

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
  return (
    <div>
      {!wineType ? <Posts /> : null}
      <ProductsGrid products={products} />
    </div>
  );
}
