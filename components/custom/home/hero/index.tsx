"use client";

import dynamic from "next/dynamic";

const HeroSlider = dynamic(() => import("./heroSlider"), {
  ssr: false,
  loading: () => <div className="h-[60vh] bg-gray-100 animate-pulse"></div>,
});

const Hero = () => {
  return (
    <section className="relative h-110 max-h-[calc(80vh - 7rem)]">
      <HeroSlider  />
    </section>
  );
};

export default Hero;
