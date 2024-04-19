import { Slot } from "@radix-ui/react-slot";
import { type ReactNode } from "react";

import { useCart } from "~/lib/use-cart";

export function CartFooter({ children }: { children: ReactNode }) {
  const [cart] = useCart();
  const totalQuantity = cart?.totalQuantity ?? 0;

  if (!cart || totalQuantity === 0) {
    return <div>Tóm karfa</div>;
  }

  const totalAmount = cart.cost.totalAmount;

  return (
    <>
      <div className="mt-2 flex justify-between border-t pt-3 font-medium">
        <div>Samtals</div>
        <div className="w-[105px] shrink-0 text-right">
          {Number.parseInt(totalAmount.amount).toLocaleString("de-DE", {
            maximumFractionDigits: 0,
          })}{" "}
          kr
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <Slot className="grow-[1] rounded-md bg-neutral-200 px-4 py-3">
          {children}
        </Slot>

        <form method="POST" action="/checkout" className="contents">
          {totalQuantity < 2 ? (
            <button
              disabled
              className="flex grow-[2] items-center justify-center gap-2 rounded-md bg-neutral-200 px-4 py-3 text-lg text-black/20"
            >
              Lágmark 2 flöskur per pöntun
            </button>
          ) : (
            <button className="flex grow-[2] items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-3 text-lg font-medium text-white shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
                />
              </svg>
              <div>Halda áfram í Auðkenni</div>
            </button>
          )}
        </form>
      </div>
      <div className="mt-4 text-center text-sm text-neutral-600">
        Með því að smella á Auðkenni samþykkir þú{" "}
        <a className="font-bold underline" href="/skilmalar">
          skilmála
        </a>{" "}
        Somm.is
      </div>
      <div className="mt-2 text-center text-xs text-neutral-400">
        Ekki má selja eða afhenda þeim áfengi sem eru yngri en 20 ára
      </div>
    </>
  );
}
