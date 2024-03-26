import { useRouter } from "next/navigation";
import { useContext, useTransition } from "react";
import { useQuery } from "urql";

import { addToCart } from "~/lib/actions";
import { cn } from "~/lib/classnames";
import { GetCartDocument } from "~/lib/gql/graphql";
import { type VariantFieldsFragment } from "~/storefront";

import { CartContext } from "./cart-provider";
import { ItemQuantity } from "./item-quantity";

export function AddToCart({ variant }: { variant: VariantFieldsFragment }) {
  const router = useRouter();
  const { cart: serverCart } = useContext(CartContext);
  const [result, queryExecute] = useQuery({
    query: GetCartDocument.toString(),
    variables: { cartId: serverCart?.id ?? "" },
    pause: !serverCart,
  });
  const cart = result.data?.cart ?? serverCart;
  const cartLine = cart?.lines.edges
    .flatMap(({ node }) => (node.__typename === "CartLine" ? [node] : []))
    .find(({ merchandise }) => merchandise.id === variant.id);
  const soldOut = !variant.availableForSale;
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex justify-between gap-2">
      {cartLine && cart ? (
        <div>
          <ItemQuantity
            cartId={cart.id}
            quantity={cartLine.quantity}
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
              void addToCart(variant.id).then(() => {
                router.refresh();
                queryExecute({ requestPolicy: "network-only" });
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
