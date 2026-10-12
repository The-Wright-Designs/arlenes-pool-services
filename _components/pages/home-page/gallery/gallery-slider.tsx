"use client";

import { SetStateAction, useState } from "react";
import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { GalleryProps } from "@/_types/wordpress-types";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface Props {
  cssClasses?: string;
  desktop?: boolean;
  data: GalleryProps[];
}

const GallerySlider = ({ cssClasses, desktop, data }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideChange = (swiper: {
    activeIndex: SetStateAction<number>;
  }) => {
    setCurrentIndex(swiper.activeIndex);
  };

  if (desktop) {
    return (
      <>
        <Swiper
          onSlideChange={handleSlideChange}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          speed={1000}
          modules={[Autoplay, Navigation, Pagination]}
          pagination={{
            dynamicBullets: true,
          }}
          className={cssClasses}
          slidesPerView={2}
          spaceBetween={40}
          loop
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
        >
          {data.length > 0 &&
            data[0].acf.photo_gallery.gallery[0].map((image, index) => (
              <SwiperSlide key={index} className="mb-10">
                <Image
                  src={image.desktop_image_url || image.full_image_url}
                  alt={`Arlene's Pool Services - Gallery Image ${index + 1}`}
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
              </SwiperSlide>
            ))}
          <button
            className="gallery-prev absolute top-1/2 -translate-y-1/2 z-10 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue desktop:hover:cursor-pointer desktop:hover:bg-lightBlue"
            aria-label="Show previous image"
          >
            <ChevronLeft color="#FFFFFF" />
          </button>
          <button
            className="gallery-next absolute top-1/2 -translate-y-1/2 z-10 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue desktop:hover:cursor-pointer desktop:hover:bg-lightBlue"
            aria-label="Show next image"
          >
            <ChevronRight color="#FFFFFF" />
          </button>
        </Swiper>
      </>
    );
  } else {
    return (
      <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        spaceBetween={20}
        speed={1000}
        modules={[Autoplay, Pagination]}
        className={cssClasses}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        loop
        breakpoints={{
          800: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
        }}
      >
        {data.length > 0 &&
          data[0].acf.photo_gallery.gallery[0].map((image, index) => (
            <SwiperSlide key={index} className="pb-10">
              <Image
                src={image.full_image_url}
                alt={`Arlene's Pool Services - Gallery Image ${index + 1}`}
                width={800}
                height={800}
                className="aspect-square object-cover"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    );
  }
};

export default GallerySlider;
