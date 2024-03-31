import Link from "next/link";
import { notFound } from "next/navigation";

import { type HomePageQuery } from "~/dato";
import { dato } from "~/lib/dato";
import { getFirstSearchParam, type SearchParams } from "~/lib/search-params";
import { shopify } from "~/lib/shopify";

import { DatoImage } from "./_components/dato-image";
import { getProducts } from "./_components/post-content";
import { ProductEmbed } from "./_components/product-embed";
import { ProductsGrid } from "./_components/products-grid";

export const runtime = "edge";

async function Post({
  post,
}: {
  post: NonNullable<HomePageQuery["homePage"]>["post"];
}) {
  const products = await getProducts(post.content.blocks);
  return (
    <div>
      <div className="md:hidden">
        <div className="text-light text-center text-sm text-neutral-500">
          Kynning
        </div>
        <h1 className="text-center text-2xl">{post.title}</h1>
      </div>
      <div className="mx-auto my-8 grid grid-cols-[auto,1fr] gap-4 md:max-w-3xl md:gap-8">
        <div className="max-w-32 sm:max-w-none">
          <DatoImage
            data={post.image.responsiveImage}
            className="overflow-hidden rounded-md shadow-xl"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="mb-0.5 hidden text-4xl md:mb-2 md:block">
            {post.title}
          </h1>
          <p className="mb-4 grow text-xs sm:text-sm">{post.excerpt}</p>
          <div className="flex justify-between text-sm">
            <time
              suppressHydrationWarning
              className="font-thin text-neutral-500"
            >
              {new Date(`${post.date}T00:00:00`).toLocaleDateString()}
            </time>
            <Link className="text-[blue]" href={`/blogg/${post.slug}`}>
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
      <hr className="mx-auto my-12 h-px w-1/3 bg-neutral-400" />
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

  const { homePage } = await dato.HomePage();
  if (!homePage) {
    notFound();
  }

  return (
    <div>
      {!wineType ? (
        <div className="my-8">
          <Post post={homePage.post} />
        </div>
      ) : null}
      {products ? <ProductsGrid products={products} /> : null}
    </div>
  );
}
