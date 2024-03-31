import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { VendorName } from "~/app/_components/vendor-name";
import { getVendorFromName, getVendorFromSlug } from "~/lib/commerce";
import { shopify, unwrap } from "~/lib/shopify";

import { Variants } from "./_components/variants";

export const runtime = "edge";

interface Props {
  params: { vendor: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await shopify.Product({
    id: `gid://shopify/Product/${params.id}`,
  });

  const vendorName = getVendorFromSlug(params.vendor)?.name;

  if (!product || !vendorName) {
    notFound();
  }

  return {
    title: `${product.title} — ${vendorName} — Somm`,
    description: `${product.title} frá ${product.framleidandi?.value ?? vendorName}`,
  };
}

export default async function ProductComponent({
  params,
}: {
  params: { vendor: string; id: string };
}) {
  const { product } = await shopify.Product({
    id: `gid://shopify/Product/${params.id}`,
  });

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
    .parse(JSON.parse(product.raektun?.value ?? "[]"));
  const vendor = getVendorFromName(params.vendor);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
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
      <div className="max-w-xs grow">
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
        <Variants variants={variants} />
      </div>
    </div>
  );
}
