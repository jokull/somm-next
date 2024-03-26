import { type CodegenConfig } from "@graphql-codegen/cli";
import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset";

import { env } from "./env";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      "https://somm-is.myshopify.com/api/2024-04/graphql": {
        headers: {
          "X-Shopify-Storefront-Access-Token":
            env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
      },
    },
  ],
  documents: "**/*.gql",
  generates: {
    "schema.graphql": {
      plugins: ["schema-ast"],
    },
    "./lib/gql/": {
      preset: "client",
      plugins: [],
      config: {
        documentMode: "string",
      },
      presetConfig: {
        persistedDocuments: true,
        fragmentMasking: false,
      },
      documentTransforms: [addTypenameSelectionDocumentTransform],
    },
    "storefront.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-generic-sdk",
      ],
      config: {
        experimentalFragmentVariables: true,
        rawRequest: false,
        scalars: {
          Decimal: "string",
          URL: "string",
        },
      },
    },
  },
};

export default config;
