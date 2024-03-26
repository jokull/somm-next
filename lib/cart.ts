import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "~/env";
import { type GetCartQuery } from "~/storefront";

import { shopify } from "./shopify";

const NAME = "session";

const sessionSchema = z.object({
  cartId: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;

export async function getSession() {
  const sessionValue = cookies().get(NAME)?.value;
  if (!sessionValue) {
    return null;
  }
  const result = sessionSchema.safeParse(
    await unsealData(sessionValue, { password: env.SECRET_KEY }),
  );
  return result.success ? result.data : null;
}

export async function setSession(session: Session) {
  cookies().set(NAME, await sealData(session, { password: env.SECRET_KEY }), {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function getCart() {
  const session = await getSession();
  if (session) {
    const { cart } = await shopify.GetCart({ cartId: session.cartId });
    if (cart) {
      return cart;
    }
  }
}

export async function createCart() {
  const { cartCreate } = await shopify.CreateCart({ input: {} });
  const cart = cartCreate?.cart;
  if (!cart) {
    throw new Error("Could not create cart");
  }
  await setSession({ cartId: cart.id });
  return cart;
}

export type Cart = NonNullable<GetCartQuery["cart"]>;

export type CartLine = Extract<
  Cart["lines"]["edges"][0]["node"],
  { __typename: "CartLine" }
>;
