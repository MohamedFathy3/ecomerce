"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css";
import "./styles.css";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const HeroSlider = () => {
  return (
    <div className="w-full h-full">
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
        speed={1000}
        effect="fade"
        modules={[Pagination, Autoplay]}
        className="heroCarousel"
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <SwiperSlide style={{ margin: 0, padding: 0 }}>
          <div className="image-container">
            <Image
              src="/images/banners/last.jpeg"
              fill
              alt="Premium silicone products"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide style={{ margin: 0, padding: 0 }}>
          <div className="image-container">
            <Image
              src="/images/banners/gt5.jpeg"
              fill
              alt="High quality materials"
              className="object-cover object-center"
              priority={true}
            />
          </div>
        </SwiperSlide>

        <SwiperSlide style={{ margin: 0, padding: 0 }}>
          <div className="image-container relative w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
              preload="auto"
              style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}
            >
              <source src="/images/banners/WhatsApp Video 2025-11-05 at 3.37.51 PM.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </SwiperSlide>

        <SwiperSlide style={{ margin: 0, padding: 0 }}>
          <div className="image-container">
            <Image
              src="/images/banners/gt.jpeg"
              fill
              alt="Professional solutions"
              className="object-cover object-center"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide style={{ margin: 0, padding: 0 }}>
          <div className="image-container">
            <Image
              src="/images/banners/get2.jpeg"
              fill
              alt="Innovative technology"
              className="object-cover object-center"
            />
          </div>
        </SwiperSlide>

 

        <SwiperSlide style={{ margin: 0, padding: 0 }}>
          <div className="image-container relative w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
              preload="auto"
              style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}
            >
              <source src="/images/banners/WhatsApp Video 2025-11-05 at 3.37.50 PM.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </SwiperSlide>

        {/* يمكنك إضافة المزيد من الفيديوهات أو الصور هنا */}
     

        <SwiperSlide style={{ margin: 0, padding: 0 }}>
          <div className="image-container">
            <Image
              src="/images/banners/gt3.jpeg"
              fill
              alt="Advanced solutions"
              className="object-cover object-center"
            />
          </div>
        </SwiperSlide>
        

      </Swiper>
    </div>
  );
};

export default HeroSlider;