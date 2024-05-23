import { useContext } from "react";
import { useQuery } from "urql";

import { CartContext } from "~/app/_components/cart-provider";
import { GetCartQuery } from "~/graphql/cart";

export function useCart() {
  const { cart: serverCart } = useContext(CartContext);
  const [result, reexecuteQuery] = useQuery({
    query: GetCartQuery,
    variables: { cartId: serverCart?.id ?? "" },
    pause: !serverCart,
  });
  return [result.data?.cart ?? serverCart, reexecuteQuery] as const;
}
