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
    slidesPerView: 1,
  },
  480: {
    slidesPerView: 2,
  },
  600: {
    slidesPerView: 2,
  },
  991: {
    slidesPerView: 3,
  },
  1200: {
    slidesPerView: 3,
  },
};
function AboutLastNews(props) {
  return (
    <div className="content_container">
      <div className="custom_container">
        <p className={classes.our_team_heading}>최신 뉴스</p>
        <div className={classes.our_lastnews_content}>
          <Swiper
            key={"slider_testimonial"}
            id="slider_testimonial"
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={24}
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
                title: "새로운 컬렉션 출시!",
                image: process.env.NEXT_PUBLIC_URL + "/images/lastnews1.png",
                description:
                  "프리미엄 한국 스킨케어 & 패션 신제품을 만나보세요! 신상 아이템과 한정판 제품이 지금 바로 구매 가능합니다.얼리버드 할인 기회를 놓치지 마세요!",
                link: "#",
              },
              {
                title: "올해 최대 플래시 세일 OPEN!",
                image: process.env.NEXT_PUBLIC_URL + "/images/lastnews2.png",
                description:
                  "올 시즌 최대 70% 할인을 준비하세요!\n 캘린더에 체크하고 최고의 혜택을 놓치지 마세요!",
                link: "#",
              },
              {
                title: "구매할수록 커지는 리워드 혜택!",
                image: process.env.NEXT_PUBLIC_URL + "/images/lastnews3.png",
                description:
                  "새로운 리워드 프로그램을 소개합니다!\n 구매할 때마다 포인트를 적립하고,\n할인, 무료 사은품, 특별 혜택으로 교환하세요!\n지금 가입하고 알뜰 쇼핑 시작하기!",
                link: "#",
              },
              {
                title: "새로운 컬렉션 출시!",
                image: process.env.NEXT_PUBLIC_URL + "/images/lastnews1.png",
                description:
                  "프리미엄 한국 스킨케어 & 패션 신제품을 만나보세요! 신상 아이템과 한정판 제품이 지금 바로 구매 가능합니다.얼리버드 할인 기회를 놓치지 마세요!",
                link: "#",
              },
            ].map((item, index) => (
              <SwiperSlide
                key={index}
                className={classes.silde_our_lastnews_container}
              >
                <div className={classes.our_lastnews_category_root}>
                  <div className={classes.our_lastnews_container}>
                    <div style={{ width: "100%" }}>
                      <ImageLoader
                        src={item?.image}
                        alt={item?.title}
                        width={336}
                        height={172}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h3
                      className={`${classes.top_title} ${classes.our_lastnews_title}`}
                    >
                      {item?.title}
                    </h3>
                    <p
                      className={`${classes.top_description} ${classes.our_lastnews_description}`}
                    >
                      {item?.description}
                    </p>
                    <button className={classes.our_lastnews_btn}>더보기</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="content_spacing" />
    </div>
  );
}

export default AboutLastNews;
