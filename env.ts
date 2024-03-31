import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get typeerrors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1),
    NEXT_PUBLIC_VERCEL_URL: z.string().min(1),
    NEXT_PUBLIC_DATOCMS_API_TOKEN: z.string().min(1),
  },

  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    SECRET_KEY: z.string().min(1),
    VERCEL_URL: z.string().min(1),
    DOKOBIT_TOKEN: z.string().min(1),
    DOKOBIT_URL: z.string().url(),
    HUBSPOT_API_TOKEN: z.string().min(1),
    HUBSPOT_SUBSCRIPTION_ID: z.string().min(1),
  },

  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get typeerrors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_VERCEL_URL:
      process.env.NODE_ENV === "production"
        ? "www.somm.is"
        : process.env.NEXT_PUBLIC_VERCEL_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    // VERCEL_URL is the url's like `trip-next-a5gpsbahm-takanawa-travel.vercel.app` - which
    // we don't want to use unless it is a preview branch. In development mode we just set the
    // VERCEL_URL variable to the Cloudflare tunnel domain.
    VERCEL_URL:
      process.env.NODE_ENV === "production"
        ? "www.somm.is"
        : process.env.VERCEL_URL,
    DOKOBIT_TOKEN: process.env.DOKOBIT_TOKEN,
    DOKOBIT_URL: process.env.DOKOBIT_URL,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    HUBSPOT_API_TOKEN: process.env.HUBSPOT_API_TOKEN,
    HUBSPOT_SUBSCRIPTION_ID: process.env.HUBSPOT_SUBSCRIPTION_ID,
    NEXT_PUBLIC_DATOCMS_API_TOKEN: process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN,
  },
});
