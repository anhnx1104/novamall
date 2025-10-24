"use client";
import StarRating from "../Ui/StarRating/starRating";
import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./homeReviews.module.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useIsMobile from "~/hooks/isMobile";

const reviews = [
  {
    id: 1,
    name: "dnf*****",
    date: "25.07.07",
    option: "[12pieces]",
    rating: 4,
    text: "Mauris id magna id mollis tincidunt faucibus massa enim in. Semper id neque quisque tempor turpis est in quis. Vitae vitae vel at id egestas imperdiet suspendisse mattis. Orci velit malesuada gravida enim faucibus consequat. Nisi amet arcu morbi viverra turpis a lectus. Justo id cras pellentesque faucibus pharetra.",
    highlight: "tincidunt faucibus massa enim",
    avatar: "/images/our_team2.png",
  },
  {
    id: 2,
    name: "dnf*****",
    date: "25.07.07",
    option: "[12pieces]",
    rating: 4,
    text: "Mauris id magna id mollis tincidunt faucibus massa enim in. Semper id neque quisque tempor turpis est in quis. Vitae vitae vel at id egestas imperdiet suspendisse mattis. Orci velit malesuada gravida enim faucibus consequat. Nisi amet arcu morbi viverra turpis a lectus. Justo id cras pellentesque faucibus pharetra.",
    highlight: "tincidunt faucibus massa enim",
    avatar: "/images/our_team2.png",
  },
  {
    id: 3,
    name: "dnf*****",
    date: "25.07.07",
    option: "[12pieces]",
    rating: 4,
    text: "Mauris id magna id mollis tincidunt faucibus massa enim in. Semper id neque quisque tempor turpis est in quis. Vitae vitae vel at id egestas imperdiet suspendisse mattis. Orci velit malesuada gravida enim faucibus consequat. Nisi amet arcu morbi viverra turpis a lectus. Justo id cras pellentesque faucibus pharetra.",
    highlight: "tincidunt faucibus massa enim",
    avatar: "/images/our_team2.png",
  },
  {
    id: 4,
    name: "dnf*****",
    date: "25.07.07",
    option: "[12pieces]",
    rating: 4,
    text: "Mauris id magna id mollis tincidunt faucibus massa enim in. Semper id neque quisque tempor turpis est in quis. Vitae vitae vel at id egestas imperdiet suspendisse mattis. Orci velit malesuada gravida enim faucibus consequat. Nisi amet arcu morbi viverra turpis a lectus. Justo id cras pellentesque faucibus pharetra.",
    highlight: "tincidunt faucibus massa enim",
    avatar: "/images/our_team2.png",
  },
  {
    id: 5,
    name: "dnf*****",
    date: "25.07.07",
    option: "[12pieces]",
    rating: 4,
    text: "Mauris id magna id mollis tincidunt faucibus massa enim in. Semper id neque quisque tempor turpis est in quis. Vitae vitae vel at id egestas imperdiet suspendisse mattis. Orci velit malesuada gravida enim faucibus consequat. Nisi amet arcu morbi viverra turpis a lectus. Justo id cras pellentesque faucibus pharetra.",
    highlight: "tincidunt faucibus massa enim",
    avatar: "/images/our_team2.png",
  },
];

function HomeReviews(props) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const { isMobile, isTablet } = useIsMobile();
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <section className={styles.container}></section>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>고객의 소리</h2>
        <p className={styles.subtitle}>특별상품에 대한 설명입니다</p>
        <p className={styles.desc}>
          In magna est nisi pulvinar nulla dui aliquam cras. Sem molestie enim
          id urna sem pellentesque ut eget nisl.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.overlay}></div>
        <div className={styles.slider}>
          <Swiper
            key="slider-testimonial-1"
            id="slider-testimonial"
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={isTablet ? 0 : isMobile ? 0 : 24}
            slidesPerView={isTablet ? 2.28 : isMobile ? 1 : 2.8}
            centeredSlides={isTablet || isMobile}
            autoplay={{
              delay: 6000,
            }}
            loop={true}
            speed={900}
            navigation={{
              nextEl: ".button_next4",
              prevEl: ".button_prev4",
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={`review-${review.id}`}>
                <div className={styles.card}>
                  <div className={styles.user}>
                    <img src={review.avatar} alt={review.name} />
                    <div>
                      <p className={styles.stars}>
                        <StarRating
                          rate={review.rating}
                          size={12}
                          spacing={2}
                        />
                        <span>{review.rating}</span>
                      </p>
                      <p className={styles.meta}>
                        {review.name} · {review.date} · option: {review.option}
                      </p>
                    </div>
                  </div>
                  <p className={styles.text}>
                    {review.text.split(review.highlight)[0]}
                    <span className={styles.highlight}>{review.highlight}</span>
                    {review.text.split(review.highlight)[1]}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.swiper2} style={{ width: "1380px" }}>
          <Swiper
            key="slider-testimonial-1"
            id="slider-testimonial"
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={2.8}
            autoplay={{
              delay: 6000,
            }}
            loop={true}
            speed={900}
            slidesOffsetAfter={-100}
            slidesOffsetBefore={-100}
            initialSlide={2}
            centeredSlides={true}
            navigation={{
              nextEl: ".button_next4",
              prevEl: ".button_prev4",
            }}
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review.id || index}>
                <div key={review.id} className={styles.card}>
                  <div className={styles.user}>
                    <img src={review.avatar} alt={review.name} />
                    <div>
                      <p className={styles.stars}>
                        <StarRating
                          rate={review.rating}
                          size={12}
                          spacing={2}
                        />
                        <span>{review.rating}</span>
                      </p>
                      <p className={styles.meta}>
                        {review.name} · {review.date} · option: {review.option}
                      </p>
                    </div>
                  </div>
                  <p className={styles.text}>
                    {review.text.split(review.highlight)[0]}
                    <span className={styles.highlight}>{review.highlight}</span>
                    {review.text.split(review.highlight)[1]}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default HomeReviews;
