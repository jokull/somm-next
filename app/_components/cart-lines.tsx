import { type CartLine as CartLineType } from "~/lib/cart";

import { CartLine } from "./cart-line";

const maxBottleLength = 8 * 2;

export function CartLines({
  cartId,
  lines,
}: {
  lines: CartLineType[];
  cartId: string;
}) {
  const bottles = lines.flatMap((line) =>
    line.merchandise.image
      ? Array.from({ length: line.quantity }).flatMap(() =>
          line.merchandise.image ? [line.merchandise.image] : [],
        )
      : [],
  );
  return (
    <>
      <div className="mb-8 grid max-w-md grid-cols-8 items-center gap-1">
        {bottles.slice(0, maxBottleLength - 1).map((bottle, index) => (
          <img
            key={bottle.url + index}
            src={bottle.url}
            width={bottle.width ?? undefined}
            height={bottle.height ?? undefined}
            className="aspect-[2/3] h-20 rounded object-cover shadow"
            loading="lazy"
            alt="Product"
          />
        ))}
        {bottles.length > maxBottleLength - 1 ? (
          <div className="flex h-20 items-center justify-center rounded font-serif text-lg font-bold">
            + {bottles.length - (maxBottleLength - 1)}
          </div>
        ) : null}
      </div>

      {lines.length > 0
        ? lines.map((line) => (
            <div
              key={line.id}
              className="center grid grid-cols-[1fr,auto,auto,auto] place-items-center gap-2 text-base"
            >
              <CartLine line={line} cartId={cartId} />
            </div>
          ))
        : null}
    </>
  );
}
