import { StructuredText } from "react-datocms/structured-text";

import { type PostQuery } from "~/dato";
import { shopify } from "~/lib/shopify";

import { ProductEmbed } from "./product-embed";

// function Product({ product }: { product: Extract<ProductsByIdsQuery['nodes'][0], {__typename: "Product"}> }) {
//   return <div></div>;
// }

export async function getProducts(blocks: { shopifyProductId: string }[]) {
  const ids = blocks.map(({ shopifyProductId }) => shopifyProductId);
  const { nodes } = await shopify.ProductsByIds({
    ids: ids.map((id) => `gid://shopify/Product/${id}`),
  });
  return nodes.flatMap((node) =>
    node?.__typename === "Product" ? [node] : [],
  );
}

export async function PostContent({
  field,
}: {
  field: NonNullable<PostQuery["post"]>["content"];
}) {
  const products = await getProducts(field.blocks);
  return (
    <StructuredText
      data={{ ...field, links: [] }}
      renderBlock={({ record }) => {
        const product = products.find(({ id }) =>
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
