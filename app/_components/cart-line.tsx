import Link from "next/link";
import { useTransition } from "react";

import { removeCartItem } from "~/lib/actions";
import { type CartLine } from "~/lib/cart";
import { cn } from "~/lib/classnames";
import { getVendorFromName } from "~/lib/commerce";

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
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-2">
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
      <div className="whitespace-nowrap">
        <button
          className={cn(pending && "opacity-20", "hover:text-[blue]")}
          onClick={(event) => {
            event.preventDefault();
            startTransition(() => {
              void removeCartItem(id);
            });
          }}
        >
          <img src="/icons/trash.svg" alt="Trash" />
        </button>
      </div>
    </div>
  );
}
