import { type CodegenConfig } from "@graphql-codegen/cli";
import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset";
import { type IGraphQLConfig, type IGraphQLProject } from "graphql-config";

const dato: IGraphQLProject = {
  schema: [
    "dato.graphql",
    // {
    //   "https://graphql.datocms.com": {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Exclude-Invalid": "true",
    //       Accept: "application/json",
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN}`,
    //     },
    //   },
    // },
  ],
  documents: "graphql/dato/**/*.gql",
  extensions: {
    codegen: {
      overwrite: true,
      generates: {
        "dato.graphql": {
          plugins: ["schema-ast"],
        },
        "dato.ts": {
          hooks: { afterOneFileWrite: ["prettier --write"] },
          config: {
            scalars: {
              BooleanType: "boolean",
              CustomData: "Record<string, string>",
              Date: "string",
              DateTime: "string",
              FloatType: "number",
              IntType: "number",
              ItemId: "string",
              JsonField: "StructuredTextScalar",
              MetaTagAttributes: "Record<string, string>",
              UploadId: "string",
            },
          },
          plugins: [
            {
              typescript: {
                useImplementingTypes: true,
                enumsAsTypes: true,
                pureMagicComment: true,
              },
            },
            { "typescript-generic-sdk": {} },
            {
              "typescript-operations": {
                useTypeImports: true,
                dedupeFragments: true,
                exportFragmentSpreadSubTypes: true,
                namingConvention: "keep",
                defaultScalarType: "unknown",
              },
            },
          ],
        },
      },
    },
  },
};

const shopify = {
  schema: [
    "storefront.graphql",
    // {
    //   "https://somm-is.myshopify.com/api/2024-04/graphql": {
    //     headers: {
    //       "X-Shopify-Storefront-Access-Token":
    //         process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    //     },
    //   },
    // },
  ],
  documents: "graphql/shopify/**/*.gql",
  extensions: {
    codegen: {
      generates: {
        "storefront.graphql": {
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
          hooks: { afterOneFileWrite: ["prettier --write"] },
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
    } satisfies CodegenConfig,
  },
} satisfies IGraphQLProject;

const config: IGraphQLConfig = {
  projects: {
    shopify,
    dato,
  },
  extensions: {
    languageService: {
      cacheSchemaFileForLookup: true,
      enableValidation: true,
    },
  },
};

export default config;
