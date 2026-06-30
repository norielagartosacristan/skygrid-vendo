import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import banner1 from "../../assets/banners/banner1.jpg";
import banner2 from "../../assets/banners/banner2.jpg";
import banner3 from "../../assets/banners/banner3.jpg";

const slides = [
  {
    image: banner1,
    title: "Welcome to",
    subtitle: "SkyGrid Vendo",
    description: "High-Speed Internet Access",
  },
  {
    image: banner2,
    title: "Today's Promo",
    subtitle: "₱20 = 1 Day",
    description: "Enjoy unlimited browsing.",
  },
  {
    image: banner3,
    title: "Powered by",
    subtitle: "SkyGrid Tech Solutions",
    description: "Fast • Secure • Reliable",
  },
];

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
      }}
      loop
      className="h-[300px] lg:h-[520px]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.subtitle}>
          <div className="relative w-full h-full">

            <img
              src={slide.image}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />

           <div className="absolute inset-0 flex items-center">

  <div className="max-w-7xl mx-auto w-full px-6">

    <div className="max-w-2xl">

      <h4 className="text-sky-400 text-xl font-semibold">
        High-Speed Internet
      </h4>

      <h1 className="text-6xl lg:text-7xl font-black text-white mt-4 leading-tight">
        SkyGrid Vendo
      </h1>

      <p className="text-gray-200 text-xl mt-6">
        Fast • Secure • Reliable Internet Access
      </p>

      <button className="mt-8 bg-sky-600 hover:bg-sky-700 px-8 py-4 rounded-2xl text-white text-lg font-semibold transition">
        View Packages
      </button>

    </div>

  </div>

</div>

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}