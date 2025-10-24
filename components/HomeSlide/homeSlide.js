"use client";
import { A11y, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./homeSlide.module.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  SlideNextIcon,
  SlidePrevIcon,
  IconArrowUpRight,
} from "../Ui/Icons/icons";
import clsx from "clsx";

function HomeSlide() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(10);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSwiperInit = (swiper) => {
    setSwiperInstance(swiper);
    setCurrentIndex(swiper.activeIndex);
    setTotalSlides(swiper.slides.length);
  };

  if (!isClient) {
    return <section className={styles.container}></section>;
  }

  return (
    <>
      <section className={clsx(styles.container)}>
        <div className={styles.header}>
          <h2>특별한 쇼핑의 시작</h2>
          <p className={styles.subtitle}>
            프리미엄 품질과 특벽한 혜택! 지금 만나보세요.
          </p>
        </div>

        <div className={styles.grid}>
          <Swiper
            key="slider-home"
            id="slider-home"
            onSwiper={handleSwiperInit}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            modules={[A11y, Autoplay, Navigation, Pagination]}
            spaceBetween={2}
            slidesPerView={1}
            // autoplay={{
            //   delay: 6000,
            //   disableOnInteraction: false,
            // }}
            loop={true}
            speed={900}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
              renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
              },
            }}
            navigation={{
              prevEl: "#custom-prev",
              nextEl: "#custom-next",
            }}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <SwiperSlide key={`slide-${index}`}>
                <div className={styles.card}>
                  <div className={styles.cardImage}>
                    <img src="/images/image_slide.png" alt="slide" />
                  </div>
                  <div className={styles.cardContent}>
                    <span className={styles.tag}>SPECIAL OFFER</span>
                    <h3 className="desktop">
                      예시로 작성된 문구이며, 실제 상품의 특징과
                    </h3>
                    <h3 className="middle">노바샵에선 무료! 입니다 </h3>
                    <h3 className="mobile">노바샵에선 무료!</h3>
                    <p className="desktop">
                      예시로 작성된 문구이며, 실제 상품의 특징과 장점을 간략히
                      소개하는 내용을 입력하면 됩니다.
                      <br />
                      예시로 작성된 문구이며, 실제 상품의 특징과 장점을 간략히
                      소개하는 내용을 입력하면 됩니다.
                    </p>
                    <p className="middle">첫 구매시 10프로 할인!</p>
                    <p className="mobile">첫 구매시 10프로 할인! </p>
                    <button>
                      더보기{" "}
                      <span>
                        <IconArrowUpRight />
                      </span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={styles.customPagination}>
            <div className="custom-pagination"></div>
          </div>
          <button
            className={`${styles.navBtn} ${styles.paginationBtn} ${styles.prevBtn}`}
            id="custom-prev"
            aria-label="Previous slide"
            disabled={currentIndex === 0}
          >
            <SlidePrevIcon />
          </button>

          <button
            className={`${styles.navBtn} ${styles.paginationBtn} ${styles.nextBtn}`}
            id="custom-next"
            aria-label="Next slide"
            disabled={currentIndex >= totalSlides - 1}
          >
            <SlideNextIcon />
          </button>
        </div>
        <div className={styles.overlayEllipse}></div>
      </section>
    </>
  );
}

export default HomeSlide;
