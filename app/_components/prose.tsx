export function Prose({ html }: { html: string }) {
  return (
    <div
      className="max-w-lg [&_.s4]:text-lg [&_.s4]:font-medium [&_.s8]:font-bold [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_p]:mb-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
