import { type GraphQLProjectConfig } from 'graphql-config';

const config = {
  projects: {
    app: {
      schema: './schema.graphql',
      documents: ['**/*.gql'],
    } satisfies Pick<GraphQLProjectConfig, 'schema' | 'documents'>,
  },
  extensions: {
    languageService: {
      cacheSchemaFileForLookup: true,
      enableValidation: true,
    },
  },
};

export default config
