"use client";

import { useFormState } from "react-dom";

import { subscribeToHubspot } from "~/lib/actions";
import { cn } from "~/lib/classnames";

export function Newsletter() {
  const [message, action] = useFormState(subscribeToHubspot, null);
  return (
    <form action={action}>
      <div>
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            required
            pattern=".+@.+\..+"
            placeholder="Netfang"
            className="w-full rounded-none border-0 border-b border-neutral-500 bg-transparent px-0 placeholder-neutral-500 sm:w-auto"
          />
          <button className={cn("whitespace-nowrap py-1")}>
            {" "}
            Skrá á póstlista{" "}
          </button>
        </div>
        {message?.success ? (
          <div className="mt-2">Takk fyrir skráninguna, við verðum í bandi</div>
        ) : null}
        {message && !message.success && message.message ? (
          <div className="mt-2 text-red-600">{message.message}</div>
        ) : null}
      </div>
    </form>
  );
}
