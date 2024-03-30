import { groupBy, pipe } from "remeda";

import { type ProductsQuery } from "~/storefront";

export type ProductsCollection = NonNullable<
  ProductsQuery["collection"]
>["products"];

export const vendors = {
  kaffihusvesturbaejar: {
    name: "Kaffi Vest",
    shopifyVendor: "Vesturbær - Kaffihús ehf.",
    slug: "kaffihusvesturbaejar",
    instagram: "kaffihusvesturbaejar",
  },
  raeturogvin: {
    name: "Rætur & Vín",
    shopifyVendor: "Rætur & Vín ehf.",
    slug: "raeturogvin",
    instagram: "raeturogvin",
  },
  berjamor: {
    name: "Berjamór",
    shopifyVendor: "Berjamór ehf.",
    slug: "berjamor",
    instagram: "berjamor_vin",
  },
  baunir: {
    name: "Baunir & Ber",
    shopifyVendor: "Baunir & Ber ehf.",
    slug: "baunir",
    instagram: "baunirogber",
  },
  // vinstukan: {
  // 	name: 'Vínstúkan',
  // 	shopifyVendor: 'Vínstúkan Tíu Sopar',
  // 	slug: 'vinstukan',
  // 	instagram: 'vinstukan'
  // },
  akkurat: {
    name: "Akkúrat",
    shopifyVendor: "Tefélagið ehf.",
    slug: "akkurat",
    instagram: "akkurat",
  },
  vinbondinn: {
    name: "Vínbóndinn",
    shopifyVendor: "Vínbóndinn ehf.",
    slug: "vinbondinn",
    instagram: "vinbondinn",
  },
  "le-caviste": {
    name: "Le Caviste",
    shopifyVendor: "Le Caviste",
    slug: "le-caviste",
    instagram: "apero.rvk",
  },
} as const;

export type Vendor = (typeof vendors)[keyof typeof vendors];

export function getVendorFromName(vendor: string) {
  return (
    Object.values(vendors).find((value) => value.shopifyVendor === vendor) ??
    vendors.baunir
  );
}

export function getVendorFromSlug(slug: string) {
  return Object.values(vendors).find((value) => value.slug === slug);
}

export function getProductsByVendor(products: ProductsCollection) {
  const vendorProducts = pipe(
    products.edges,
    groupBy((x) => x.node.vendor),
  );
  const vendors = Object.keys(vendorProducts).map(getVendorFromName);

  return {
    vendors,
    vendorProducts: Object.entries(vendorProducts).flatMap(
      ([vendorSlug, products]) => {
        const vendor = vendors.find(({ name }) => name === vendorSlug);
        if (vendor) {
          return [{ vendor, products }];
        } else {
          return [];
        }
      },
    ),
  };
}
