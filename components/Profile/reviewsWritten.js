import { Trash3 } from "@styled-icons/bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData } from "~/lib/clientFunctions";
import Spinner from "../Ui/Spinner";
import PaginationCustom from "../PaginationCustom";
import c from "./reviewsWritten.module.css";
import { TruckShippingIcon } from "../Ui/Icons/icons";
import StarRating from "../Ui/StarRating/starRating";

const ManageReviewsWritten = (props) => {
  const url = `/api/profile?id=${props.id}&scope=review`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const router = useRouter();
  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleReadMore = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };
  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <div className={c.titleContainer}>
            <h3 className={c.titlePage}>나의 리뷰</h3>
          </div>
          <div className={c.tabsContainer}>
            <span
              className={c.tab}
              onClick={() => router.push("/profile/reviews/write")}
            >
              리뷰 작성
            </span>
            <span
              className={c.tab + " " + c.active}
              onClick={() => router.push("/profile/reviews/written")}
            >
              작성한 리뷰
            </span>
          </div>
          <div className={c.listTitle}>
            <p>
              작성한 리뷰
              <span style={{ paddingLeft: "4px" }}>3</span>
            </p>
            <button className={c.deleteAllButton} onClick={() => {}}>
              전체 삭제
            </button>
          </div>
          <div className={c.itemsContainer}>
            {Array.from({ length: 2 }).map((item, idx) => (
              <div className={c.item} key={item + idx}>
                <div className={c.review_title}>
                  <div className={c.left}>
                    <div className={c.productImage}>
                      <img
                        src={"/images/review_img.png"}
                        alt={"title"}
                        width={42}
                        height={42}
                      />
                    </div>
                    <div className={c.info}>
                      <p className={c.title}>
                        삼성전자 갤럭시탭 S10 FE WiFi 전용 128GB 그레이 영상용
                        학습용 SM-X520
                      </p>
                      <div className={c.priceBox}>
                        <p className={c.truck}>
                          <TruckShippingIcon />
                          <span>2025.12.13 배송</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={c.right}>
                    <button>삭제</button>
                    <button>수정</button>
                  </div>
                </div>
                <div className={c.review_content}>
                  <div className={c.rating}>
                    <StarRating rate={5} size={15} spacing={4} />5
                  </div>
                  <div className={c.description}>
                    <span>123****</span>
                    <span>24.12.15</span>
                    <span>
                      용량 x 연결성: 128GB x WiFi / 색상: SM-X520NLBAKOO /
                      라이트 블루
                    </span>
                  </div>
                  <div
                    className={`${c.text} ${
                      expandedReviews[idx] ? c.expanded : ""
                    }`}
                  >
                    리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부
                    내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰 내용이 아래에
                    보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴 수
                    있는걸 고려해야합니다. 리뷰 내용이 아래에 보여지며 최대
                    글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야
                    합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가 정해져있어
                    ,일부 내용이 잘릴 수 있는걸 고려해야합니다. 리뷰 내용이
                    아래에 보여지며 최대 글자수가 정해져있어 ,일부 내용이 잘릴
                    수 있는걸 고려해야 합니다. 리뷰 내용이 아래에 보여지며 최대
                    글자수가 정해져있어 ,일부 내용이 잘릴 수 있는걸
                    고려해야합니다. 리뷰 내용이 아래에 보여지며 최대 글자수가
                    정해져있어 ,일부 내용이 잘릴 수 있는걸 고려해야 합니다. 리뷰
                    내용이 아래에 보여지며 최대 글자수가 정해져있어 ,일부 내용이
                    잘릴 수 있는걸 고려해야합니다.
                  </div>
                  <div
                    className={c.readMore}
                    onClick={() => toggleReadMore(idx)}
                  >
                    <span>{expandedReviews[idx] ? "접기" : "더보기"}</span>
                    {expandedReviews[idx] ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                  <div className={c.images}>
                    <div className={c.image}>
                      <img
                        src={"/images/review_img_detail.png"}
                        alt={"title"}
                      />
                    </div>
                    <div className={c.image}>
                      <img
                        src={"/images/review_img_detail.png"}
                        alt={"title"}
                      />
                    </div>
                    <div className={c.image}>
                      <img
                        src={"/images/review_img_detail.png"}
                        alt={"title"}
                      />
                    </div>
                    <div className={c.image}>
                      <img
                        src={"/images/review_img_detail.png"}
                        alt={"title"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={c.paginationMobile}>10개 더보기</div>

          <div className={c.pagination}>
            <PaginationCustom />
          </div>
        </div>
      )}
    </>
  );
};

export default ManageReviewsWritten;
export const ArrowDownIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 9.54134L3.5 6.0995L4.15233 5.45801L7 8.25836L9.84767 5.45801L10.5 6.0995L7 9.54134Z"
      fill="var(--text-949494)"
    />
  </svg>
);

export const ArrowUpIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 4.45866L10.5 7.9005L9.84767 8.54199L7 5.74164L4.15233 8.54199L3.5 7.9005L7 4.45866Z"
      fill="var(--text-949494)"
    />
  </svg>
);
