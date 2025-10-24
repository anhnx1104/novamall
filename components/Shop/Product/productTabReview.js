"use client";

import StarRating from "~/components/Ui/StarRating/starRating";
import styles from "./productTabReview.module.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IconCheck } from "~/components/Layout/Client/sidebarFilterMobile";
import PaginationCustom from "~/components/PaginationCustom";
import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "~/components/Profile/reviewsWritten";
import { StarRatingIcon } from "~/pages/product/[name]";

export default function ProductTabReview() {
  const { t } = useTranslation();

  const [activeFilter, setActiveFilter] = useState("최신순");
  const [activeFilter2, setActiveFilter2] = useState("모든 리뷰");
  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleReadMore = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h2>{t("상품 리뷰")}</h2>
        <h2 className={styles.headerMobile}>상품 리뷰 1,812</h2>
      </div>
      <div className={styles.analysis}>
        <div className={styles.analysisItem}>
          <p className={styles.analysisItemTitle}>총 평점</p>
          <div className={styles.analysisItemContent}>
            <div className={styles.analysisItemTop}>
              <StarRating size={28} spacing={4} rate={5} />
              <span className={styles.ratingText}>최근 6개월 4.99</span>
            </div>
            <div className={styles.analysisItemBottom}>
              <p className={styles.analysisText}>
                4.88 <span>/5</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.analysisItem}>
          <p className={styles.analysisItemTitle}>전체 리뷰수</p>
          <div className={styles.analysisItemContent}>
            <div className={styles.analysisItemTop}>
              <IconHeart />
            </div>
            <div className={styles.analysisItemBottom}>
              <p className={styles.analysisText}>14</p>
            </div>
          </div>
        </div>
        <div className={styles.analysisItem}>
          <p className={styles.analysisItemTitle}>평점 비율</p>
          <div className={styles.analysisItemContent}>
            <div className={styles.bars}>
              {[
                { score: 5, value: 11, max: 20 },
                { score: 4, value: 4, max: 20 },
                { score: 3, value: 2, max: 20 },
                { score: 2, value: 3, max: 20 },
                { score: 1, value: 2, max: 20 },
              ].map((item, idx) => {
                const heightPercent = (item.value / item.max) * 100;
                return (
                  <div className={styles.barWrapper} key={idx}>
                    <div className={styles.barContainer}>
                      <div
                        className={
                          styles.bar + " " + (idx === 0 ? styles.barActive : "")
                        }
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      {item.value > 0 && idx === 0 && (
                        <>
                          <span className={styles.tooltip}>{item.value}</span>
                          <span className={styles.tooltipPolygon}>
                            <svg
                              width="4"
                              height="4"
                              viewBox="0 0 4 4"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.99976 3.71484L3.73181 0.714844H0.267705L1.99976 3.71484Z"
                                fill="#9945FF"
                              />
                            </svg>
                          </span>
                        </>
                      )}
                    </div>
                    <span className={styles.label}>{item.score}점</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Analysis Mobile */}
      <div className={styles.analysisMobile}>
        <div className={styles.analysisMobileRating}>
          <span className={styles.analysisMobileRatingStar}>
            <StarRatingIcon />
          </span>
          <span className={styles.analysisMobileRatingPoint}>4.93</span>
          <span className={styles.analysisMobileRatingText}>
            (최근 6개월 4.99)
          </span>
        </div>
        <div className={styles.analysisMobileBar}>
          <p className={styles.analysisMobileBarTitle}>평점 비율</p>
          <div className={styles.analysisMobileBarContent}>
            {[
              { label: "5점", count: 2932, percent: 70, active: true },
              { label: "4점", count: 2932, percent: 50, active: false },
              { label: "3점", count: 3125, percent: 60, active: false },
              { label: "2점", count: 1567, percent: 30, active: false },
              { label: "1점", count: 4210, percent: 80, active: false },
            ].map((item) => (
              <div
                className={
                  styles.row + " " + (item.active ? styles.active : "")
                }
                key={item.label}
              >
                <div className={styles.labelWrapper}>
                  <span>{item.label}</span>{" "}
                  <span>{item.count.toLocaleString()}건 </span>{" "}
                </div>
                <div className={styles.bar}>
                  <div
                    className={styles.fill}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Review list */}
      <div className={styles.reviewList}>
        <div className={styles.reviewListTitle}>리뷰 14건</div>
        <div className={styles.filters}>
          <div className={styles.filterRight}>
            <div
              className={`${styles.filterRightItem} ${
                activeFilter === "최신순" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter("최신순")}
            >
              {activeFilter === "최신순" && <IconCheck />}
              <span>최신순</span>
            </div>
            <div className={styles.filterDivider}></div>
            <div
              className={`${styles.filterRightItem} ${
                activeFilter === "평점 높은순" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter("평점 높은순")}
            >
              {activeFilter === "평점 높은순" && <IconCheck />}
              <span>평점 높은순</span>
            </div>
            <div className={styles.filterDivider}></div>
            <div
              className={`${styles.filterRightItem} ${
                activeFilter === "낮은순" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter("낮은순")}
            >
              {activeFilter === "낮은순" && <IconCheck />}
              <span>낮은순</span>
            </div>
          </div>
          <div className={styles.filterRight}>
            <div
              className={`${styles.filterRightItem} ${
                activeFilter2 === "모든 리뷰" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter2("모든 리뷰")}
            >
              {activeFilter2 === "모든 리뷰"}
              <span>모든 리뷰</span>
            </div>
            <div className={styles.filterDivider}></div>
            <div
              className={`${styles.filterRightItem} ${
                activeFilter2 === "사진 및 동영상 포함" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter2("사진 및 동영상 포함")}
            >
              {activeFilter2 === "사진 및 동영상 포함"}
              <span>사진 및 동영상 포함</span>
            </div>
          </div>
        </div>
        <div className={styles.itemsContainer}>
          {Array.from({ length: 5 }).map((item, idx) => (
            <div className={styles.reviewSlideItem} key={idx}>
              <div className={styles.left}>
                <div className={styles.headerReview}>
                  <div className={styles.avatar}></div>
                  <div className={styles.info}>
                    <div className={styles.rating}>
                      <StarRating rate={5} size={15} spacing={4} />5
                    </div>
                    <div className={styles.description}>
                      <span>123****</span>
                      <span>24.12.15</span>
                      <span>
                        용량 x 연결성: 128GB x WiFi / 색상: SM-X520NLBAKOO /
                        라이트 블루
                      </span>
                    </div>
                    <div className={styles.descriptionMobile}>
                      <p>
                        <span>123****</span>
                        <span>24.12.15</span>
                      </p>
                      <p>
                        용량 x 연결성: 128GB x WiFi / 색상: SM-X520NLBAKOO /
                        라이트 블루
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${styles.text} ${
                    expandedReviews[idx] ? styles.expanded : ""
                  }`}
                >
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
                <div
                  className={styles.readMore}
                  onClick={() => toggleReadMore(idx)}
                >
                  <span>{expandedReviews[idx] ? "접기" : "더보기"}</span>
                  {expandedReviews[idx] ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div>
              </div>
              <div className={styles.image}>
                <img src={"/images/review_img_detail.png"} alt={"title"} />
                <span>5</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          <PaginationCustom />
        </div>
      </div>
    </div>
  );
}

const IconHeart = () => (
  <svg
    width="52"
    height="53"
    viewBox="0 0 52 53"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.5296 45.0711L28.3551 47.0555C27.3082 48.8241 24.693 48.8241 23.6461 47.0555L22.4716 45.0711C21.5606 43.532 21.105 42.7624 20.3734 42.3368C19.6417 41.9113 18.7205 41.8954 16.8781 41.8636C14.1581 41.8168 12.4522 41.6501 11.0216 41.0575C8.36711 39.958 6.25814 37.849 5.15862 35.1946C4.33398 33.2037 4.33398 30.6799 4.33398 25.6322V23.4655C4.33398 16.3731 4.33398 12.8268 5.93038 10.2218C6.82365 8.76408 8.04923 7.5385 9.50692 6.64523C12.112 5.04883 15.6582 5.04883 22.7507 5.04883H29.2507C36.3431 5.04883 39.8893 5.04883 42.4944 6.64523C43.9521 7.5385 45.1777 8.76408 46.0709 10.2218C47.6673 12.8268 47.6673 16.3731 47.6673 23.4655V25.6322C47.6673 30.6799 47.6673 33.2037 46.8427 35.1946C45.7432 37.849 43.6342 39.958 40.9797 41.0575C39.5491 41.6501 37.8431 41.8168 35.1231 41.8636C33.2807 41.8954 32.3595 41.9113 31.6278 42.3368C30.8962 42.7624 30.4407 43.532 29.5296 45.0711Z"
      fill="#DDDDDD"
    />
    <path
      d="M16.25 21.7629C16.25 25.5601 20.9372 29.5968 23.8118 31.7154C24.7958 32.4406 25.2878 32.8032 26 32.8032C26.7122 32.8032 27.2042 32.4406 28.1882 31.7154C31.0629 29.5968 35.75 25.5602 35.75 21.7628C35.75 15.9623 30.3873 13.7967 26 18.2775C21.6127 13.7967 16.25 15.9623 16.25 21.7629Z"
      fill="#F8F9FD"
    />
  </svg>
);
