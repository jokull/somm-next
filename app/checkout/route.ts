import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { env } from "~/env";
import { getSession } from "~/lib/cart";
import { shopify } from "~/lib/shopify";
import { type CountryCode } from "~/storefront";

interface DokobitSession {
  status: string;
  session_token: string;
  code: string;
  country_code: string;
  name: string;
  surname: string;
  authentication_method: string;
  date_authenticated: string;
  phone?: string;
}

async function getDokobitSession(sessionToken: string) {
  const response = await fetch(
    `${env.DOKOBIT_URL}/${sessionToken}/status?access_token=${env.DOKOBIT_TOKEN}`,
  );
  const data = (await response.json()) as Record<string, unknown>;
  if (data.status === "error") {
    throw Error(data.message as string);
  }
  return data as unknown as DokobitSession;
}

const dokobitCreateResponseSchema = z.object({
  status: z.enum(["ok"]),
  session_token: z.string(),
  url: z.string(),
  expires_in: z.number(), // Number of seconds
});

// On POST request to start the dokobit verification process and redirect to it
export async function POST(request: NextRequest) {
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
  throw redirect((data as { url: string }).url);
}

// On GET requests process the dokobit based on the ?session_token, if presented
export async function GET(request: NextRequest) {
  const dokobitSessionToken = request.nextUrl.searchParams.get("session_token");

  const session = await getSession();

  let checkoutUrl = "";

  if (dokobitSessionToken && session?.cartId) {
    const dokobitSession = await getDokobitSession(dokobitSessionToken);
    const response = await shopify.CartAttributesUpdate({
      cartId: session.cartId,
      buyerIdentidy: {
        phone: dokobitSession.phone,
        countryCode:
          dokobitSession.country_code.toLocaleUpperCase() as CountryCode,
      },
      attributes: [
        { key: "kennitala", value: dokobitSession.code },
        {
          key: "name",
          value: `${dokobitSession.name} ${dokobitSession.surname}`,
        },
      ],
    });
    if (response.cartBuyerIdentityUpdate?.cart?.checkoutUrl) {
      checkoutUrl = response.cartBuyerIdentityUpdate.cart.checkoutUrl;
      return NextResponse.redirect(checkoutUrl);
    } else {
      throw Error("Could not checkout");
    }
  }

  return NextResponse.json({ checkoutUrl });
}
