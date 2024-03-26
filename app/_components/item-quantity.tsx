import { useMutation } from "urql";

import { type CartLine } from "~/lib/cart";
import { UpdateCartItemDocument } from "~/lib/gql/graphql";

export function ItemQuantity({
  quantity,
  id,
  cartId,
}: Pick<CartLine, "quantity" | "id"> & { cartId: string }) {
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
            quantity: quantity - 1,
          });
        }}
        className="h-5 w-5 rounded-full text-[blue]"
      >
        <img className="h-5 w-5" src="/icons/minus.svg" alt="Mínus" />
      </button>
      <div className="mt-0.5 leading-none">{quantity}</div>
      <button
        disabled={fetching}
        onClick={(event) => {
          event.preventDefault();
          void update({
            cartId,
            lineItemId: id,
            quantity: quantity + 1,
          });
        }}
        className="h-5 w-5 rounded-full enabled:text-[blue] disabled:text-neutral-500"
      >
        <img className="h-5 w-5" src="/icons/plus.svg" alt="Plús" />
      </button>
    </div>
  );
}
