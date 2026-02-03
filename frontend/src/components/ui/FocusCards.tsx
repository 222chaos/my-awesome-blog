'use client';

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Album } from "@/types";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onClick,
  }: {
    card: Album;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onClick?: (id: string) => void;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => onClick && onClick(card.id)}
      className={cn(
        "rounded-2xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out cursor-pointer border border-transparent dark:border-white/10",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
        hovered === index && "scale-[1.02] ring-2 ring-tech-cyan"
      )}
    >
      <img
        src={card.coverImage}
        alt={card.title}
        className="object-cover absolute inset-0 w-full h-full"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
          {card.title}
          <p className="text-sm text-gray-300 mt-2">{card.description}</p>
        </div>
      </div>
    </div>
  )
);

Card.displayName = "Card";

export function FocusCards({ 
  cards, 
  onCardClick 
}: { 
  cards: Album[]; 
  onCardClick?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title + index}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
