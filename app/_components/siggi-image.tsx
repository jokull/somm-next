"use client";

import { useEffect, useState } from "react";

export function SiggiImage() {
  const [index, setIndex] = useState(0);
  const odds = ["cheese.png", "boy.png", "girl.png", "horse.png"];

  useEffect(() => {
    setIndex(Math.floor(odds.length * Math.random()));
  }, [odds.length]);

  return (
    <div>
      <img
        src={`/${odds[index]}`}
        alt="Illustrations by Siggi Odds"
        width={534 / 2.5}
        height={408 / 2.5}
        className="object-contain"
      />
    </div>
  );
}
