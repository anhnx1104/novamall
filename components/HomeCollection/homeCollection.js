"use client";
import StarRating from "../Ui/StarRating/starRating";
import { A11y, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./homeCollection.module.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ProductItem from "../ProductItem/productItem";
import clsx from "clsx";

function HomeCollection(props) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [isMobile, setIsMobile] = useState(false);
  const [productBasic, setProductBasic] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
      setProductBasic(window.innerWidth <= 749);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSwiperInit = (swiper) => {
    setSwiperInstance(swiper);
    const slides = swiper.slides.length;
    const slidesPerView = swiper.params.slidesPerView || 1;
    const maxSlideIndex = Math.max(0, slides - slidesPerView);

    setTotalSlides(slides);
    setMaxIndex(maxSlideIndex);
    setCurrentIndex(swiper.activeIndex);
    updateProgress(swiper);
  };

  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.activeIndex);
    updateProgress(swiper);
  };

  const updateProgress = (swiper) => {
    if (swiper && swiper.slides) {
      const totalSlides = swiper.slides.length;
      const slidesPerView = swiper.params.slidesPerView || 1;
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      const currentIndex = Math.min(swiper.activeIndex, maxIndex);
      const progress =
        totalSlides <= slidesPerView ? 100 : (currentIndex / maxIndex) * 100;
      setProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  if (!isClient) {
    return <section className={styles.container}></section>;
  }

  return (
    <>
      <section
        className={clsx(
          styles.container,
          props.mode == "light" ? styles.light : ""
        )}
      >
        <div className={styles.header}>
          <h2>
            <span>{props.highlight}</span>
            {props.title}
          </h2>
          {props.subtitle && (
            <p className={styles.subtitle}>{props.subtitle}</p>
          )}
        </div>

        <div className={styles.grid}>
          <Swiper
            key="slider-collection-1"
            id="slider-collection"
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={isMobile ? 3 : 4}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            loop={false}
            speed={900}
            navigation={{
              prevEl: "#custom-prev",
              nextEl: "#custom-next",
            }}
          >
            {props.products.map((product) => (
              <SwiperSlide key={`product-${product.id}`}>
                <ProductItem
                  product={product}
                  size={isMobile ? "sm" : "lg"}
                  mode={props.mode == "light" ? "light" : "dark"}
                  hideCart={true}
                  basic={productBasic}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination with Navigation */}
          <div className={styles.paginationContainer}>
            <button
              className={`${styles.navBtn} ${styles.paginationBtn}`}
              id="custom-prev"
              aria-label="Previous slide"
              disabled={currentIndex === 0}
            >
              ←
            </button>

            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress == 0 ? 10 : progress}%` }}
                ></div>
              </div>
            </div>

            <button
              className={`${styles.navBtn} ${styles.paginationBtn}`}
              id="custom-next"
              aria-label="Next slide"
              disabled={currentIndex >= maxIndex}
            >
              →
            </button>
          </div>
        </div>
      </section>
      {props.title === "추천 상품 보기" && (
        <div style={{ backgroundColor: "#fff" }}>
          <div className={styles.bottomBg}></div>
          <div className={styles.bottomOverlay}></div>
        </div>
      )}
    </>
  );
}

export default HomeCollection;
