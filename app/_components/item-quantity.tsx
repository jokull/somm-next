import { useMutation } from "urql";

import { type CartLine } from "~/lib/cart";
import { UpdateCartItemDocument } from "~/lib/gql/graphql";

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
  const [{ fetching }, update] = useMutation(UpdateCartItemDocument.toString());
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
