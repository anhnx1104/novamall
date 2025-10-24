import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import PaginationCustom, { ArrowIcon } from "~/components/PaginationCustom";
import ProductItem from "~/components/ProductItem/productItem";
import { A11y, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import classes from "./reviewSection.module.css";
import StarRating, { StarIcon } from "~/components/Ui/StarRating/starRating";

const ReviewSection = () => {
  const { t } = useTranslation();
  const id = 1;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(2);
  const [totalSlides, setTotalSlides] = useState(0);
  return (
    <div>
      <div className={classes.reviewSection}>
        <div className={classes.reviewSection_title}>
          <h2>
            베스트 리뷰 <span>(150)</span>
          </h2>
        </div>
        <div className={classes.grid}>
          <div className={classes.reviewSlide}>
            <div className={classes.reviewSlideItem}>
              <div className={classes.left}>
                <div className={classes.header}>
                  <div className={classes.avatar}></div>
                  <div className={classes.info}>
                    <div className={classes.rating}>
                      <StarRating rate={5} size={15} spacing={4} />5
                    </div>
                    <div className={classes.description}>
                      <span>123****</span>
                      <span>24.12.15</span>
                      <span>
                        용량 x 연결성: 128GB x WiFi / 색상: SM-X520NLBAKOO /
                        라이트 블루
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${classes.text}`}>
                  리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부
                  내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰
                  내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부 내용이
                  잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에 보여지며
                  최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야
                  합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어
                  ,일부 내용이 잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야 합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야합니다.
                </div>
              </div>
              <div className={classes.image}>
                <img src={"/images/review_img_detail.png"} alt={"title"} />
                <span>5</span>
              </div>
            </div>
            <div className={classes.reviewSlideItem}>
              <div className={classes.left}>
                <div className={classes.header}>
                  <div className={classes.avatar}></div>
                  <div className={classes.info}>
                    <div className={classes.rating}>
                      <StarRating rate={5} size={15} spacing={4} />5
                    </div>
                    <div className={classes.description}>
                      <span>123****</span>
                      <span>24.12.15</span>
                      <span>
                        용량 x 연결성: 128GB x WiFi / 색상: SM-X520NLBAKOO /
                        라이트 블루
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${classes.text}`}>
                  리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부
                  내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰
                  내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부 내용이
                  잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에 보여지며
                  최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야
                  합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어
                  ,일부 내용이 잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야 합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야합니다.
                </div>
              </div>
              <div className={classes.image}>
                <img src={"/images/review_img_detail.png"} alt={"title"} />
                <span>5</span>
              </div>
            </div>
            <div className={classes.reviewSlideItem}>
              <div className={classes.left}>
                <div className={classes.header}>
                  <div className={classes.avatar}></div>
                  <div className={classes.info}>
                    <div className={classes.rating}>
                      <StarRating rate={5} size={15} spacing={4} />5
                    </div>
                    <div className={classes.description}>
                      <span>123****</span>
                      <span>24.12.15</span>
                      <span>
                        용량 x 연결성: 128GB x WiFi / 색상: SM-X520NLBAKOO /
                        라이트 블루
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${classes.text}`}>
                  리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부
                  내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰
                  내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부 내용이
                  잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에 보여지며
                  최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야
                  합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어
                  ,일부 내용이 잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야 합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야합니다.
                </div>
              </div>
              <div className={classes.image}>
                <img src={"/images/review_img_detail.png"} alt={"title"} />
                <span>5</span>
              </div>
            </div>
            <div className={classes.reviewSlideItem}>
              <div className={classes.left}>
                <div className={classes.header}>
                  <div className={classes.avatar}></div>
                  <div className={classes.info}>
                    <div className={classes.rating}>
                      <StarRating rate={5} size={15} spacing={4} />5
                    </div>
                    <div className={classes.description}>
                      <span>123****</span>
                      <span>24.12.15</span>
                      <span>
                        용량 x 연결성: 128GB x WiFi / 색상: SM-X520NLBAKOO /
                        라이트 블루
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${classes.text}`}>
                  리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부
                  내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰
                  내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부 내용이
                  잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에 보여지며
                  최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야
                  합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어
                  ,일부 내용이 잘릴 수 있는걸 고려해야합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야 합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                  정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야합니다.
                </div>
              </div>
              <div className={classes.image}>
                <img src={"/images/review_img_detail.png"} alt={"title"} />
                <span>5</span>
              </div>
            </div>
          </div>
          {/* Custom Pagination with Navigation */}
          <div className={classes.pagination}>
            <div className={classes.paginationPage}>
              <div className={classes.readMore}>전체보기</div>

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
      <div className={classes.reviewSetionMobile}>
        <div className={classes.reviewMobileTitle}>베스트 리뷰 150</div>
        <div className={classes.reviewMobileContent}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={classes.reviewMobileItem}>
              <img src={"/images/review_img_detail.png"} alt={"title"} />
              <div className={classes.reviewMobileInfo}>
                <div className={classes.reviewMobileRating}>
                  <StarIcon />5
                </div>
                <div className={classes.reviewMobileDescription}>
                  리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부
                  내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰 내용이 아래에
                  보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                  고려해야합니다.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ReviewSection;
