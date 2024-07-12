import { type FragmentOf } from "gql.tada";
import { groupBy, pipe } from "remeda";

import { type paginatedProductsFragment } from "./products";

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
  unagi: {
    name: "Slóvakískt vín",
    shopifyVendor: "Unagi ehf.",
    slug: "slovakiskt-vin",
    instagram: "slovakiskt.vin",
  },
  // "le-caviste": {
  //   name: "Le Caviste",
  //   shopifyVendor: "Le Caviste",
  //   slug: "le-caviste",
  //   instagram: "apero.rvk",
  // },
  "a-fly-fishing-club": {
    name: "Á Fly Fishing Club",
    shopifyVendor: "Ægir Brugghús ehf.",
    slug: "a-fly-fishing-club",
    instagram: "a.flyflishingclub",
  },
  annad: {
    name: "Annað",
    shopifyVendor: "somm.is",
    slug: "annad",
    instagram: null,
  },
} as const;

export const allProductTypes = [
  // null,
  "Rauðvín",
  "Hvítvín",
  "Rósavín",
  "Freyðivín",
  "Gulvín",
  "Bjór",
  "Óáfengt",
] as const;

export function getProductTypeFromSlug(slug: string | undefined) {
  switch (slug) {
    case "raudvin":
      return "Rauðvín";
    case "hvitvin":
      return "Hvítvín";
    case "rosavin":
      return "Rósavín";
    case "freydivin":
      return "Freyðivín";
    case "gulvin":
      return "Gulvín";
    case "bjor":
      return "Bjór";
    case "oafengt":
      return "Óáfengt";
  }
}

export function getSlugFromProductType(slug: string | undefined) {
  switch (slug) {
    case "Rauðvín":
      return "raudvin";
    case "Hvítvín":
      return "hvitvin";
    case "Rósavín":
      return "rosavin";
    case "Freyðivín":
      return "freydivin";
    case "Gulvín":
      return "gulvin";
    case "Bjór":
      return "bjor";
    case "Óáfengt":
      return "oafengt";
  }
}

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

export function getProductsByVendor(
  products: FragmentOf<typeof paginatedProductsFragment>,
) {
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

export function getProductQuantityStep(productType: string) {
  return 1;
  // const isBeer = productType === "Bjór";
  // const productQuantityStep = isBeer ? 4 : 1;
  // return productQuantityStep;
}
