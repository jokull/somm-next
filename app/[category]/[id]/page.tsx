import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { VendorName } from "~/app/_components/vendor-name";
import { client, graphql } from "~/graphql/shopify";
import {
  getProductQuantityStep,
  getProductTypeFromSlug,
  getVendorFromName,
} from "~/lib/commerce";
import { variantFragment } from "~/lib/products";
import { unwrap } from "~/lib/shopify";

import { Variants } from "./_components/variants";

export const runtime = "edge";
export const dynamic = "force-dynamic";
interface Props {
  params: { category: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await client.request(
    graphql(`
      query Product($id: ID!) {
        product(id: $id) {
          title
          vendor
          wineType: metafield(namespace: "custom", key: "wine_type") {
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

  const wineType = getProductTypeFromSlug(params.category);

  if (!product || !wineType) {
    notFound();
  }

  const title = `${product.title} — ${wineType} — Somm`;
  const vendor = product.vendor ? getVendorFromName(product.vendor) : null;

  return {
    title,
    description: `${product.title} — ${product.wineType?.value ?? wineType}`,
    openGraph: {
      title,
      images: [
        {
          url: `/opengraph-images/${vendor?.slug}/${params.id}.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProductComponent({ params }: Props) {
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
  const productType = getProductTypeFromSlug(params.category);

  if (!productType) {
    notFound();
  }

  const productQuantityStep = getProductQuantityStep(product.productType);

  const vendor = product.vendor ? getVendorFromName(product.vendor) : null;

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
        {vendor ? (
          <div className="mb-4 border-b pb-2">
            <VendorName vendor={vendor} />
          </div>
        ) : null}
        <h1 className="mb-4 text-2xl">
          <span>{product.title}</span>
        </h1>
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
        {product.description.trim() ? (
          <p className="my-4">{product.description}</p>
        ) : null}
        <Variants
          variants={variants.filter((v) => v.availableForSale)}
          productQuantityStep={productQuantityStep}
        />
      </div>
    </div>
  );
}
