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
        className={cn(current === option ? "underline" : "", "cursor-pointer")}
      >
        <span className="whitespace-nowrap">{option ?? "Allt"}</span>
      </Link>
    </li>
  );
}

export function Navigation({ vendors }: { vendors: Vendor[] }) {
  const segments = useSelectedLayoutSegments();
  const top = segments[0];
  const vendor = top ? getVendorFromSlug(top) : undefined;
  return (
    <nav className="space-y-4">
      <ul className="flex w-full flex-wrap font-medium text-[blue] sm:justify-center lg:w-auto">
        <li>
          <Link
            href="/"
            className={`text-neutral-950 ${typeof top === "undefined" ? "underline" : ""}`}
          >
            Forsíða
          </Link>
          ・
        </li>
        <li>
          <Link
            href="/blogg"
            className={`text-neutral-950 ${top === "blogg" ? "underline" : ""}`}
          >
            Blogg
          </Link>
          ・
        </li>
        <li>
          <a
            href="https://www.instagram.com/sommrvk"
            className="text-neutral-950"
            target="_blank"
          >
            Instagram
          </a>
        </li>
      </ul>
      <ul className="flex w-full flex-wrap gap-x-3 gap-y-1 text-[blue] sm:justify-center md:gap-x-4 lg:w-auto">
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
      </ul>
      {segments.length === 0 ? (
        <ul className="mb-4 flex w-full flex-wrap gap-x-3 gap-y-1 sm:justify-center sm:gap-4 lg:w-auto">
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
