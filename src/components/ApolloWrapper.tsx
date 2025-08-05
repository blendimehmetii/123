// src/components/ApolloWrapper.tsx (example)
"use client";

import { ReactNode } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql-api-brown.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});

export default function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
