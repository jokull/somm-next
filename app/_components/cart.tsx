"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { useQuery } from "urql";

import { type Cart as CartType } from "~/lib/cart";
import { cn } from "~/lib/classnames";
import { GetCartDocument } from "~/lib/gql/graphql";

import { CartLines } from "./cart-lines";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

function Button({
  open,
  totalQuantity,
}: {
  open: boolean;
  totalQuantity: number;
}) {
  return (
    <span className="flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white">
      Karfa
      {totalQuantity > 0 ? <span>{totalQuantity}</span> : null}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </span>
  );
}

function Inner({ cart, onClose }: { cart?: CartType; onClose: () => void }) {
  const totalQuantity = cart?.totalQuantity ?? 0;

  if (!cart || totalQuantity === 0) {
    return <div>Tóm karfa</div>;
  }

  const lines = cart.lines.edges.flatMap(({ node }) =>
    node.__typename === "CartLine" ? [node] : [],
  );

  return (
    <>
      <CartLines cartId={cart.id} lines={lines} />
      <div className="mt-2 flex justify-between border-t pt-3 font-medium">
        <div>Samtals</div>
        <div className="w-[105px] shrink-0 text-right">
          {Number.parseInt(cart.cost.totalAmount.amount).toLocaleString(
            "de-DE",
            {
              maximumFractionDigits: 0,
            },
          )}{" "}
          kr
        </div>
      </div>
      <div className="mt-4">
        <form method="POST" action="/checkout" className="flex gap-4">
          <button
            className="grow-[1] rounded-md bg-neutral-200 px-4 py-3"
            onClick={(event) => {
              event.preventDefault();
              onClose();
            }}
          >
            Loka
          </button>

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

export function Cart({ cart: serverCart }: { cart?: CartType }) {
  const [result] = useQuery({
    query: GetCartDocument.toString(),
    variables: { cartId: serverCart?.id ?? "" },
    pause: !serverCart,
  });
  const cart = result.data?.cart ?? serverCart;
  const [open, setOpen] = useState(false);
  const totalQuantity = cart?.totalQuantity ?? 0;
  return (
    <div className="font-sans">
      <nav className="fixed right-4 top-3 z-20">
        <div className="sm:hidden">
          <Drawer>
            <DrawerTrigger>
              Karfa {totalQuantity > 0 ? <span>{totalQuantity}</span> : null}
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Karfan þín</DrawerTitle>
              </DrawerHeader>
              <Inner
                cart={cart}
                onClose={() => {
                  setOpen(false);
                }}
              />
              <DrawerFooter>
                <DrawerClose>
                  <button>Cancel</button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="hidden sm:block">
          <Popover.Root
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
            }}
          >
            <Popover.Trigger>
              <Button open={open} totalQuantity={cart?.totalQuantity ?? 0} />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                data-side="top"
                className={`
									mr-4
									w-[480px]
									will-change-[transform,opacity]
									data-[state=open]:data-[side=bottom]:animate-slideUpAndFade
									data-[state=open]:data-[side=left]:animate-slideRightAndFade
                  data-[state=open]:data-[side=right]:animate-slideLeftAndFade
                  data-[state=open]:data-[side=top]:animate-slideDownAndFade
								`}
                sideOffset={5}
              >
                <div className="flex max-h-[calc(100vh-120px)] w-full flex-col gap-2 overflow-y-auto rounded-md border border-neutral-200 bg-neutral-100 p-6 shadow-xl">
                  <Inner
                    cart={cart}
                    onClose={() => {
                      setOpen(false);
                    }}
                  />
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </nav>
    </div>
  );
}
