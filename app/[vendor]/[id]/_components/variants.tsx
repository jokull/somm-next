"use client";

import { type FragmentOf } from "gql.tada";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useAddToCart } from "~/app/_components/add-to-cart";
import { ItemQuantity } from "~/app/_components/item-quantity";
import { type variantFragment } from "~/lib/products";
import { useCart } from "~/lib/use-cart";
import { cn } from "~/lib/utils";

export function Variants({
  variants,
  productQuantityStep,
}: {
  variants: FragmentOf<typeof variantFragment>[];
  productQuantityStep: number;
}) {
  const searchParamVariant = useSearchParams().get("variant");
  const [cart] = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    searchParamVariant
      ? variants.find(({ id }) => id === searchParamVariant)
      : variants[0],
  );

  if (!selectedVariant) {
    throw new Error("Not found");
    // return <div>Not found</div>;
  }

  const cartLines =
    cart?.lines.edges.flatMap(({ node }) =>
      node.__typename === "CartLine" ? [node] : [],
    ) ?? [];

  const cartLine = cartLines.find(
    ({ merchandise }) => merchandise.id === selectedVariant.id,
  );

  const soldOut = !selectedVariant.availableForSale;

  const hasVintageVariants =
    variants.length > 0 && selectedVariant.title !== "Default Title";

  const [add, pending] = useAddToCart({
    variant: selectedVariant,
    productQuantityStep,
  });

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2">
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
      </div>
      <hr className="my-4 h-px bg-slate-300" />
      <div className="flex justify-center">
        {cartLine && cart ? (
          <div className="flex w-full items-center justify-center whitespace-nowrap rounded bg-slate-50 p-3 transition-all">
            <ItemQuantity
              cartId={cart.id}
              quantity={cartLine.quantity}
              quantityAvailable={selectedVariant.quantityAvailable ?? undefined}
              productQuantityStep={productQuantityStep}
              id={cartLine.id}
            />
          </div>
        ) : (
          <button
            className={cn(
              "flex w-full items-center justify-center whitespace-nowrap rounded p-3 transition-all",
              soldOut || pending
                ? "bg-blue-300 text-white/50"
                : "bg-[blue] text-white/90 shadow-lg shadow-blue-400/20 hover:text-white",
            )}
            disabled={soldOut}
            onClick={(event) => {
              event.preventDefault();
              add();
            }}
          >
            {soldOut ? "Uppselt" : pending ? "Augnablik" : "Bæta í körfu"}
          </button>
        )}
      </div>
    </>
  );
}
