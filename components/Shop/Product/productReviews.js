import { Eye, Repeat, SuitHeart } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ImageLoader from "~/components/Image";
import ReviewCount from "~/components/Review/count";
import { postData, stockInfo } from "~/lib/clientFunctions";
import { updateComparelist, updateWishlist } from "~/redux/cart.slice";
import React, { useEffect, useState } from "react";
import { Filter } from "@styled-icons/bootstrap/Filter";
import { XLg } from "@styled-icons/bootstrap";
import AccordionSidebar from "~/components/Ui/AccordionSidebar";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchData } from "~/lib/clientFunctions";

import c from "./productReviews.module.css";
import { useTranslation } from "react-i18next";
import RatingFilter from "../Sidebar/ratingFilter";
import PaginationCustom from "~/components/PaginationCustom";

const MediaModal = ({ media, onClose }) => {
  if (!media) return null;

  const isImage = media.type.startsWith("image");
  const isVideo = media.type.startsWith("video");

  return (
    <div className={c.modalOverlay} onClick={onClose}>
      <div className={c.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={c.closeButton} onClick={onClose}>
          <XLg width={24} height={24} color="black" />
        </button>
        <div
          style={{
            padding: "20px",
          }}
        >
          {" "}
          {isImage ? (
            <ImageLoader
              src={media.url}
              alt="review image"
              width={800}
              height={600}
              className={c.modalMedia}
            />
          ) : isVideo ? (
            <video src={media.url} controls className={c.modalMedia} autoPlay />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ProductReviews = ({ slug }) => {
  const stars = [5, 4, 3, 2, 1];
  const topic = [
    "제품 품질",
    "판매자 서비스",
    "제품 가격",
    "배송",
    "배송 설명과 일치",
  ];
  const [filterReview, setFilterReview] = useState(0);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);
  const { t } = useTranslation();

  // Build the API URL with filters
  const buildReviewUrl = () => {
    const params = new URLSearchParams();
    params.append("slug", slug);

    if (filterReview === 1) {
      params.append("hasMedia", "true");
    } else if (filterReview === 2) {
      params.append("hasComment", "true");
    }

    if (selectedStars.length > 0) {
      selectedStars.forEach((rating) => {
        params.append("rating", rating);
      });
    }

    return `/api/review/list?${params.toString()}`;
  };

  // Fetch reviews using useSWR
  const { data: reviewData, error: reviewError } = useSWR(
    slug ? buildReviewUrl() : null,
    fetchData
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const position = window.pageYOffset;
    const width = window.innerWidth;
    if (width < 992) {
      setHideTopBar(true);
    } else if (position > 110) {
      setHideTopBar(true);
    } else {
      setHideTopBar(false);
    }
  };

  const toggleFilter = () => setSidebarOpen(!sidebarOpen);

  const handleSelectStar = (star) => {
    setSelectedStars((prevSelected) => {
      let newSelection;
      if (prevSelected.includes(star)) {
        newSelection = prevSelected.filter((s) => s !== star);
      } else {
        newSelection = [...prevSelected, star];
      }
      return newSelection;
    });
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopics((prevSelected) => {
      let newSelection;
      if (prevSelected.includes(topic)) {
        newSelection = prevSelected.filter((s) => s !== topic);
      } else {
        newSelection = [...prevSelected, topic];
      }
      return newSelection;
    });
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
  };

  if (reviewError) {
    toast.error("리뷰를 가져오는 중 오류가 발생했습니다.");
    return <div>Error loading reviews</div>;
  }

  return (
    <div className="custom_container">
      <div className={c.productReviews}>
        <div className={c.sidebarContent}>
          {/* Sidebar Button */}
          <div
            className={`${c.filter_btn} ${sidebarOpen ? c.b_left : ""}`}
            onClick={toggleFilter}
          >
            <Filter width={33} height={33} />
            <span>{t("filter")}</span>
          </div>
          {/* Sidebar */}
          <div className={`${c.header} ${sidebarOpen ? c.s_left : ""}`}>
            <h4>{t("리뷰 필터")}</h4>
            <XLg width={25} height={25} onClick={toggleFilter} />
          </div>
          <div
            className={`${c.sidebar} ${sidebarOpen ? c.s_left : ""} ${
              hideTopBar ? c.sidebar_top_scroll : c.sidebar_top_normal
            }`}
          >
            <div className={c.sidebar_label}>
              <label>{t("리뷰 필터")}</label>
            </div>

            {/* Review */}
            <AccordionSidebar title={t("점수")} dashed={true} state={false}>
              <div className={c.star_container}>
                {stars.map((star) => (
                  <div
                    key={star}
                    className={`${c.item} ${
                      selectedStars.includes(star) ? c.selected : ""
                    }`}
                    onClick={() => handleSelectStar(star)}
                  >
                    <div className={c.starBox}>
                      <svg
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill={"#FFAA00"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.00003 12.3959L4.5417 14.4792C4.38892 14.5765 4.2292 14.6181 4.06253 14.6042C3.89586 14.5904 3.75003 14.5348 3.62503 14.4376C3.50003 14.3404 3.40281 14.219 3.33336 14.0734C3.26392 13.9279 3.25003 13.7645 3.2917 13.5834L4.20836 9.64592L1.14586 7.00008C1.00697 6.87508 0.920308 6.73258 0.885863 6.57258C0.851419 6.41258 0.861697 6.25647 0.916697 6.10425C0.971697 5.95203 1.05503 5.82703 1.1667 5.72925C1.27836 5.63147 1.43114 5.56897 1.62503 5.54175L5.6667 5.18758L7.2292 1.47925C7.29864 1.31258 7.40642 1.18758 7.55253 1.10425C7.69864 1.02091 7.84781 0.979248 8.00003 0.979248C8.15225 0.979248 8.30142 1.02091 8.44753 1.10425C8.59364 1.18758 8.70142 1.31258 8.77086 1.47925L10.3334 5.18758L14.375 5.54175C14.5695 5.56953 14.7223 5.63203 14.8334 5.72925C14.9445 5.82647 15.0278 5.95147 15.0834 6.10425C15.1389 6.25703 15.1495 6.41341 15.115 6.57341C15.0806 6.73341 14.9936 6.87564 14.8542 7.00008L11.7917 9.64592L12.7084 13.5834C12.75 13.764 12.7361 13.9273 12.6667 14.0734C12.5973 14.2195 12.5 14.3409 12.375 14.4376C12.25 14.5342 12.1042 14.5898 11.9375 14.6042C11.7709 14.6187 11.6111 14.577 11.4584 14.4792L8.00003 12.3959Z" />
                      </svg>
                      {star}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSidebar>
          </div>
        </div>
        <div className={c.reviewsContent}>
          <p
            style={{
              fontWeight: "600",
              fontSize: "20px",
            }}
          >
            리뷰 목록
          </p>
          <div className={c.reviewsTab}>
            <ul>
              <li
                className={filterReview === 0 ? c.active : ""}
                onClick={() => {
                  setFilterReview(0);
                }}
              >
                모든 리뷰
              </li>
              <li
                className={filterReview === 1 ? c.active : ""}
                onClick={() => {
                  setFilterReview(1);
                }}
              >
                사진 및 동영상 포함
              </li>

              <li
                className={filterReview === 2 ? c.active : ""}
                onClick={() => {
                  setFilterReview(2);
                }}
              >
                설명 포함
              </li>
            </ul>
          </div>
          {!reviewData ? (
            <div>로딩 중...</div>
          ) : (
            <div className={c.reviews}>
              {reviewData.data.map((review, index) => (
                <div key={index} className={c.reviewItem}>
                  {review.media && review.media.length > 0 && (
                    <div className={c.reviewThumbnails}>
                      {review.media.map((media, mediaIndex) => {
                        const isImage = media.type.startsWith("image");
                        const isVideo = media.type.startsWith("video");

                        return (
                          <div
                            key={mediaIndex}
                            className={c.reviewThumbnail}
                            onClick={() => handleMediaClick(media)}
                          >
                            {isImage ? (
                              <ImageLoader
                                src={media.url}
                                alt="review image"
                                width={92}
                                height={92}
                                className={c.thumbnailImage}
                              />
                            ) : isVideo ? (
                              <div className={c.thumbnailVideo}>
                                <video
                                  src={media.url}
                                  width={92}
                                  height={92}
                                  className={c.thumbnailVideo}
                                />
                                <div className={c.playIcon}>
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8 5.14V19.14L19 12.14L8 5.14Z"
                                      fill="white"
                                    />
                                  </svg>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className={c.reviewStar}>
                    {Array.from({ length: review.rating }, (_, i) => (
                      <svg
                        key={i}
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill={"#FFAA00"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.00003 12.3959L4.5417 14.4792C4.38892 14.5765 4.2292 14.6181 4.06253 14.6042C3.89586 14.5904 3.75003 14.5348 3.62503 14.4376C3.50003 14.3404 3.40281 14.219 3.33336 14.0734C3.26392 13.9279 3.25003 13.7645 3.2917 13.5834L4.20836 9.64592L1.14586 7.00008C1.00697 6.87508 0.920308 6.73258 0.885863 6.57258C0.851419 6.41258 0.861697 6.25647 0.916697 6.10425C0.971697 5.95203 1.05503 5.82703 1.1667 5.72925C1.27836 5.63147 1.43114 5.56897 1.62503 5.54175L5.6667 5.18758L7.2292 1.47925C7.29864 1.31258 7.40642 1.18758 7.55253 1.10425C7.69864 1.02091 7.84781 0.979248 8.00003 0.979248C8.15225 0.979248 8.30142 1.02091 8.44753 1.10425C8.59364 1.18758 8.70142 1.31258 8.77086 1.47925L10.3334 5.18758L14.375 5.54175C14.5695 5.56953 14.7223 5.63203 14.8334 5.72925C14.9445 5.82647 15.0278 5.95147 15.0834 6.10425C15.1389 6.25703 15.1495 6.41341 15.115 6.57341C15.0806 6.73341 14.9936 6.87564 14.8542 7.00008L11.7917 9.64592L12.7084 13.5834C12.75 13.764 12.7361 13.9273 12.6667 14.0734C12.5973 14.2195 12.5 14.3409 12.375 14.4376C12.25 14.5342 12.1042 14.5898 11.9375 14.6042C11.7709 14.6187 11.6111 14.577 11.4584 14.4792L8.00003 12.3959Z" />
                      </svg>
                    ))}
                  </div>
                  <div className={c.reviewTitle}>
                    <h4>{review.comment}</h4>
                    <span>
                      {new Date(review.date).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className={c.reviewBottom}>
                    <div className={c.reviewUser}>
                      <p>{review.userName}</p>
                    </div>
                    {/* <div className={c.reviewAction}>
                      <button>
                        <svg
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.89014 18.49V8.32998C8.89014 7.92998 9.01014 7.53998 9.23014 7.20998L11.9601 3.14998C12.3901 2.49998 13.4601 2.03998 14.3701 2.37998C15.3501 2.70998 16.0001 3.80997 15.7901 4.78997L15.2701 8.05998C15.2301 8.35998 15.3101 8.62998 15.4801 8.83998C15.6501 9.02998 15.9001 9.14997 16.1701 9.14997H20.2801C21.0701 9.14997 21.7501 9.46997 22.1501 10.03C22.5301 10.57 22.6001 11.27 22.3501 11.98L19.8901 19.47C19.5801 20.71 18.2301 21.72 16.8901 21.72H12.9901C12.3201 21.72 11.3801 21.49 10.9501 21.06L9.67014 20.07C9.18014 19.7 8.89014 19.11 8.89014 18.49Z"
                            fill="#141414"
                          />
                          <path
                            d="M5.71 6.37988H4.68C3.13 6.37988 2.5 6.97988 2.5 8.45988V18.5199C2.5 19.9999 3.13 20.5999 4.68 20.5999H5.71C7.26 20.5999 7.89 19.9999 7.89 18.5199V8.45988C7.89 6.97988 7.26 6.37988 5.71 6.37988Z"
                            fill="#141414"
                          />
                        </svg>
                        128
                      </button>
                      <button>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_163_9290)">
                            <path
                              d="M7.47998 5.65003L10.58 3.25003C10.98 2.85003 11.88 2.65003 12.48 2.65003H16.28C17.48 2.65003 18.78 3.55003 19.08 4.75003L21.48 12.05C21.98 13.45 21.08 14.65 19.58 14.65H15.58C14.98 14.65 14.48 15.15 14.58 15.85L15.08 19.05C15.28 19.95 14.68 20.95 13.78 21.25C12.98 21.55 11.98 21.15 11.58 20.55L7.47998 14.45"
                              stroke="#0B0F0E"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                            />
                            <path
                              d="M2.37988 5.6501V15.4501C2.37988 16.8501 2.97988 17.3501 4.37988 17.3501H5.37988C6.77988 17.3501 7.37988 16.8501 7.37988 15.4501V5.6501C7.37988 4.2501 6.77988 3.7501 5.37988 3.7501H4.37988C2.97988 3.7501 2.37988 4.2501 2.37988 5.6501Z"
                              stroke="#0B0F0E"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_163_9290">
                              <rect
                                width="24"
                                height="24"
                                fill="white"
                                transform="matrix(1 0 0 -1 0 24)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* <PaginationCustom /> */}
        </div>
      </div>
      {selectedMedia && (
        <MediaModal media={selectedMedia} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProductReviews;
