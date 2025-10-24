import { Trash3 } from "@styled-icons/bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData } from "~/lib/clientFunctions";
import Spinner from "../Ui/Spinner";
import PaginationCustom from "../PaginationCustom";
import c from "./reviewsWrite.module.css";
import { TruckShippingIcon } from "../Ui/Icons/icons";

const ManageReviewsWrite = (props) => {
  const url = `/api/profile?id=${props.id}&scope=review`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const router = useRouter();
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
              className={c.tab + " " + c.active}
              onClick={() => router.push("/profile/reviews/write")}
            >
              리뷰 작성
            </span>
            <span
              className={c.tab}
              onClick={() => router.push("/profile/reviews/written")}
            >
              작성한 리뷰
            </span>
          </div>
          <div className={c.listTitle}>
            <p>
              리뷰 작성
              <span style={{ paddingLeft: "4px" }}>3</span>
            </p>
            <button className={c.deleteAllButton} onClick={() => {}}>
              전체 삭제
            </button>
          </div>
          <div className={c.itemsContainer}>
            {Array.from({ length: 5 }).map((item, idx) => (
              <div className={c.item} key={item + idx}>
                <div className={c.left}>
                  <div className={c.productImage}>
                    <img
                      src={"/images/product_ex.png"}
                      alt={"title"}
                      width={86}
                      height={86}
                    />
                  </div>
                  <div className={c.info}>
                    <p className={c.title}>
                      MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
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
                  <button>리뷰 작성하기</button>
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

export default ManageReviewsWrite;
