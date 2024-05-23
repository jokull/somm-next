"use client";

import { createContext, type ReactNode } from "react";
import { Provider } from "urql";

import { Cart } from "~/graphql/cart";
import { client } from "~/lib/urql";

export const CartContext = createContext<{
  cart: Cart | null;
}>({
  cart: null,
});

export function CartProvider({
  cart,
  children,
}: {
  children: ReactNode;
  cart: Cart | null;
}) {
  return (
    <Provider value={client}>
      <CartContext.Provider value={{ cart }}>{children}</CartContext.Provider>
    </Provider>
  );
}
