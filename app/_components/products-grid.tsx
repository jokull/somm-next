import { FragmentOf } from "gql.tada";

import { paginatedProductsFragment } from "~/lib/products";
import { unwrap } from "~/lib/shopify";

import { ProductCard } from "./product-card";

export function ProductsGrid({
  products,
}: {
  products: FragmentOf<typeof paginatedProductsFragment>;
}) {
  const filteredProducts = unwrap(products)
    .filter((product) =>
      unwrap(product.variants).find((variant) => variant.image?.url),
    )
    .flatMap((product) =>
      typeof product.totalInventory === "number" && product.totalInventory > 0
        ? [product]
        : [],
    );

  if (filteredProducts.length > 0) {
    return (
      <div
        className={`
            grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-x-4 gap-y-5
            pb-12 last-of-type:border-none last-of-type:pb-0
            md:grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))] md:gap-x-6
            md:gap-y-8 md:pb-28
            lg:grid-cols-[repeat(auto-fill,minmax(min(14rem,100%),1fr))]
            xl:grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))]
          `}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }
}
