import { type Metadata } from "next";
import Link from "next/link";
import { groupBy } from "remeda";

import { dato } from "~/lib/dato";

import { DatoImage } from "../_components/dato-image";

export const metadata: Metadata = {
  title: "Blogg — Somm",
};

export const runtime = "edge";

function formatDateString(dateString: string): string {
  const [year, month] = dateString.split("-").map(Number) as [number, number];
  const date = new Date(year, month - 1);

  const formatter = new Intl.DateTimeFormat("is-IS", {
    year: "numeric",
    month: "long",
  });

  let formattedDate = formatter.format(date);

  // Capitalize the first letter
  formattedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return formattedDate;
}

export default async function Page() {
  const { allPosts } = await dato.Posts();
  const postGroups = groupBy(allPosts, (post) => post.date.slice(0, 7));
  return (
    <div className="mx-auto max-w-md space-y-6">
      {Object.entries(postGroups).map(([key, posts]) => (
        <div key={key}>
          <div className="mb-4 text-xs font-light">{formatDateString(key)}</div>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                href={`/blogg/${post.slug}`}
                key={post.id}
                className="flex gap-4"
              >
                <DatoImage
                  data={post.image.responsiveImage}
                  className="overflow-hidden rounded-md shadow-lg"
                />
                <div>
                  <div>{post.title}</div>
                  <time
                    suppressHydrationWarning
                    className="text-sm text-neutral-500"
                  >
                    {new Date(`${post.date}T00:00:00`).toLocaleString("is-IS", {
                      month: "long",
                      day: "numeric",
                      year: undefined,
                      timeStyle: undefined,
                    })}
                  </time>
                  <p className="line-clamp-2 text-sm font-light">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
