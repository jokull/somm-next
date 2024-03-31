import type { StructuredTextDocument } from "react-datocms/structured-text";

declare global {
  declare type StructuredTextScalar = StructuredTextDocument;
}
