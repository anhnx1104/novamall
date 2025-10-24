import { useRouter } from "next/router";
import classes from "./relatedProducts.module.css";
import { useTranslation } from "react-i18next";
import PaginationCustom, { ArrowIcon } from "~/components/PaginationCustom";
import ProductItem from "~/components/ProductItem/productItem";
import { A11y, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

function RelatedProductSection({ products, title, id }) {
  const { t } = useTranslation();
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const product = {
    image: "/images/product_item.png",
    name: "MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L",
    oldPrice: 110002,
    newPrice: 89002,
    discount: 25,
    rating: 4.7,
    reviews: 2341,
  };
  const productList = [
    { ...product, id: 1 },
    { ...product, id: 2 },
    { ...product, id: 3 },
    { ...product, id: 4 },
    { ...product, id: 5 },
    { ...product, id: 6 },
    { ...product, id: 7 },
    { ...product, id: 8 },
    { ...product, id: 9 },
    { ...product, id: 10 },
  ];
  const router = useRouter();
  const [productSlideItem, setProductSlideItem] = useState(null);

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

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      let productGroup =
        window.innerWidth <= 460 ? 2 : window.innerWidth <= 750 ? 3.5 : 5;
      setProductSlideItem(productGroup);
      const maxSlideIndex = Math.max(
        0,
        Math.ceil(productList.length / productGroup) - 1
      );
      setMaxIndex(maxSlideIndex);
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
    const slidesPerGroup = productSlideItem || 1;

    // Calculate max index based on total slides and slides per group for pagination
    const maxSlideIndex = Math.max(0, Math.ceil(slides / slidesPerGroup) - 1);

    setTotalSlides(slides);
    setMaxIndex(maxSlideIndex);
    setCurrentIndex(Math.floor(swiper.activeIndex / slidesPerGroup));
  };

  const handleSlideChange = (swiper) => {
    const slidesPerGroup = productSlideItem || 1;
    setCurrentIndex(Math.floor(swiper.activeIndex / slidesPerGroup));
  };

  return (
    <>
      <div className={classes.relatedSection}>
        <div className={classes.relatedSection_title}>
          <h2>{title}</h2>
        </div>
        <div className={classes.grid}>
          <Swiper
            key={`slider-${id}`}
            id={`slider-${id}`}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={productSlideItem === 2 ? 12 : 0}
            slidesPerView={productSlideItem}
            slidesPerGroup={productSlideItem}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            loop={false}
            speed={900}
            navigation={{
              prevEl: `#custom-prev${id}`,
              nextEl: `#custom-next${id}`,
            }}
          >
            {productList.map((product) => (
              <SwiperSlide
                key={`product-${product.id}`}
                className={classes.swiperSlide}
              >
                <ProductItem key={product.id} product={product} size="sm" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination with Navigation */}
          <div className={classes.pagination}>
            <div className={classes.paginationPage}>
              <div className={classes.relatedSection_more}>전체보기</div>

              <div className={classes.paginationInfoPage}>
                <span>{currentIndex + 1}</span>/{maxIndex + 1}
              </div>
              <button
                id={`custom-prev${id}`}
                aria-label="Previous slide"
                className={`${classes.paginationButton} ${classes.paginationButtonPrev}`}
                disabled={currentIndex === 0}
              >
                <ArrowIcon />
              </button>
              <button
                id={`custom-next${id}`}
                aria-label="Next slide"
                className={`${classes.paginationButton} ${classes.paginationButtonNext}`}
                disabled={currentIndex >= maxIndex}
              >
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RelatedProductSection;
const ArrowMoreIcon = () => (
  <svg
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 6L1.0997 12L0 10.8817L4.8006 6L0 1.11828L1.0997 0L7 6Z"
      fill="#949494"
    />
  </svg>
);
