import { type getVendorFromName } from "~/lib/commerce";

import { InstagramLink } from "./instagram-link";

export function VendorName({
  vendor,
  linkify = true,
}: {
  vendor: ReturnType<typeof getVendorFromName>;
  linkify?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {linkify ? (
        <a
          href={`/${vendor.slug}`}
          className="text-xl font-bold hover:text-[blue]"
        >
          {vendor.name}
        </a>
      ) : (
        <strong className="text-xl">{vendor.name}</strong>
      )}
      <InstagramLink handle={vendor.instagram} />
    </div>
  );
}
