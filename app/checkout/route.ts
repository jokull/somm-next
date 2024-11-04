import { type VariablesOf } from "gql.tada";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "~/env";
import { client, graphql } from "~/graphql/shopify";
import { getSession } from "~/lib/cart";
import { createDokobitSession, getDokobitSession } from "~/lib/dokobit";

export const runtime = "edge";

const updateCartAttributes = graphql(`
  mutation CartAttributesUpdate(
    $cartId: ID!
    $buyerIdentidy: CartBuyerIdentityInput!
    $attributes: [AttributeInput!]!
  ) {
    cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
      __typename
    }
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentidy) {
      __typename
      cart {
        checkoutUrl
      }
    }
  }
`);

type ShopifyCountryCode = NonNullable<
  VariablesOf<typeof updateCartAttributes>["buyerIdentidy"]
>["countryCode"];

// On POST request to start the dokobit verification process and redirect to it
export async function POST() {
  // Construct the Next.js URL we want the user to return to - this will actually be the GET handler
  // below.
  const returnUrl = new URL("/checkout", `https://${env.VERCEL_URL}/`);
  const session = await createDokobitSession(returnUrl.toString());
  // Redirect the user to the Dokobit authentication URL
  throw redirect(session.url);
}

// On GET requests process the dokobit based on the ?session_token, if presented
export async function GET(request: NextRequest) {
  // Get the Dokobit `?session_token=` value
  const dokobitSessionToken = request.nextUrl.searchParams.get("session_token");

  // Get the Shopify cart ID - this is stored in a cookie
  const cartId = await getSession().then((session) => session?.cartId);

  if (!dokobitSessionToken || !cartId) {
    return NextResponse.json(
      { message: "Session or cart not found" },
      { status: 400 },
    );
  }

  const dokobitSession = await getDokobitSession(dokobitSessionToken);

  const fullName = `${dokobitSession.name} ${dokobitSession.surname}`;

  // At the risk of one or two country codes not being present in Shopify API ...
  const countryCode =
    dokobitSession.country_code.toLocaleUpperCase() as unknown as ShopifyCountryCode;

  const response = await client.request(updateCartAttributes, {
    cartId,
    buyerIdentidy: {
      phone: dokobitSession.phone,
      countryCode,
    },
    attributes: [
      { key: "kennitala", value: dokobitSession.code },
      { key: "name", value: fullName },
    ],
  });

  const checkoutUrl = response.cartBuyerIdentityUpdate?.cart?.checkoutUrl;

  if (!checkoutUrl) {
    return NextResponse.json(
      { message: "Shopify checkout URL not found" },
      { status: 400 },
    );
  }

  return NextResponse.redirect(checkoutUrl);
}
