import { cn } from "~/lib/utils";

export function WineTypeDot({ wineType }: { wineType: string }) {
  return (
    <span
      className={cn(
        "block h-2 w-2 rounded-full",
        wineType === "Rauðvín" && "bg-fuchsia-900",
        wineType === "Hvítvín" && "bg-amber-200",
        wineType === "Rósavín" && "bg-fuchsia-500",
        wineType === "Freyðivín" && "bg-amber-100",
        wineType === "Gulvín" && "bg-amber-300",
        wineType === "Te" && "bg-pink-300",
      )}
    />
  );
}
