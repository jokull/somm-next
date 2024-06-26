import { type FragmentOf } from "gql.tada";
import Link from "next/link";
import { notFound } from "next/navigation";

import { client, graphql } from "~/graphql/dato";
import { client as shopify_client } from "~/graphql/shopify";
import { Products } from "~/lib/products";
import { getFirstSearchParam, type SearchParams } from "~/lib/search-params";

import { DatoImage } from "./_components/dato-image";
import { getProducts } from "./_components/post-content";
import { ProductEmbed } from "./_components/product-embed";
import { ProductsGrid } from "./_components/products-grid";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const postFragment = graphql(`
  fragment Post on PostRecord @_unmask {
    id
    slug
    title
    date
    excerpt
    content {
      blocks {
        ... on ProductRecord {
          __typename
          id
          shopifyProductId
        }
      }
    }
    image {
      responsiveImage(imgixParams: { w: 320, h: 320 }) {
        width
        height
        src
        alt
      }
    }
    _status
    _firstPublishedAt
  }
`);

const homePageQuery = graphql(
  `
    query HomePage {
      homePage {
        id
        post {
          ...Post
        }
      }
    }
  `,
  [postFragment],
);

async function Post({ post }: { post: FragmentOf<typeof postFragment> }) {
  const products = (
    await getProducts(
      post.content.blocks.flatMap((block) =>
        block.__typename === "ProductRecord" ? [block] : [],
      ),
    )
  ).slice(0, 2);
  const date = new Date(`${post.date}T00:00:00`);
  return (
    <div className="mb-8">
      <div className="md:hidden">
        <div className="text-light text-center text-sm text-neutral-500">
          Kynning
        </div>
        <h1 className="text-center text-2xl">
          <Link href={`/blogg/${post.slug}`}>{post.title}</Link>
        </h1>
      </div>
      <div className="mx-auto my-8 grid grid-cols-[auto,1fr] gap-4 md:max-w-3xl md:gap-8">
        <Link href={`/blogg/${post.slug}`} className="max-w-32 sm:max-w-none">
          <DatoImage
            data={post.image.responsiveImage}
            className="overflow-hidden rounded-md shadow-xl"
          />
        </Link>
        <div className="flex flex-col">
          <h1 className="mb-0.5 hidden text-4xl md:mb-2 md:block">
            <Link href={`/blogg/${post.slug}`}>{post.title}</Link>
          </h1>
          <p className="mb-4 grow text-xs sm:text-sm">{post.excerpt}</p>
          <div className="flex justify-between text-sm">
            <time
              suppressHydrationWarning
              className="font-light text-neutral-500"
            >
              {date
                .toLocaleDateString("is-IS", {
                  timeStyle: undefined,
                  dateStyle: "full",
                })
                .charAt(0)
                .toLocaleUpperCase() +
                date
                  .toLocaleDateString("is-IS", {
                    timeStyle: undefined,
                    dateStyle: "full",
                  })
                  .slice(1)}
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
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const productType = getFirstSearchParam(searchParams, "tegund");
  const { collection } = await shopify_client.request(Products, {
    filters: productType ? [{ productType }] : [{}],
  });
  const products = collection?.products;

  const { homePage } = await client.request({
    document: homePageQuery,
  });

  if (!homePage) {
    notFound();
  }

  return (
    <div>
      {!productType ? (
        <div className="my-20">
          <Post post={homePage.post} />
        </div>
      ) : null}
      {products ? (
        <div className="mt-12">
          <div className="my-8 text-center text-sm italic">
            {productType === "Bjór" ? "Bjórarnir" : "Vínin"}
          </div>
          <ProductsGrid products={products} key={productType} />
        </div>
      ) : null}
    </div>
  );
}
