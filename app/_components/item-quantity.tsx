import { useMutation } from "urql";

import { cartFragment, type CartLine } from "~/graphql/cart";
import { graphql } from "~/graphql/shopify";

const UpdateCartItem = graphql(
  `
    mutation UpdateCartItem($cartId: ID!, $lineItemId: ID!, $quantity: Int!) {
      __typename
      cartLinesUpdate(
        cartId: $cartId
        lines: [{ id: $lineItemId, quantity: $quantity }]
      ) {
        __typename
        cart {
          __typename
          ...Cart
        }
      }
    }
  `,
  [cartFragment],
);

export function ItemQuantity({
  quantity,
  id,
  cartId,
  productQuantityStep,
  quantityAvailable,
}: Pick<CartLine, "quantity" | "id"> & {
  cartId: string;
  productQuantityStep: number;
  quantityAvailable?: number;
}) {
  const [{ fetching }, update] = useMutation(UpdateCartItem);
  return (
    <div className="nums flex items-center gap-2 whitespace-nowrap text-sm tabular-nums">
      <button
        disabled={fetching}
        onClick={(event) => {
          event.preventDefault();
          void update({
            cartId,
            lineItemId: id,
            quantity: quantity - 1 * productQuantityStep,
          });
        }}
        className="h-6 w-6 rounded-full text-[blue]"
      >
        <img className="h-6 w-6" src="/icons/minus.svg" alt="Mínus" />
      </button>
      <div className="mt-0.5 leading-none">{quantity}</div>
      <button
        disabled={
          fetching ||
          (typeof quantityAvailable === "number"
            ? quantityAvailable <= quantity
            : false)
        }
        onClick={(event) => {
          event.preventDefault();
          void update({
            cartId,
            lineItemId: id,
            quantity: quantity + 1 * productQuantityStep,
          });
        }}
        className="h-6 w-6 rounded-full enabled:text-[blue] disabled:opacity-30"
      >
        <img className="h-6 w-6" src="/icons/plus.svg" alt="Plús" />
      </button>
    </div>
  );
}
