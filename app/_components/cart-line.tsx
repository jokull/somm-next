import Link from "next/link";
import { useMutation } from "urql";

import { type CartLine } from "~/lib/cart";
import { getVendorFromName } from "~/lib/commerce";
import { RemoveCartItemDocument } from "~/lib/gql/graphql";
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
  const [{ fetching }, remove] = useMutation(RemoveCartItemDocument.toString());
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
        <ItemQuantity quantity={quantity} id={id} cartId={cartId} />
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
