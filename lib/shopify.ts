import { getRequester } from "~/shopify";
import { getSdk } from "~/storefront";

export const shopify = getSdk(
  getRequester({ initialOptions: {}, globalFetch: fetch }),
);

interface Edge<T> {
  node: T;
}
interface Connection<T> {
  edges: Edge<T>[];
}

export function unwrap<T>(connection: Connection<T>): T[] {
  return connection.edges.map((edge) => edge.node);
}
