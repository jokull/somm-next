export type SearchParams = Record<string, string | string[] | undefined>;

export function getFirstSearchParam(
  searchParams: SearchParams,
  key: string,
): string | undefined {
  const value = searchParams[key];

  return Array.isArray(value) ? value[0] : value;
}

export function convertToURLSearchParams(searchParams: SearchParams) {
  const params: [string, string][] = [];

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const element of value) {
        params.push([key, element]);
      }
    } else if (typeof value === "string") {
      params.push([key, value]);
    }
  }

  return new URLSearchParams(params);
}
