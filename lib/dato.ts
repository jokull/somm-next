import { type DocumentNode, type GraphQLError } from "graphql";
import { print } from "graphql/language/printer";

import { getSdk } from "~/dato";
import { env } from "~/env";

const requester = async <R, V>(doc: DocumentNode, variables?: V) => {
  const res = await fetch("https://graphql.datocms.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${env.NEXT_PUBLIC_DATOCMS_API_TOKEN}`,
    },
    body: JSON.stringify({ query: print(doc), variables }),
    cache: "no-cache",
  });

  const json = await res.json();

  if (typeof json !== "object" || json === null) {
    throw Error("Not even object");
  }

  if ("errors" in json && json.errors) {
    const errors = json.errors as GraphQLError[];
    const { message } = errors[0] ?? { message: "Unknown error" };
    throw new Error(message);
  }

  if (!("data" in json)) {
    throw Error("Not errors and no data");
  }

  return json.data as R;
};

export const dato = getSdk(requester);
