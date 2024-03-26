import { cn } from "~/lib/classnames";

export function ProductsGridSkeleton() {
  return (
    <div
      className={cn(
        "mb-12 grid gap-x-4 gap-y-5 pb-12 last-of-type:border-none last-of-type:pb-0 md:mb-28 md:gap-x-6 md:gap-y-8 md:pb-28",
        "grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))]",
        "md:grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))]",
        "lg:grid-cols-[repeat(auto-fill,minmax(min(14rem,100%),1fr))]",
        "xl:grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))]",
      )}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="flex flex-col gap-2" key={index}>
          <div className="aspect-[3/4] rounded bg-neutral-100" />
          <div className="h-6 w-full rounded bg-neutral-100" />
          <div className="h-6 w-full rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}
