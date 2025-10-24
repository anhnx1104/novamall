import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import Brand from "./brand";
import c from "./homeBrandLove.module.css";
import { ArrowUpRightCircleFill } from "@styled-icons/bootstrap";
import { ArrowUpLeftCircle } from "@styled-icons/bootstrap";
import { useTranslation } from "react-i18next";
const Heading = dynamic(() => import("~/components/Heading/heading"));

const breakpointNewArrival = {
  360: {
    slidesPerView: 2,
  },
  480: {
    slidesPerView: 3,
  },
  600: {
    slidesPerView: 4,
  },
  991: {
    slidesPerView: 5,
  },
  1200: {
    slidesPerView: 7,
  },
};

function HomeBrandLove(props) {
  const { t } = useTranslation();

  if (!props.brandsLove || !props.brandsLove.length) {
    return null;
  }

  return (
    <div className={c.content_container}>
      <div className="custom_container">
        <Heading title={t(props.title)} subtitle={t(props.subtitle)} />
        <div className={c.root_container}>
          <div className={`button_prev ${c.button_prev}`}>
            <div
              style={{
                background: "none",
                border: "none",
                margin: 0,
                padding: 0,
                rotate: "180deg",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_163_10640)">
                  <rect width="24" height="24" rx="12" fill="#F9F2FD" />
                  <path
                    d="M9.5 16.5L14.5 11.5L9.5 6.5"
                    stroke="#4D06C7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <rect
                  x="0.25"
                  y="0.25"
                  width="23.5"
                  height="23.5"
                  rx="11.75"
                  stroke="#6D2AB5"
                  strokeOpacity="0.2"
                  strokeWidth="0.5"
                />
                <defs>
                  <clipPath id="clip0_163_10640">
                    <rect width="24" height="24" rx="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className={`button_next ${c.button_next}`}>
            <div
              style={{
                background: "none",
                border: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_163_10640)">
                  <rect width="24" height="24" rx="12" fill="#F9F2FD" />
                  <path
                    d="M9.5 16.5L14.5 11.5L9.5 6.5"
                    stroke="#4D06C7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <rect
                  x="0.25"
                  y="0.25"
                  width="23.5"
                  height="23.5"
                  rx="11.75"
                  stroke="#6D2AB5"
                  strokeOpacity="0.2"
                  strokeWidth="0.5"
                />
                <defs>
                  <clipPath id="clip0_163_10640">
                    <rect width="24" height="24" rx="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <Swiper
            key={"slider_brand_love"}
            id="brand_love"
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView="auto"
            breakpoints={breakpointNewArrival}
            // className={`_feature_slider ${c.root_container}`}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            loop={false}
            centeredSlides={false}
            centerInsufficientSlides={true}
            speed={900}
            navigation={{
              nextEl: ".button_next",
              prevEl: ".button_prev",
            }}
          >
            {props.brandsLove &&
              props.brandsLove.map((category, index) => (
                <SwiperSlide key={category._id}>
                  <Brand
                    name={category.name}
                    slug={category.slug}
                    img={category.image[0]?.url}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default HomeBrandLove;
