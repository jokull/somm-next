import { type ResultOf } from "gql.tada";
import { StructuredText } from "react-datocms/structured-text";

import { type Post } from "~/graphql/post";
import { client, graphql } from "~/graphql/shopify";
import { productFragment } from "~/lib/products";

import { ProductEmbed } from "./product-embed";

// function Product({ product }: { product: Extract<ProductsByIdsQuery['nodes'][0], {__typename: "Product"}> }) {
//   return <div></div>;
// }

export async function getProducts(blocks: { shopifyProductId: string }[]) {
  const ids = blocks.map(({ shopifyProductId }) => shopifyProductId);
  const { nodes } = await client.request(
    graphql(
      `
        query ProductsByIds($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              __typename
              ...ProductFields
            }
          }
        }
      `,
      [productFragment],
    ),
    {
      ids: ids.map((id) => `gid://shopify/Product/${id}`),
    },
  );
  return nodes.flatMap((node) =>
    node?.__typename === "Product" ? [node] : [],
  );
}

export async function PostContent({
  field,
}: {
  field: NonNullable<ResultOf<typeof Post>["post"]>["content"];
}) {
  const productBlocks = field.blocks.flatMap((block) =>
    block.__typename === "ProductRecord" ? [block] : [],
  );
  const products = await getProducts(productBlocks);
  return (
    <StructuredText
      data={{ ...field, links: [] }}
      renderBlock={({ record }) => {
        const product = products.find(
          ({ id }) =>
            record.__typename === "ProductRecord" &&
            id.includes(record.shopifyProductId),
        );
        if (product) {
          return (
            <div className="mx-auto mb-4">
              <ProductEmbed product={product} />
            </div>
          );
        }
        return null;
      }}
    />
  );
}
