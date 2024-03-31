"use client";

import { type ComponentProps } from "react";
import { Image } from "react-datocms/image";

export function DatoImage({
  ...props
}: ComponentProps<typeof Image> & { alt?: string }) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} />;
}
