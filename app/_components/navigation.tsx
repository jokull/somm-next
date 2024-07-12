"use client";

import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegments } from "next/navigation";

import { allProductTypes, getSlugFromProductType } from "~/lib/commerce";
import { cn } from "~/lib/utils";

function Option({ href, option }: { option: string | null; href: string }) {
  const segments = useSelectedLayoutSegments();
  const top = segments[0];
  const searchParams = useSearchParams();
  const current = searchParams.get("tegund");
  const selected = current === option || href.startsWith(`/${top}`);
  return (
    <li>
      <Link
        href={href}
        className={cn(selected ? "underline" : "", "cursor-pointer")}
      >
        <span className="whitespace-nowrap">{option ?? "Allt"}</span>
      </Link>
    </li>
  );
}

export function Navigation() {
  const segments = useSelectedLayoutSegments();
  const top = segments[0];
  const slug = segments[1];
  return (
    <nav className="space-y-4">
      <ul className="flex w-full flex-wrap font-medium sm:justify-center lg:w-auto">
        <li>
          <Link
            href="/"
            className={`text-neutral-950 ${top === undefined ? "underline" : ""}`}
          >
            Forsíða
          </Link>
          ・
        </li>
        <li>
          <Link
            href="/blogg"
            className={`text-neutral-950 ${top === "blogg" && slug !== "afhending-a-pontunum" ? "underline" : ""}`}
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
          ・
        </li>
        <li>
          <a
            href="/blogg/afhending-a-pontunum"
            className={`text-neutral-950 ${top === "blogg" && slug === "afhending-a-pontunum" ? "underline" : ""}`}
          >
            Staðsetningar
          </a>
        </li>
      </ul>
      <ul className="flex w-full flex-wrap gap-x-3 gap-y-1 text-[blue] sm:justify-center md:gap-x-4 lg:w-auto">
        {allProductTypes.map((productType) => {
          const slug = getSlugFromProductType(productType);
          if (!slug) {
            return null;
          }
          return (
            <Option key={productType} href={`/${slug}`} option={productType} />
          );
        })}
      </ul>
    </nav>
  );
}
