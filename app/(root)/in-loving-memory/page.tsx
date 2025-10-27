"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const memorialGifts = [
  {
    id: 1,
    name: "Candle of Remembrance",
    image: "/images/memorial/candle1.jpg",
    description:
      "Light a gentle candle to honor the memory of your loved one. A symbol of eternal love and peace.",
  },
  {
    id: 2,
    name: "Memory Frame",
    image: "/images/memorial/frame.jpg",
    description:
      "A beautiful wooden frame to keep their photo close, engraved with timeless words of remembrance.",
  },
  {
    id: 3,
    name: "Forever Flower",
    image: "/images/memorial/flower.jpg",
    description:
      "A handcrafted flower that never fades, representing everlasting memories and love.",
  },
  {
    id: 4,
    name: "Memorial Stone",
    image: "/images/memorial/stone.jpg",
    description:
      "Engraved stone to place in the garden or home as a lasting tribute to someone special.",
  },
];

export default function MemorialPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          In Loving Memory
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Honor the lives of those we cherish through meaningful gifts that
          symbolize remembrance, love, and eternal peace.
        </p>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 lg:px-20">
        {memorialGifts.map((gift) => (
          <motion.div
            key={gift.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-full h-60">
              <Image
                src={gift.image}
                alt={gift.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {gift.name}
              </h3>
              <p className="text-gray-600 text-sm">{gift.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Quote */}
      <div className="text-center mt-20 px-4">
        <p className="text-gray-500 italic text-lg">
          “Those we love don’t go away; they walk beside us every day.”
        </p>
      </div>
    </div>
  );
}
