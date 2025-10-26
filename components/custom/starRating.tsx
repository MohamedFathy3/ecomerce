"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

export type StarRatingProps = {
  value: number;
  outOf?: number;
  color?: string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  filledOnly?: boolean;
};

export default function StarRating({
  value,
  outOf = 5,
  color = "text-yellow-500",
  readOnly = true,
  onChange,
  filledOnly = false,
}: StarRatingProps) {
  // track hover state for interactive fill on hover
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div
      className={`flex items-center gap-0.5 ${color}`}
      onMouseLeave={() => {
        if (!readOnly) setHovered(null);
      }}
    >
      {Array.from({ length: outOf }).map((_, i) => {
        const filled = hovered !== null ? i < hovered : i < value;
        return (
          <Star
            key={i}
            size={18}
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1}
            className={`${
              !readOnly && onChange ? "cursor-pointer" : undefined
            } ${filledOnly && !filled ? "hidden" : ""}`}
            onClick={() => {
              if (!readOnly && onChange) {
                onChange(i + 1);
              }
            }}
            onMouseEnter={() => {
              if (!readOnly) setHovered(i + 1);
            }}
          />
        );
      })}
    </div>
  );
}
