import { type VariablesOf } from "gql.tada";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { env } from "~/env";
import { client, graphql } from "~/graphql/shopify";
import { getSession } from "~/lib/cart";

export const runtime = "edge";

const gql = graphql(`
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
  VariablesOf<typeof gql>["buyerIdentidy"]
>["countryCode"];

// Define the Dokobit session success schema
const dokobitSessionResponseSchema = z.object({
  status: z.string(),
  session_token: z.string(),
  code: z.string(),
  country_code: z.string(),
  name: z.string(),
  surname: z.string(),
  authentication_method: z.string(),
  date_authenticated: z.string(),
  phone: z.string().optional(),
});

// Define the Dokobit error schema
const dokobitSessionStatusErrorResponseSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
});

async function getDokobitSession(sessionToken: string) {
  const response = await fetch(
    `${env.DOKOBIT_URL}/${sessionToken}/status?access_token=${env.DOKOBIT_TOKEN}`,
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  // Check if the response is an error
  const errorValidation =
    dokobitSessionStatusErrorResponseSchema.safeParse(data);
  if (errorValidation.success) {
    throw new Error(errorValidation.data.message);
  }

  // Validate against the DokobitSession schema
  return dokobitSessionResponseSchema.parse(data);
}

const dokobitCreateResponseSchema = z.object({
  status: z.enum(["ok"]),
  session_token: z.string(),
  url: z.string(),
  expires_in: z.number(), // Number of seconds
});

// On POST request to start the dokobit verification process and redirect to it
export async function POST() {
  // Return the user back to this route, but that will be the GET handler below
  const returnUrl = new URL("/checkout", `https://${env.VERCEL_URL}/`);

  const data = await fetch(
    `${env.DOKOBIT_URL}/create?access_token=${env.DOKOBIT_TOKEN}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ return_url: returnUrl.toString() }),
    },
  ).then(async (response) => {
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    return dokobitCreateResponseSchema.parse(await response.json());
  });

  // Redirect the user to the Dokobit authentication URL
  throw redirect(data.url);
}

// On GET requests process the dokobit based on the ?session_token, if presented
export async function GET(request: NextRequest) {
  const dokobitSessionToken = request.nextUrl.searchParams.get("session_token");

  const session = await getSession();

  if (!dokobitSessionToken || !session?.cartId) {
    return NextResponse.json({ message: "Session not found" }, { status: 400 });
  }

  const dokobitSession = await getDokobitSession(dokobitSessionToken);

  const fullName = `${dokobitSession.name} ${dokobitSession.surname}`;

  // At the risk of one or two country codes not being present in Shopify API ...
  const countryCode =
    dokobitSession.country_code.toLocaleUpperCase() as unknown as ShopifyCountryCode;

  const response = await client.request(gql, {
    cartId: session.cartId,
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
