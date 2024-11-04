import { z } from "zod";

import { env } from "~/env";

const dokobitCreateResponseSchema = z.object({
  status: z.enum(["ok"]),
  session_token: z.string(),
  url: z.string(),
  expires_in: z.number(), // Number of seconds
});

export async function createDokobitSession(returnUrl: string) {
  const response = await fetch(
    `${env.DOKOBIT_URL}/create?access_token=${env.DOKOBIT_TOKEN}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ return_url: returnUrl.toString() }),
    },
  );

  if (response.status !== 200) {
    throw new Error(await response.text());
  }
  return dokobitCreateResponseSchema.parse(await response.json());
}

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

export async function getDokobitSession(sessionToken: string) {
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
