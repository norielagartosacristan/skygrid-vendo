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
    subtitle: "BayanNet Wifi Vendo",
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
    subtitle: "BayanNet Wifi Vendo",
    description: "Fast • Secure • Reliable",
  },
];

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      className="h-[300px] sm:h-[350px] md:h-[420px] lg:h-[520px]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.subtitle}>
          <div className="relative w-full h-full overflow-hidden">

            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.subtitle}
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                object-center
              "
            />

            {/* Dark Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-slate-950/90
                via-slate-900/60
                to-slate-900/10
              "
            />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">

              <div
                className="
                  w-full
                  max-w-7xl
                  mx-auto
                  px-4
                  sm:px-6
                  lg:px-8
                "
              >

                {/* Move Content Up */}
                <div
                  className="
                    max-w-xl
                    -translate-y-8
                    sm:-translate-y-10
                    lg:-translate-y-16
                  "
                >

                  {/* Small Title */}
                  <h4
                    className="
                      text-sky-400
                      font-semibold
                      text-xs
                      sm:text-base
                      md:text-lg
                      lg:text-xl
                      leading-tight
                    "
                  >
                    {slide.title}
                  </h4>

                  {/* Main Title */}
                  <h1
                    className="
                      mt-1
                      sm:mt-2
                      text-2xl
                      sm:text-4xl
                      md:text-5xl
                      lg:text-7xl
                      font-black
                      text-white
                      leading-[1.1]
                      break-words
                    "
                  >
                    {slide.subtitle}
                  </h1>

                  {/* Description */}
                  <p
                    className="
                      mt-2
                      sm:mt-3
                      md:mt-4
                      max-w-md
                      text-gray-200
                      text-xs
                      sm:text-sm
                      md:text-base
                      lg:text-xl
                      leading-relaxed
                    "
                  >
                    {slide.description}
                  </p>

                </div>

              </div>

            </div>

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}