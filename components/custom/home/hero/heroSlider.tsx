"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css";

import "./styles.css";
// import required modules
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const HeroSlider = () => {
  return (
    <div className="absolute inset-0 z-0">
    <Swiper
  pagination={{
    dynamicBullets: true,
    clickable: true,
  }}
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
  }}
  loop={true}
  speed={1000} // أسرع في التنقل بين الصور
  effect="fade" // لتغيير التأثير ليكون fade
  modules={[Pagination, Autoplay]}
  className="heroCarousel"
>
        <SwiperSlide>
          <div className="image-container">
            <Image
              src="/images/banners/last.jpeg"
              fill
              alt="hero"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="image-container">
            <Image
              src="/images/banners/gt5.jpeg"
              fill
              alt="hero"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>
          <SwiperSlide>
  <div className="image-container relative w-full h-full">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover object-center"
      preload="auto"
      style={{ width: '100%', height: '100%' }}
    >
      <source src="/images/banners/WhatsApp Video 2025-11-05 at 3.37.51 PM.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</SwiperSlide>
       
        <SwiperSlide>
          <div className="image-container">
            <Image
              src="/images/banners/gt.jpeg"
              fill
              alt="hero"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>

          <SwiperSlide>
          <div className="image-container">
            <Image
              src="/images/banners/get2.jpeg"
              fill
              alt="hero"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="image-container">
            <Image
              src="/images/banners/g.jpeg"
              fill
              alt="hero"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
  <div className="image-container relative w-full h-full">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover object-center"
      preload="auto"
      style={{ width: '100%', height: '100%' }}
    >
      <source src="/images/banners/WhatsApp Video 2025-11-05 at 3.37.50 PM.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</SwiperSlide>

      </Swiper>
    </div>
  );
};

export default HeroSlider;