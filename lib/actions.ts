"use server";

import { z } from "zod";

import { env } from "~/env";

import { createCart, getCart } from "./cart";
import { shopify } from "./shopify";

export async function updateCartItem(lineItemId: string, quantity: number) {
  const cart = await getCart();
  if (!cart) {
    return cart;
  }
  const result = await shopify.UpdateCartItem({
    cartId: cart.id,
    lineItemId,
    quantity,
  });
  return result.cartLinesUpdate?.cart;
}

export async function removeCartItem(lineItemId: string) {
  const cart = await getCart();
  if (!cart) {
    return;
  }
  const result = await shopify.RemoveCartItem({
    cartId: cart.id,
    lineItemId,
  });
  return result.cartLinesRemove?.cart;
}

export async function addToCart(
  variantId: string,
  productQuantityStep: number,
) {
  let cart = await getCart();
  if (!cart) {
    cart = await createCart();
  }
  await shopify.AddCartItem({
    cartId: cart.id,
    lineItem: { merchandiseId: variantId, quantity: productQuantityStep },
  });
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
