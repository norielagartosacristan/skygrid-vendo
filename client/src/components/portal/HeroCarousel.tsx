import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
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
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop
      className="h-[220px] sm:h-[280px] md:h-[380px] lg:h-[520px]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.subtitle}>
          <div className="relative w-full h-full">

            <img
              src={slide.image}
              alt={slide.subtitle}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto w-full px-5 sm:px-8">

                <div className="max-w-xl">

                  <h4 className="text-sky-400 font-semibold text-sm sm:text-lg lg:text-xl">
                    {slide.title}
                  </h4>

                  <h1 className="mt-2 text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
                    {slide.subtitle}
                  </h1>

                  <p className="mt-4 text-gray-200 text-sm sm:text-base lg:text-xl">
                    {slide.description}
                  </p>

                  <button
                    className="
                      mt-6
                      bg-sky-600
                      hover:bg-sky-700
                      text-white
                      font-semibold
                      rounded-xl
                      px-5
                      py-3
                      sm:px-7
                      sm:py-3
                      transition
                    "
                  >
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