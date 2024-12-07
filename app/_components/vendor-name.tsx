import { type getVendorFromName } from "~/lib/commerce";

import { InstagramLink } from "./instagram-link";

export function VendorName({
  vendor,
}: {
  vendor: ReturnType<typeof getVendorFromName>;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xl">{vendor.name}</span>
      {vendor.instagram ? <InstagramLink handle={vendor.instagram} /> : null}
    </div>
  );
}
