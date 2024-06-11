import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { VendorName } from "~/app/_components/vendor-name";
import { client, graphql } from "~/graphql/shopify";
import { getProductQuantityStep, getVendorFromSlug } from "~/lib/commerce";
import { variantFragment } from "~/lib/products";
import { unwrap } from "~/lib/shopify";

import { Variants } from "./_components/variants";

export const runtime = "edge";
export const dynamic = "force-dynamic";
interface Props {
  params: { vendor: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await client.request(
    graphql(`
      query Product($id: ID!) {
        product(id: $id) {
          title
          framleidandi: metafield(namespace: "custom", key: "framleidandi") {
            value
            type
          }
        }
      }
    `),
    {
      id: `gid://shopify/Product/${params.id}`,
    },
  );

  const vendorName = getVendorFromSlug(params.vendor)?.name;

  if (!product || !vendorName) {
    notFound();
  }

  const title = `${product.title} — ${vendorName} — Somm`;

  return {
    title,
    description: `${product.title} frá ${product.framleidandi?.value ?? vendorName}`,
    openGraph: {
      title,
      images: [
        {
          url: `/opengraph-images/${params.vendor}/${params.id}.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProductComponent({
  params,
}: {
  params: { vendor: string; id: string };
}) {
  const { product } = await client.request(
    graphql(
      `
        query Product($id: ID!) {
          product(id: $id) {
            handle
            title
            description
            availableForSale
            totalInventory
            vendor
            productType
            featuredImage {
              __typename
              id
              url(transform: { maxHeight: 250, maxWidth: 250, scale: 2 })
              altText
              width
              height
            }
            thruga: metafield(namespace: "custom", key: "thruga") {
              value
              type
            }
            country: metafield(namespace: "custom", key: "country") {
              value
              type
            }
            region: metafield(namespace: "custom", key: "region") {
              value
              type
            }
            wineType: metafield(namespace: "custom", key: "wine_type") {
              value
              type
            }
            framleidandi: metafield(namespace: "custom", key: "framleidandi") {
              value
              type
            }
            raektun: metafield(namespace: "custom", key: "raektun") {
              value
              type
            }
            abv: metafield(namespace: "custom", key: "abv") {
              value
              type
            }
            magn: metafield(namespace: "custom", key: "magn") {
              value
              type
            }
            variants(first: 10) {
              edges {
                node {
                  ...VariantFields
                }
              }
            }
          }
        }
      `,
      [variantFragment],
    ),
    {
      id: `gid://shopify/Product/${params.id}`,
    },
  );

  if (!product) {
    notFound();
  }

  const variants = unwrap(product.variants);

  const selectedVariant =
    variants.find((variant) => variant.availableForSale) ?? variants[0];

  if (!selectedVariant) {
    notFound();
  }

  const raektun = z
    .array(z.string())
    .catch([])
    .parse(JSON.parse(product.raektun?.value ?? "[]"));
  const thruga = z
    .array(z.string())
    .catch([])
    .parse(JSON.parse(product.thruga?.value ?? "[]"));
  const vendor = getVendorFromSlug(params.vendor);

  if (!vendor) {
    notFound();
  }

  const productQuantityStep = getProductQuantityStep(product.productType);

  return (
    <div className="flex flex-col gap-8 sm:flex-row">
      {selectedVariant.image && (
        <div className="grow-0 sm:w-1/2">
          <img
            src={selectedVariant.image.url}
            width={selectedVariant.image.width ?? undefined}
            height={selectedVariant.image.height ?? undefined}
            className="aspect-[3/4] rounded object-cover shadow-xl"
            loading="lazy"
            alt="Product"
          />
        </div>
      )}
      <div className="grow sm:max-w-xs">
        <div className="mb-4 border-b pb-2">
          <VendorName vendor={vendor} linkify />
        </div>
        <h1 className="mb-4 text-2xl">
          <strong>{product.title}</strong>
        </h1>
        {product.description.trim() ? <p>{product.description}</p> : null}
        <table className="table w-full max-w-sm">
          <tbody>
            {product.wineType && (
              <tr>
                <td className="pr-2">Tegund</td>
                <td>{product.wineType.value}</td>
              </tr>
            )}
            {product.framleidandi && (
              <tr>
                <td className="pr-2">Framleiðandi</td>
                <td>{product.framleidandi.value}</td>
              </tr>
            )}
            {product.region && (
              <tr>
                <td className="pr-2">Hérað</td>
                <td>{product.region.value}</td>
              </tr>
            )}
            {product.country && (
              <tr>
                <td className="pr-2">Land</td>
                <td>{product.country.value}</td>
              </tr>
            )}
            {thruga.length > 0 && (
              <tr>
                <td className="pr-2">Þrúga</td>
                <td>{thruga.join(", ")}</td>
              </tr>
            )}
            {product.magn && (
              <tr>
                <td className="pr-2">Magn</td>
                <td>
                  {Number(product.magn.value).toLocaleString("de-DE", {
                    maximumFractionDigits: 3,
                  })}
                  L
                </td>
              </tr>
            )}
            {product.abv && (
              <tr>
                <td className="pr-2">ABV</td>
                <td>
                  {Number(product.abv.value).toLocaleString("de-DE", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  %
                </td>
              </tr>
            )}
            {raektun.length > 0 && (
              <tr>
                <td className="pr-2">Ræktun</td>
                <td>{raektun.join(", ")}</td>
              </tr>
            )}
          </tbody>
        </table>
        <Variants
          variants={variants.filter((v) => v.availableForSale)}
          productQuantityStep={productQuantityStep}
        />
      </div>
    </div>
  );
}
