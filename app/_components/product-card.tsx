import Link from "next/link";

import { cn } from "~/lib/classnames";
import { getVendorFromName } from "~/lib/commerce";
import { type ProductFieldsFragment } from "~/storefront";

import { VariantToCart } from "./variant-to-cart";
import { WineTypeDot } from "./wine-type-dot";

export function ProductCard({ product }: { product: ProductFieldsFragment }) {
  const id = product.id.split("/").at(-1) ?? "";
  const variants = product.variants.edges.map((edge) => edge.node);
  const variant = variants.find((v) => v.availableForSale) ?? variants[0];
  const vendor = getVendorFromName(product.vendor);

  return (
    <div>
      <Link href={`/${vendor.slug}/${id}`} className="relative block">
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
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2",
            "absolute inset-x-0 bottom-0",
            "text-xs font-light text-black/70", // Typography
          )}
        >
          <div>
            {product.abv && Number(product.abv.value) === 0.0 && (
              <div className="whitespace-nowrap">
                {Number(product.abv.value).toLocaleString("de-DE", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                %
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="-mt-1">
              {product.wineType?.value && (
                <WineTypeDot wineType={product.wineType.value} />
              )}
            </span>
            <span>
              {product.magn?.value &&
                `${Number(product.magn.value).toLocaleString("de-DE", {
                  maximumFractionDigits: 3,
                })}L`}
            </span>
          </div>
        </div>
      </Link>
      <div className="mt-4 flex flex-col gap-1 md:gap-1.5">
        <div className="flex flex-col items-center justify-between gap-1 md:flex-row md:gap-3">
          <Link
            href={`/${vendor.slug}/${id}`}
            className="min-w-0 max-w-full grow-[2] truncate sm:max-w-none"
          >
            {product.title}
          </Link>
          <div className="grow-[1] truncate text-right text-xs text-neutral-500 md:text-base">
            {product.framleidandi?.value ?? ""}
          </div>
        </div>
        <VariantToCart product={product} />
      </div>
    </div>
  );
}
