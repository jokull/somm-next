import { type FragmentOf } from "gql.tada";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { addToCart } from "~/lib/actions";
import { type variantFragment } from "~/lib/products";
import { useCart } from "~/lib/use-cart";

export function useAddToCart({
  variant,
  productQuantityStep,
}: {
  variant: FragmentOf<typeof variantFragment>;
  productQuantityStep: number;
}) {
  const router = useRouter();
  const [cart, reexecuteQuery] = useCart();
  const [pending, startTransition] = useTransition();
  function add() {
    startTransition(() => {
      void addToCart(variant.id, productQuantityStep).then((data) => {
        router.refresh();
        reexecuteQuery({ requestPolicy: "network-only" });
      });
    });
  }
  const cartLines =
    cart?.lines.edges.flatMap(({ node }) =>
      node.__typename === "CartLine" ? [node] : [],
    ) ?? [];

  const cartLine = cartLines.find(
    ({ merchandise }) => merchandise.id === variant.id,
  );

  const soldOut = !variant.availableForSale || variant.quantityAvailable === 0;
  return { add, pending, soldOut, cartLine };
}
