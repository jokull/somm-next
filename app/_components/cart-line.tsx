import Link from "next/link";
import { useMutation } from "urql";

import { cartFragment, type CartLine } from "~/graphql/cart";
import { graphql } from "~/graphql/shopify";
import { getProductQuantityStep, getVendorFromName } from "~/lib/commerce";
import { cn } from "~/lib/utils";

import { ItemQuantity } from "./item-quantity";

export function CartLine({
  line: {
    merchandise: { product, title },
    cost,
    quantity,
    id,
  },
  cartId,
}: {
  line: CartLine;
  cartId: string;
}) {
  const vendor = getVendorFromName(product.vendor);
  const [{ fetching }, remove] = useMutation(
    graphql(
      `
        mutation RemoveCartItem($cartId: ID!, $lineItemId: ID!) {
          __typename
          cartLinesRemove(cartId: $cartId, lineIds: [$lineItemId]) {
            __typename
            cart {
              __typename
              ...Cart
            }
          }
        }
      `,
      [cartFragment],
    ),
  );
  const productQuantityStep = getProductQuantityStep(product.productType);
  return (
    <>
      <div className="w-full min-w-0 truncate">
        <Link
          href={`/${vendor.slug}/${product.id.split("/").at(-1) ?? ""}`}
          className="hover:underline"
        >
          {title} / {product.title}
        </Link>
      </div>
      <div>
        <ItemQuantity
          productQuantityStep={productQuantityStep}
          quantity={quantity}
          id={id}
          cartId={cartId}
        />
      </div>
      <div className="w-[105px] whitespace-nowrap text-right slashed-zero tabular-nums">
        {Number.parseInt(cost.totalAmount.amount).toLocaleString("de-DE", {
          maximumFractionDigits: 0,
        })}{" "}
        kr
      </div>
      <div className="min-w-0 whitespace-nowrap">
        <button
          className={cn(fetching && "opacity-20", "hover:text-[blue]")}
          onClick={(event) => {
            event.preventDefault();
            void remove({ cartId, lineItemId: id });
          }}
        >
          <img src="/icons/trash.svg" alt="Trash" className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
