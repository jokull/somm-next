"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { AddToCart } from "~/app/_components/add-to-cart";
import { useCart } from "~/lib/use-cart";
import { cn } from "~/lib/utils";
import { type VariantFieldsFragment } from "~/storefront";

export function Variants({
  variants,
  productQuantityStep,
}: {
  variants: VariantFieldsFragment[];
  productQuantityStep: number;
}) {
  const searchParamVariant = useSearchParams().get("variant");
  const [cart] = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    searchParamVariant
      ? variants.find(({ id }) => id === searchParamVariant)
      : variants[0],
  );

  const cartLines =
    cart?.lines.edges.flatMap(({ node }) =>
      node.__typename === "CartLine" ? [node] : [],
    ) ?? [];

  if (!selectedVariant) {
    return <div>Not found</div>;
  }

  const hasVintageVariants =
    variants.length > 0 && selectedVariant.title !== "Default Title";

  return (
    <div className="mt-4 flex items-center justify-between gap-2 border-t pt-4">
      <div className="flex grow gap-2">
        {variants.map((variant) => {
          const cartLine = cartLines.find(
            (line) => line.merchandise.id === variant.id,
          );
          return (
            <button
              key={variant.id}
              className={cn(
                variant.id === selectedVariant.id
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 hover:border-neutral-800",
                "relative rounded border px-2 pb-0 pt-1",
              )}
              onClick={() => {
                setSelectedVariant(variant);
              }}
            >
              {hasVintageVariants ? (
                <>
                  {variant.title}
                  {cartLine?.id ? (
                    <div className="border-1 absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[blue] font-sans text-xs text-white">
                      {cartLine.quantity}
                    </div>
                  ) : null}
                </>
              ) : (
                "NV"
              )}
            </button>
          );
        })}
      </div>
      <p>
        {new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(
          Number.parseInt(selectedVariant.price.amount),
        )}
        kr {productQuantityStep > 1 ? `× ${productQuantityStep}` : ""}
      </p>
      <AddToCart
        variant={selectedVariant}
        productQuantityStep={productQuantityStep}
      />
    </div>
  );
}
