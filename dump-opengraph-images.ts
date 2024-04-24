import { mkdir, rename } from "node:fs/promises";
import { join } from "node:path";

import { z } from "zod";

import { getVendorFromName } from "./lib/commerce";

// Function to rename directories
async function renameDirectory(oldPath: string, newPath: string) {
  try {
    await rename(oldPath, newPath);
    // eslint-disable-next-line no-console
    console.info(`Renamed directory from ${oldPath} to ${newPath}`);
  } catch (error) {
    console.error(
      `Error renaming directory from ${oldPath} to ${newPath}:`,
      error,
    );
  }
}

// Fetching the JSON data from the API
const response = await fetch("http://localhost:3000/api/products");
const products = z
  .object({
    products: z.array(z.object({ id: z.string(), vendor: z.string() })),
  })
  .parse(await response.json()).products;

await renameDirectory("app/[vendor]/[id]/_og", "app/[vendor]/[id]/og");

for (const product of products) {
  const idMatch = product.id.match(/(\d+)/);
  if (!idMatch) {
    continue;
  }
  const id = idMatch[0];
  const vendor = getVendorFromName(product.vendor).slug;
  const url = `http://localhost:3000/${vendor}/${id}/og/opengraph-image`;

  // Fetching the PNG image from the constructed URL
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image from ${url}`);
  }
  const imageBuffer = await imageResponse.arrayBuffer();

  // Creating directory path if it doesn't exist using Bun.file
  const dirPath = `./public/opengraph-images/${vendor}`;
  await mkdir(dirPath, { recursive: true });

  // Writing the image file using Bun.file
  const filePath = Bun.file(join(dirPath, `${id}.png`));
  await Bun.write(filePath, imageBuffer);
  // eslint-disable-next-line no-console
  console.info(`Image saved to ${filePath.toString()}`);
}

await renameDirectory("app/[vendor]/[id]/og", "app/[vendor]/[id]/_og");
