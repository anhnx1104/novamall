import Link from "next/dist/client/link";
import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageLoader from "../Image";
import classes from "./about.module.css";
const breakpointNewArrival = {
  360: {
    slidesPerView: 1.5,
  },
  480: {
    slidesPerView: 1.5,
  },
  600: {
    slidesPerView: 1.5,
  },
  991: {
    slidesPerView: 2,
  },
  1200: {
    slidesPerView: 3,
  },
};
function AboutTop(props) {
  return (
    <div className="content_container">
      <div className="custom_container">
        <div className={classes.top_content}>
          {" "}
          <Swiper
            className={classes.top_swipper}
            key={"slider_testimonial"}
            id="slider_testimonial"
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={40}
            slidesPerView="auto"
            breakpoints={breakpointNewArrival}
            // className={`_testimonial_slider ${c.root_container}`}
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
              nextEl: ".button_next4",
              prevEl: ".button_prev4",
            }}
          >
            {[
              {
                title: "빠르고 안전한 배송",
                icon: process.env.NEXT_PUBLIC_URL + "/images/about_icon1.png",
                description:
                  "주문하신 상품을 신뢰할 수 있는 배송 파트너를 통해 빠르고 안전하게 받아보세요! 당일 배송, 익스프레스 배송, 그리고 무료 배송 옵션까지 제공합니다.",
              },
              {
                title: "100% 정품 & 신뢰할 수 있는 브랜드",
                icon: process.env.NEXT_PUBLIC_URL + "/images/about_icon2.png",
                description:
                  "안심하고 쇼핑하세요! 국내외 최고 브랜드의 100% 정품과 오리지널 제품만을 제공하며, 최상의 품질과 신뢰성을 보장합니다.",
              },
              {
                title: "24/7 고객 지원",
                icon: process.env.NEXT_PUBLIC_URL + "/images/about_icon3.png",
                description:
                  "도움이 필요하신가요? 전문 상담팀이 전 세계 24시간 연중무휴로 빠른 응답과 전문가 가이드를 통해 주문, 반품, 문의 사항을 도와드립니다.",
              },
            ].map((item, index) => (
              <SwiperSlide key={index} className={classes.silde_container}>
                <Link href={`#`}>
                  <div className={classes.category_root}>
                    <div className={classes.top_container}>
                      <div className={classes.top}>
                        <div className={`${classes.top_icon} `}>
                          <ImageLoader
                            src={item?.icon}
                            alt={item?.title}
                            width={96}
                            height={96}
                            style={{
                              width: "96px",
                              height: "96px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <h3 className={classes.top_title}>{item?.title}</h3>
                        <p className={classes.top_description}>
                          {item?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="content_spacing" />

      <div className={classes.bottom}>
        <div className="custom_container">
          <div className={classes.bottom_content}>
            <div className={classes.bottom_text}>
              <h3 className={classes.bottom_title}>
                쇼핑몰에서 만날 수 있는 혜택
              </h3>
              <p className={classes.bottom_description}>
                [Your E-Commerce Brand Name]에서는 편리하고 원활한 쇼핑 경험을
                제공합니다.전자제품, 패션, 뷰티, 생활용품, 식료품 등 15개 이상의
                다양한 제품 카테고리를 만나보세요.
                <br />
                <br />✅ 100% 정품 보장 – 국내외 최고의 브랜드 제품을 제공하여
                최고의 품질을 보장합니다.
                <br />✅ 독점 할인 & 안전한 결제 옵션 – 빠르고 신뢰할 수 있는
                배송 서비스를 제공합니다.
                <br />✅ 간편한 주문 추적 & 무상 반품 – 현금 결제 및 디지털 지갑
                등 다양한 결제 방법 지원.
                <br />✅ 24/7 고객 지원 – 언제든지 문의하실 수 있도록 연중무휴
                고객 서비스를 운영합니다.
                <br />✅ 개인 맞춤 추천 & 로열티 리워드 – 최신 트렌드를 반영한
                쇼핑 혜택 제공. 일상 필수품부터 고급 제품까지, 원하는 모든 것을
                한곳에서 쇼핑하세요!믿을 수 있는 쇼핑과 최고의 혜택을 지금 바로
                만나보세요. 🛍️✨
              </p>
            </div>
            <div className={classes.bottom_image}>
              <ImageLoader
                src={process.env.NEXT_PUBLIC_URL + "/images/about_image2.png"}
                alt={""}
                width={550}
                height={96}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutTop;
