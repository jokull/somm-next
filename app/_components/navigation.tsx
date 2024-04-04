"use client";

import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegments } from "next/navigation";

import {
  allProductTypes,
  getVendorFromSlug,
  type Vendor,
} from "~/lib/commerce";
import { cn } from "~/lib/utils";

function Option({ href, option }: { option: string | null; href: string }) {
  const searchParams = useSearchParams();
  const current = searchParams.get("tegund");
  return (
    <li>
      <Link
        href={href}
        className={cn(
          current === option ? "underline" : "",
          "cursor-pointer font-medium",
        )}
      >
        <span className="whitespace-nowrap">{option ?? "Allt"}</span>
      </Link>
    </li>
  );
}

export function Navigation({ vendors }: { vendors: Vendor[] }) {
  const segments = useSelectedLayoutSegments();
  const vendorSlug = segments[0];
  const vendor = vendorSlug ? getVendorFromSlug(vendorSlug) : undefined;
  return (
    <nav className="space-y-4">
      <ul className="flex w-full flex-wrap justify-center gap-x-2 text-[blue] md:gap-x-4 lg:w-auto">
        {vendors
          .filter(({ shopifyVendor }) => shopifyVendor !== "somm.is")
          .map(({ slug, name }) => (
            <li
              key={slug}
              className={cn(
                "whitespace-nowrap",
                vendor && vendor.slug === slug && "underline",
              )}
            >
              <Link href={`/${slug}`}>{name}</Link>
            </li>
          ))}
        <li className={vendorSlug === "blogg" ? "underline" : ""}>
          <Link href="/blogg" className="italic text-neutral-950">
            Blogg
          </Link>
        </li>
      </ul>
      {segments.length === 0 ? (
        <ul className="mb-4 flex w-full flex-wrap justify-center gap-x-2 sm:gap-4 lg:w-auto">
          {allProductTypes.map((productType) => (
            <Option
              key={productType}
              href={productType ? `/?tegund=${productType}` : "/"}
              option={productType}
            />
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
