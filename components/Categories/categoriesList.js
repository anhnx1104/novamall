import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import Category from "./categories";
import c from "./category.module.css";
import { useTranslation } from "react-i18next";

const breakpointNewArrival = {
  320: {
    slidesPerView: 4,
  },
  480: {
    slidesPerView: 4,
  },
  749: {
    slidesPerView: 6,
  },
  991: {
    slidesPerView: 8,
  },
  1200: {
    slidesPerView: 8,
  },
};

function CategoryList(props) {
  const { t } = useTranslation();

  if (!props.categoryList || !props.categoryList.length) {
    return null;
  }

  return (
    <div className={c.category_container}>
      <div className={c.overlay}></div>
      <div className={c.root_container}>
        <Swiper
          modules={[A11y, Autoplay, Navigation]}
          breakpoints={breakpointNewArrival}
          className={`_feature_slider ${c.root_container}`}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: true,
          }}
          initialSlide={1}
          loop={false}
          speed={900}
          navigation={{
            nextEl: ".button_next",
            prevEl: ".button_prev",
          }}
        >
          {/* {props.categoryList &&
            props.categoryList.map((category, index) => (
              <SwiperSlide key={category._id}>
                <Category
                  name={category.name}
                  slug={category.slug}
                  img={category.icon[0]?.url}
                />
              </SwiperSlide>
            ))} */}
          {Array.from({ length: 12 }).map((_, index) => (
            <SwiperSlide key={index}>
              <Category
                name={"Bathroom"}
                slug={"category" + index}
                img={"/images/category.png"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default CategoryList;
