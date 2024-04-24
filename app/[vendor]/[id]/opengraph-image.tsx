import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { env } from "~/env";
import { getVendorFromSlug } from "~/lib/commerce";
import { shopify } from "~/lib/shopify";

export const runtime = "edge";
export const alt = "About";
export const contentType = "image/png";

function clampDimensions(
  height: number,
  width: number,
): { height: number; width: number } {
  const maxHeight = 500;
  const maxWidth = 500;

  let clampedHeight = Math.min(height, maxHeight);
  let clampedWidth = Math.min(width, maxWidth);

  const aspectRatio = height / width;

  if (clampedHeight === maxHeight) {
    clampedWidth = Math.min(maxWidth, clampedHeight / aspectRatio);
  } else if (clampedWidth === maxWidth) {
    clampedHeight = Math.min(maxHeight, clampedWidth * aspectRatio);
  }

  return { height: clampedHeight, width: clampedWidth };
}

export default async function GET({
  params,
}: {
  params: { vendor: string; id: string };
}) {
  const { product } = await shopify.Product({
    id: `gid://shopify/Product/${params.id}`,
  });

  const vendorName = getVendorFromSlug(params.vendor)?.name;

  if (!product || !vendorName) {
    notFound();
  }

  const ppeditorial = fetch(
    new URL("../../../assets/PPEditorialnew-Normal.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const productImage = product.variants.edges[0]?.node.image;

  return new ImageResponse(
    (
      <div
        tw="bg-white h-full w-full flex items-center"
        style={{ padding: 24 }}
      >
        {productImage ? (
          <img
            src={productImage.url}
            {...clampDimensions(
              productImage.width ?? 500,
              productImage.height ?? 500,
            )}
            alt="Wine"
          />
        ) : null}
        <div tw="w-full h-full flex flex-col justify-center p-4">
          <div tw="flex flex-col mb-36">
            <div tw="text-5xl mb-4">{product.title}</div>
            <div tw="mb-4 text-xl">{product.framleidandi?.value}</div>
          </div>
          <div tw="flex flex-col w-full items-stretch">
            <div tw="h-px bg-[#E0E0E0] mb-8 w-[90%]" />
            <img
              width={214 / 1.5}
              height={44 / 1.5}
              src={`https://${env.NEXT_PUBLIC_VERCEL_URL}/somm-logo.svg`}
              alt="Logo"
              tw="mb-2"
            />
            <div tw="text-xl">{vendorName}</div>
          </div>
        </div>
        <div tw="shrink-0 w-8" />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "PPEditorial",
          data: await ppeditorial,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
