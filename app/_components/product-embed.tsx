import Link from "next/link";

import { getVendorFromName } from "~/lib/commerce";
import { type ProductFieldsFragment } from "~/storefront";

import { AddToCart } from "./add-to-cart";

export function ProductEmbed({ product }: { product: ProductFieldsFragment }) {
  const id = product.id.split("/").at(-1) ?? "";
  const variants = product.variants.edges.map((edge) => edge.node);
  const variant = variants.find((v) => v.availableForSale) ?? variants[0];
  const vendor = getVendorFromName(product.vendor);

  const defaultVariant = variants.find(
    ({ availableForSale }) => availableForSale,
  );

  const price = defaultVariant?.price.amount
    ? Number.parseInt(defaultVariant.price.amount)
    : undefined;

  return (
    <div className="flex w-full gap-4">
      <Link href={`/${vendor.slug}/${id}`} className="max-w-24">
        {variant?.image && (
          <div className="overflow-hidden rounded-md shadow-xl">
            <img
              src={variant.image.url}
              width={variant.image.width ?? undefined}
              height={variant.image.height ?? undefined}
              className="aspect-[3/4] object-cover"
              loading="lazy"
              alt="Product"
            />
          </div>
        )}
      </Link>
      <div className="flex w-full flex-col justify-between gap-1 md:gap-1.5">
        <div>
          <Link
            href={`/${vendor.slug}/${id}`}
            className="min-w-0 max-w-full grow-[2] truncate sm:max-w-none"
          >
            {product.title}
          </Link>
          <div className="text-sm italic text-neutral-500">
            {product.framleidandi?.value ?? ""}
          </div>
        </div>
        <div>
          {price ? (
            <div className="text-xs">
              {new Intl.NumberFormat("de-DE", {
                maximumFractionDigits: 0,
              }).format(price)}
              kr
            </div>
          ) : null}
          {defaultVariant ? <AddToCart variant={defaultVariant} /> : null}
        </div>
      </div>
    </div>
  );
}
