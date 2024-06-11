import { type FragmentOf } from "gql.tada";
import Link from "next/link";
import { z } from "zod";

import { getProductQuantityStep, getVendorFromName } from "~/lib/commerce";
import { type productFragment } from "~/lib/products";

import { AddToCart } from "./add-to-cart";
import { WineTypeDot } from "./wine-type-dot";

export function ProductEmbed({
  product,
}: {
  product: FragmentOf<typeof productFragment>;
}) {
  const id = product.id.split("/").at(-1) ?? "";
  const variants = product.variants.edges.map((edge) => edge.node);
  const variant = variants.find((v) => v.availableForSale) ?? variants[0];
  const vendor = getVendorFromName(product.vendor);
  const productQuantityStep = getProductQuantityStep(product.productType);

  const defaultVariant = variants.find(
    ({ availableForSale }) => availableForSale,
  );

  const price = defaultVariant?.price.amount
    ? Number.parseInt(defaultVariant.price.amount)
    : undefined;

  const thruga = z
    .array(z.string())
    .catch([])
    .parse(JSON.parse(product.thruga?.value ?? "[]"));

  return (
    <div className="embed relative flex items-stretch gap-4 overflow-hidden rounded-md bg-gradient-to-tr from-neutral-50 to-neutral-200 p-px @container">
      <div className="absolute right-20 top-3.5 z-20 hidden items-center gap-1.5 rounded-full bg-white px-2 py-1 font-sans text-xs leading-none text-neutral-600 shadow-sm @sm:inline-flex">
        <WineTypeDot wineType={product.wineType?.value ?? ""} />
        {thruga}
      </div>
      <div className="flex w-full flex-col justify-between gap-1 py-3 pl-3 md:gap-1.5">
        <div>
          <Link
            href={`/${vendor.slug}/${id}`}
            className="min-w-0 truncate sm:max-w-none"
          >
            {product.title}
          </Link>
          <div className="text-xs italic text-neutral-500">
            {product.framleidandi?.value ?? ""}
          </div>
        </div>
        <div>
          {price ? (
            <div className="text-sm">
              {new Intl.NumberFormat("de-DE", {
                maximumFractionDigits: 0,
              }).format(price)}
              kr
            </div>
          ) : null}
        </div>
        {defaultVariant ? (
          <AddToCart
            productQuantityStep={productQuantityStep}
            variant={defaultVariant}
          />
        ) : null}
      </div>
      <Link
        href={`/${vendor.slug}/${id}`}
        className="relative w-24 flex-shrink-0 overflow-hidden rounded-md"
      >
        {variant?.image && (
          <img
            src={variant.image.url}
            width={variant.image.width ?? undefined}
            height={variant.image.height ?? undefined}
            className="h-full w-full object-cover"
            loading="lazy"
            alt="Product"
          />
        )}
      </Link>
    </div>
  );
}
