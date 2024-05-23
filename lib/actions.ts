"use server";

import { z } from "zod";

import { env } from "~/env";
import { cartFragment } from "~/graphql/cart";
import { client, graphql } from "~/graphql/shopify";

import { createCart, getCart } from "./cart";

export async function addToCart(
  variantId: string,
  productQuantityStep: number,
) {
  let cart = await getCart();
  if (!cart) {
    cart = await createCart();
  }
  await client.request(
    graphql(
      `
        mutation AddCartItem($cartId: ID!, $lineItem: CartLineInput!) {
          cartLinesAdd(cartId: $cartId, lines: [$lineItem]) {
            cart {
              ...Cart
            }
          }
        }
      `,
      [cartFragment],
    ),
    {
      cartId: cart.id,
      lineItem: { merchandiseId: variantId, quantity: productQuantityStep },
    },
  );
  return cart;
}

export async function subscribeToHubspot(
  prevState: unknown,
  formData: FormData,
): Promise<{ success: true } | { success: false; message: string }> {
  const result = z.string().email().safeParse(formData.get("email"));

  if (!result.success) {
    return { success: false, message: "Email was not found or invalid" };
  }

  await fetch("https://api.hubapi.com/communication-preferences/v3/subscribe", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${env.HUBSPOT_API_TOKEN}`,
    },
    body: JSON.stringify({
      emailAddress: result.data,
      subscriptionId: env.HUBSPOT_SUBSCRIPTION_ID,
      legalBasis: "LEGITIMATE_INTEREST_PQL",
      legalBasisExplanation: "User explicitly signed up via somm.is website",
    }),
  });

  return { success: true };
}
