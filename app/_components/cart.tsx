"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";
import { useQuery } from "urql";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { type Cart as CartType } from "~/lib/cart";
import { GetCartDocument } from "~/lib/gql/graphql";
import { cn } from "~/lib/utils";

import { CartFooter } from "./cart-footer";
import { CartLines } from "./cart-lines";

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
      {totalQuantity > 0 ? (
        <span className="text-neutral-500">{totalQuantity}</span>
      ) : null}
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

export function Cart({ cart: serverCart }: { cart?: CartType }) {
  const [result] = useQuery({
    query: GetCartDocument.toString(),
    variables: { cartId: serverCart?.id ?? "" },
    pause: !serverCart,
  });
  const cart = result.data?.cart ?? serverCart;
  const [open, setOpen] = useState(false);
  const totalQuantity = cart?.totalQuantity ?? 0;

  const lines =
    cart?.lines.edges.flatMap(({ node }) =>
      node.__typename === "CartLine" ? [node] : [],
    ) ?? [];

  return (
    <div className="font-sans">
      <nav className="fixed right-4 top-3 z-20">
        <div className="sm:hidden">
          <Drawer>
            <div className="fixed inset-x-0 bottom-0 z-30 w-full p-4">
              <DrawerTrigger className="block w-full rounded-md bg-neutral-900 px-4 py-3 text-lg font-medium text-white shadow-xl sm:hidden">
                <span>
                  Karfa{" "}
                  {totalQuantity > 0 ? (
                    <span className="text-neutral-500">{totalQuantity}</span>
                  ) : null}
                </span>
              </DrawerTrigger>
            </div>
            <DrawerContent className="font-sans">
              <DrawerHeader>
                <DrawerTitle>Karfan þín</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                {cart ? <CartLines lines={lines} cartId={cart.id} /> : null}
              </div>
              <DrawerFooter>
                <CartFooter cart={cart}>
                  <DrawerClose asChild>
                    <button>Loka</button>
                  </DrawerClose>
                </CartFooter>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="hidden sm:block">
          <Popover
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
            }}
          >
            <PopoverTrigger>
              <Button open={open} totalQuantity={cart?.totalQuantity ?? 0} />
            </PopoverTrigger>
            <PopoverContent className="flex max-h-[calc(100vh-120px)] w-full -translate-x-4 flex-col gap-2 overflow-y-auto rounded-md border border-neutral-200 bg-neutral-100 p-6 shadow-xl">
              <h2 className="mb-2 text-xl font-medium">Karfa</h2>
              {cart ? <CartLines lines={lines} cartId={cart.id} /> : null}
              <CartFooter cart={cart}>
                <PopoverClose asChild>
                  <button>Loka</button>
                </PopoverClose>
              </CartFooter>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </div>
  );
}
