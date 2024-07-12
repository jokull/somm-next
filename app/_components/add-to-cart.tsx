"use client";

import { type FragmentOf } from "gql.tada";

import { type variantFragment } from "~/lib/products";
import { useAddToCart } from "~/lib/use-add-to-cart";
import { useCart } from "~/lib/use-cart";
import { cn } from "~/lib/utils";

import { ItemQuantity } from "./item-quantity";

export function AddToCart({
  variant,
  productQuantityStep,
}: {
  variant: FragmentOf<typeof variantFragment>;
  productQuantityStep: number;
}) {
  const { add, pending, cartLine, soldOut } = useAddToCart({
    variant,
    productQuantityStep,
  });
  const [cart] = useCart();

  return (
    <>
      {cartLine && cart ? (
        <ItemQuantity
          cartId={cart.id}
          quantity={cartLine.quantity}
          quantityAvailable={variant.quantityAvailable ?? undefined}
          productQuantityStep={productQuantityStep}
          id={cartLine.id}
        />
      ) : (
        <button
          className={cn(
            "whitespace-nowrap",
            soldOut || pending
              ? "text-neutral-400"
              : "underline hover:text-[blue]",
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
    </>
  );
}
