import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "~/env";
import { cartFragment, GetCartQuery } from "~/graphql/cart";
import { client, graphql } from "~/graphql/shopify";

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
    const { cart } = await client.request(GetCartQuery, {
      cartId: session.cartId,
    });
    if (cart) {
      return cart;
    }
  }
}

export async function createCart() {
  const { cartCreate } = await client.request(
    graphql(
      `
        mutation CreateCart($input: CartInput) {
          cartCreate(input: $input) {
            cart {
              ...Cart
            }
            userErrors {
              code
              message
            }
          }
        }
      `,
      [cartFragment],
    ),
    { input: {} },
  );

  const cart = cartCreate?.cart;
  if (!cart) {
    throw new Error("Could not create cart");
  }

  await setSession({ cartId: cart.id });
  return cart;
}
