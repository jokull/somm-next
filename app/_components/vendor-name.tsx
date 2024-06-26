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
    <div className="flex items-center justify-between gap-2">
      {linkify ? (
        <a href={`/${vendor.slug}`} className="text-xl hover:text-[blue]">
          {vendor.name}
        </a>
      ) : (
        <strong className="text-xl">{vendor.name}</strong>
      )}
      {vendor.instagram ? <InstagramLink handle={vendor.instagram} /> : null}
    </div>
  );
}
