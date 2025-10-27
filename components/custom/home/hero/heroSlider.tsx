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
              src="/images/banners/KMgT.gif"
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
              src="/images/banners/art.webp"
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
              src="/images/banners/gaf.gif"
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
              src="/images/banners/baner3.webp"
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
              src="/images/banners/baner4.jpg"
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
              src="/images/banners/aft.gif"
              fill
              alt="hero"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSlider;