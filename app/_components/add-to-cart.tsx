"use client";

import { FragmentOf } from "gql.tada";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { addToCart } from "~/lib/actions";
import { variantFragment } from "~/lib/products";
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
  const router = useRouter();
  const [cart, reexecuteQuery] = useCart();
  const cartLine = cart?.lines.edges
    .flatMap(({ node }) => (node.__typename === "CartLine" ? [node] : []))
    .find(({ merchandise }) => merchandise.id === variant.id);
  const soldOut = !variant.availableForSale;
  const [pending, startTransition] = useTransition();

  return (
    <div>
      {cartLine && cart ? (
        <div>
          <ItemQuantity
            cartId={cart.id}
            quantity={cartLine.quantity}
            quantityAvailable={variant.quantityAvailable ?? undefined}
            productQuantityStep={productQuantityStep}
            id={cartLine.id}
          />
        </div>
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
            startTransition(() => {
              void addToCart(variant.id, productQuantityStep).then((data) => {
                router.refresh();
                reexecuteQuery({ requestPolicy: "network-only" });
              });
            });
          }}
        >
          {soldOut ? "Uppselt" : pending ? "Augnablik" : "Bæta í körfu"}
        </button>
      )}
    </div>
  );
}
