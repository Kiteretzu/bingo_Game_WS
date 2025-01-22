
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/typeDefs/**.ts",
  documents: "src/operations/queries.graphql",
  generates: {
    "generated/graphql-backend.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    },
    "generated/graphql-frontend.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"]
    }
  }
};

export default config;
