import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { toNextMetadata } from "react-datocms";

import { DatoImage } from "~/app/_components/dato-image";
import { PostContent } from "~/app/_components/post-content";
import { dato } from "~/lib/dato";

export const runtime = "edge";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post } = await dato.Post({ slug: params.slug });

  if (!post) {
    notFound();
  }

  return {
    ...toNextMetadata(post._seoMetaTags),
    title: `${post.title} — Blogg — Somm`,
    description: post.excerpt,
  };
}

export default async function Page({ params }: Props) {
  const { post } = await dato.Post({ slug: params.slug });

  if (!post) {
    notFound();
  }
  return (
    <div>
      <div className="mx-auto my-8 grid gap-8 sm:gap-4 md:max-w-5xl md:grid-cols-[auto,1fr] md:gap-8">
        <div className="">
          <DatoImage
            data={post.image.responsiveImage}
            className="overflow-hidden rounded-md shadow-xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:items-stretch">
          <h1 className="text-3xl sm:text-5xl">{post.title}</h1>
          <time
            suppressHydrationWarning
            className="font-light text-neutral-500"
          >
            {new Date(`${post.date}T00:00:00`).toLocaleString("is-IS", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeStyle: undefined,
            })}
          </time>
          <p className="w-full text-xl">{post.excerpt}</p>
        </div>
      </div>
      <div className="mx-auto max-w-xl text-lg @container [&_.embed]:my-12 [&_p]:mb-4 [&_p]:font-light">
        <PostContent field={post.content} />
      </div>
    </div>
  );
}
