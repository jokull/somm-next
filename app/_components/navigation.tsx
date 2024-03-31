"use client";

import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegments } from "next/navigation";

import { getVendorFromSlug, type Vendor } from "~/lib/commerce";
import { cn } from "~/lib/utils";

function Option({ href, option }: { option: string | null; href: string }) {
  const searchParams = useSearchParams();
  const current = searchParams.get("wineType");
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

const allWineTypes = [
  null,
  "Rauðvín",
  "Hvítvín",
  "Rósavín",
  "Freyðivín",
  "Gulvín",
  "Óáfengt",
] as const;

export function Navigation({ vendors }: { vendors: Vendor[] }) {
  const segments = useSelectedLayoutSegments();
  const vendorSlug = segments[0];
  const vendor = vendorSlug ? getVendorFromSlug(vendorSlug) : undefined;
  return (
    <nav className="space-y-4">
      <ul className="flex w-full flex-wrap justify-center gap-x-2 text-[blue] md:gap-x-4 lg:w-auto">
        {vendors.map(({ slug, name }) => (
          <li
            key={slug}
            className={cn(
              "whitespace-nowrap",
              vendor && vendor.slug === slug && "underline",
            )}
          >
            <a href={`/${slug}`}>{name}</a>
          </li>
        ))}
      </ul>
      {segments.length === 0 ? (
        <ul className="mb-4 flex w-full flex-wrap justify-center gap-x-2 sm:gap-4 lg:w-auto">
          {allWineTypes.map((wineType) => (
            <Option
              key={wineType}
              href={wineType ? `/?wineType=${wineType}` : "/"}
              option={wineType}
            />
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
