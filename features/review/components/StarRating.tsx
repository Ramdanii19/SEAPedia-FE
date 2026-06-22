"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  value: number;
  onChange?: (n: number) => void;
  readOnly?: boolean;
};

export function StarRating({ value, onChange, readOnly = false }: Props) {
  const [hovered, setHovered] = useState(0);

  const active = hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(n)}
          onMouseEnter={() => !readOnly && setHovered(n)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className="p-0.5 disabled:cursor-default"
        >
          <Star
            size={20}
            className={
              n <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-[#bcc9c6]"
            }
          />
        </button>
      ))}
    </div>
  );
}
