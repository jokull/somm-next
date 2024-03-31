import Link from "next/link";
import { Fragment } from "react";

import { dato } from "~/lib/dato";
import { getFirstSearchParam, type SearchParams } from "~/lib/search-params";
import { shopify } from "~/lib/shopify";

import { DatoImage } from "./_components/dato-image";
import { PostContent } from "./_components/post-content";
import { ProductsGrid } from "./_components/products-grid";

export const runtime = "edge";

async function Posts() {
  const posts = await dato.Posts();
  return (
    <div>
      {posts.allPosts.map(({ id, slug, title, content, image, date }) => (
        <Fragment key={id}>
          <div className="mx-auto my-8 grid grid-cols-2 gap-4 md:max-w-3xl">
            <div>
              <DatoImage
                data={image.responsiveImage}
                className="overflow-hidden rounded-md shadow-xl"
              />
            </div>
            <div>
              <h1 className="mb-0.5 text-lg md:mb-2 md:text-4xl">{title}</h1>
              <time
                suppressHydrationWarning
                className="mb-2 block text-xs text-neutral-500"
              >
                {new Date(`${date}T00:00:00`).toLocaleDateString()}
              </time>
              <div className="mb-4 line-clamp-5 text-sm">
                <PostContent field={content} />
              </div>
              <Link
                className="block text-right text-sm text-[blue]"
                href={`/blogg/${slug}`}
              >
                Lesa meira
              </Link>
            </div>
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
