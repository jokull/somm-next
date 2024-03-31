"use client";

import { StructuredText } from "react-datocms/structured-text";
import { useQuery } from "urql";

import { type PostsQuery } from "~/dato";
import { ProductDocument } from "~/lib/gql/graphql";

import { LoadingSpinner } from "./loading-spinner";

function Product({ id }: { id: string }) {
  const [{ data, fetching }] = useQuery({
    query: ProductDocument.toString(),
    variables: { id: `gid://shopify/Product/${id}` },
  });
  if (fetching) {
    return <LoadingSpinner />;
  }
  return data?.product?.title;
}

export function PostContent({
  field,
}: {
  field: PostsQuery["allPosts"][0]["content"];
}) {
  return (
    <StructuredText
      data={{ ...field, links: [] }}
      renderBlock={({ record }) => {
        if (record.shopifyProductId) {
          return <Product id={record.shopifyProductId} />;
        }
        return null;
      }}
    />
  );
}
