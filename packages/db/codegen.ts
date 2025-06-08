import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "graphql/typeDefs/index.ts",
  documents: "graphql/operations/**/*.graphql", // Path to your GraphQL operations (queries, mutations, etc.)
  generates: {
  "src/gql/types.ts": {
    plugins: ["typescript", "typescript-operations"]
  }
  },
};

export default config;