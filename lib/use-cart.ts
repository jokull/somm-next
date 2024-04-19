import { useContext } from "react";
import { useQuery } from "urql";

import { CartContext } from "~/app/_components/cart-provider";
import { GetCartDocument } from "~/lib/gql/graphql";

export function useCart() {
  const { cart: serverCart } = useContext(CartContext);
  const [result, reexecuteQuery] = useQuery({
    query: GetCartDocument.toString(),
    variables: { cartId: serverCart?.id ?? "" },
    pause: !serverCart,
  });
  return [result.data?.cart ?? serverCart, reexecuteQuery] as const;
}
