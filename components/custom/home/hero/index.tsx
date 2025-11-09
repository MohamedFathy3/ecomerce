"use client";

import dynamic from "next/dynamic";

const HeroSlider = dynamic(() => import("./heroSlider"), {
  ssr: false,
  loading: () => (
    <div className="h-[55vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh] bg-gray-100 animate-pulse"></div>
  ),
});

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden mb-0">
      <HeroSlider />
    </section>
  );
};

export default Hero;