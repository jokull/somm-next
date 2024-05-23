"use client";

import { FragmentOf } from "gql.tada";
import { useState } from "react";

import { productFragment } from "~/lib/products";
import { unwrap } from "~/lib/shopify";

import { AddToCart } from "./add-to-cart";

export function VariantToCart({
  product,
  productQuantityStep,
}: {
  product: FragmentOf<typeof productFragment>;
  productQuantityStep: number;
}) {
  const variants = unwrap(product.variants).filter((v) => v.availableForSale);
  const defaultVariant = variants.find(
    ({ availableForSale }) => availableForSale,
  );
  const [selected, setSelected] = useState(defaultVariant?.id ?? null);
  const location: string[] = [];

  if (product.region?.value) {
    location.push(product.region.value);
  }
  if (product.country?.value) {
    location.push(product.country.value);
  }

  const selectedVariant = variants.find((variant) => variant.id === selected);

  const price = selectedVariant?.price.amount
    ? Number.parseInt(selectedVariant.price.amount)
    : undefined;

  return (
    <>
      <div className="flex items-center justify-between text-neutral-500">
        {selected ? (
          <label className="flex items-center gap-1 text-sm">
            <span className="sr-only">Ár </span>
            {variants.length > 1 ? (
              <select
                id="location"
                name="location"
                className="-mr-3 block border-0 border-gray-300 py-1 pl-0 pr-8 text-sm focus:border-[blue] focus:ring-0"
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                }}
              >
                {variants.map((variant) => (
                  <option
                    key={variant.id}
                    value={variant.id}
                    disabled={!variant.availableForSale}
                  >
                    {variant.title}
                  </option>
                ))}
              </select>
            ) : (
              <div className="py-1 text-sm">
                {selectedVariant?.title === "Default Title"
                  ? ""
                  : selectedVariant?.title}
              </div>
            )}
          </label>
        ) : (
          "Uppselt"
        )}
        <div className="hidden truncate text-sm md:block">
          {location.join(", ")}
        </div>
        <div className="truncate text-sm md:hidden">
          {product.region?.value ?? ""}
        </div>
      </div>

      {selectedVariant && price ? (
        <div className="flex items-center justify-between">
          <AddToCart
            variant={selectedVariant}
            productQuantityStep={productQuantityStep}
          />
          <p>
            {new Intl.NumberFormat("de-DE", {
              maximumFractionDigits: 0,
            }).format(price)}
            kr
          </p>
        </div>
      ) : null}
    </>
  );
}
