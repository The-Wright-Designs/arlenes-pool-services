"use client";

import Image from "next/image";

import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  cssClasses?: string;
  data: Array<{ name: string; image: number; imageUrl: string }>;
}

const MeetTheTeamSlider = ({ cssClasses, data }: Props) => {
  const arrowClasses =
    "hidden desktop:flex absolute top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-blue desktop:hover:cursor-pointer desktop:hover:bg-lightBlue [&.swiper-button-disabled]:opacity-40 [&.swiper-button-disabled]:desktop:hover:cursor-default";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous team member"
        className={classNames(arrowClasses, "team-prev left-2")}
      >
        <ChevronLeft color="#FFFFFF" />
      </button>
      <button
        type="button"
        aria-label="Next team member"
        className={classNames(arrowClasses, "team-next right-2")}
      >
        <ChevronRight color="#FFFFFF" />
      </button>
      <Swiper
        speed={1000}
        modules={[Pagination, Navigation]}
        navigation={{ prevEl: ".team-prev", nextEl: ".team-next" }}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        className={cssClasses}
        slidesPerView={"auto"}
        slidesPerGroup={1}
        spaceBetween={12}
        breakpoints={{
          425: {
            spaceBetween: 26,
          },
        }}
        style={
          {
            "--swiper-pagination-color": "#4079B7",
            "--swiper-pagination-bullet-inactive-color": "#4079B7",
            "--swiper-pagination-bullet-inactive-opacity": "0.8",
            "--swiper-pagination-bullet-size": "10px",
          } as React.CSSProperties
        }
      >
        {data
          .filter(({ imageUrl }) => imageUrl)
          .map(({ imageUrl, name }, index) => (
            <SwiperSlide
              key={index}
              className="max-w-[280px] h-auto pb-10 tablet:pb-10"
            >
              <h4 className="mb-2 text-center">{name}</h4>
              <Image
                src={imageUrl}
                alt={`${name} - Arlene's Pool Services`}
                width={280}
                height={280}
                sizes="(max-width: 600px) 100vw, 50vw"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default MeetTheTeamSlider;
