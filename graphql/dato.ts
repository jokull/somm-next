import { initGraphQLTada } from "gql.tada";
import { GraphQLClient } from "graphql-request";

import { env } from "~/env.ts";

import type { introspection } from "./dato-env.d.ts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    BooleanType: boolean;
    CustomData: Record<string, string>;
    Date: string;
    DateTime: string;
    FloatType: number;
    IntType: number;
    ItemId: string;
    JsonField: StructuredTextScalar;
    MetaTagAttributes: Record<string, string>;
    UploadId: string;
  };
}>();

export const client = new GraphQLClient("https://graphql.datocms.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${env.NEXT_PUBLIC_DATOCMS_API_TOKEN}`,
    ...(env.NEXT_PUBLIC_VERCEL_URL === "members.hundrad.is"
      ? { "X-Include-Drafts": "true" }
      : {}),
  },
  cache: "no-cache",
});
