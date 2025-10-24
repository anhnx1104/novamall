import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData, postData } from "~/lib/clientFunctions";
import Spinner from "../Ui/Spinner";
import ImageLoader from "../Image";
import classes from "../Ui/Modal/modal.module.css";
import c from "./myPoints.module.css";
import Modal from "react-modal";
import PointHistory from "./pointHistory";
import { formatNumberWithCommaAndFloor } from "~/utils/number";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { IconCheck } from "../Layout/Client/sidebarFilterMobile";
import { TruckShippingIcon } from "../Ui/Icons/icons";
import Popup from "../Popup/popup";
import SearchSelect from "../SearchSelect/searchSelect";
import CheckboxCustom from "../Ui/CheckboxCustom/checkboxCustom";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../ButtonCustom";

const getAchievementPercentage = (item) => {
  return (
    Math.floor(
      (((item.totalShoppingPoints + item.totalWithdrawablePoints) /
        item?.product?.pointLimit) *
        100) /
        10
    ) * 10
  );
};

const getCookieLabel = (item) => {
  const achievementPercentage = getAchievementPercentage(item);
  return `${item._id}|||${achievementPercentage}`;
};

const ManageMyPoints = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const url = `/api/profile/mypoints?id=${props.id}`;
  const specialUrl = `/api/profile/myspecial?id=${props.id}`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const { data: specialData } = useSWR(props.id ? specialUrl : null, fetchData);
  const [gif, setGif] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("최신순");
  const [activeFilter2, setActiveFilter2] = useState("전체");

  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [showPointHistory, setShowPointHistory] = useState(false);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [viewedPopups, setViewedPopups] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [loading, setLoading] = useState("");
  const [sendPointsData, setSendPointsData] = useState({
    email: "",
    amount: "",
  });

  const resetSendPointsForm = () => {
    setSendPointsData({
      email: "",
      amount: "",
    });
  };
  // 포인트 전송 POPUP
  const [openPoint, setOpenPoint] = useState(false);
  const [openPointConfirm, setOpenPointConfirm] = useState(false);
  const [useAllPoint, setUseAllPoint] = useState(true);
  const [point, setPoint] = useState("");

  const handleSendPoints = async (e) => {
    try {
      e.preventDefault();
      setLoading("loading");

      const response = await postData(`/api/profile/mypoints`, {
        email: sendPointsData.email,
        point: parseInt(sendPointsData.amount),
      });

      if (response.success) {
        toast.success("포인트가 성공적으로 전송되었습니다");
        setIsOpen(false);
        resetSendPointsForm();
        mutate(); // Refresh the points data
      } else if (response.message === "Insufficient points") {
        toast.error("포인트가 부족합니다");
      } else if (response.message === "User not found") {
        toast.error("사용자를 찾을 수 없습니다");
      } else {
        toast.error("포인트 전송에 실패했습니다");
      }
      setLoading("");
    } catch (err) {
      setLoading("");
      console.log(err);
      toast.error(`오류가 발생했습니다 (${err.message})`);
    }
  };

  const productSpecialList = useMemo(() => {
    if (specialData && specialData.data) {
      return specialData.data.filter(
        (item) =>
          ((item.totalShoppingPoints + item.totalWithdrawablePoints) /
            item?.product?.pointLimit) *
            100 >
          10
      );
    }
    return [];
  }, [specialData]);

  // 이미 본 팝업 ID들을 쿠키에서 로드
  useEffect(() => {
    // const viewedPopupsCookie = Cookies.get("viewedPopups");
    // if (viewedPopupsCookie) {
    //   setViewedPopups(JSON.parse(viewedPopupsCookie));
    // }
  }, []);

  // 팝업 표시 로직
  // useEffect(() => {
  //   if (productSpecialList && productSpecialList.length > 0) {
  //     // 아직 보지 않은 팝업만 필터링
  //     const notViewedPopups = productSpecialList.filter(
  //       (item) => !viewedPopups.includes(getCookieLabel(item))
  //     );

  //     if (notViewedPopups.length > 0) {
  //       setCurrentPopupIndex(0);
  //       setIsOpenPopup(true);
  //     } else {
  //       setIsOpenPopup(false);
  //     }
  //   }
  // }, [productSpecialList, viewedPopups]);

  // 현재 표시할 팝업 아이템
  const currentPopupItem = useMemo(() => {
    if (productSpecialList && productSpecialList.length > 0) {
      const notViewedPopups = productSpecialList.filter(
        (item) => !viewedPopups.includes(getCookieLabel(item))
      );
      return notViewedPopups[currentPopupIndex];
    }
    return null;
  }, [productSpecialList, currentPopupIndex, viewedPopups]);

  // 팝업을 닫고 다음 팝업으로 이동하는 함수
  const handleClosePopup = () => {
    if (currentPopupItem) {
      // 현재 팝업을 본 것으로 표시
      const newViewedPopups = [
        ...viewedPopups,
        getCookieLabel(currentPopupItem),
      ];
      setViewedPopups(newViewedPopups);

      // 쿠키에 저장 (30일 유효)
      // Cookies.set("viewedPopups", JSON.stringify(newViewedPopups), {
      //   expires: 30,
      // });

      // 아직 보지 않은 팝업이 남아있는지 확인
      const notViewedPopups = productSpecialList.filter(
        (item) => !newViewedPopups.includes(getCookieLabel(item))
      );

      if (
        notViewedPopups.length > 0 &&
        currentPopupIndex < notViewedPopups.length - 1
      ) {
        // 다음 팝업으로 이동
        setCurrentPopupIndex(currentPopupIndex + 1);
      } else {
        // 더 이상 표시할 팝업이 없으면 닫기
        setIsOpenPopup(false);
      }
    } else {
      setIsOpenPopup(false);
    }
  };

  useEffect(() => {
    if (isOpenPopup) {
      // 첫 번째 GIF 실행 시간 (밀리초 단위)
      const firstGifDuration = 4212; // 1.gif의 실행 시간 (5초)

      // 첫 번째 GIF 실행 후 두 번째 GIF로 전환
      const timer1 = setTimeout(() => {
        console.log("첫 번째 GIF 실행 완료, 두 번째 GIF로 전환");
        setGif(false);
      }, firstGifDuration);

      return () => {
        clearTimeout(timer1); // 타이머 정리
      };
    }

    setGif(true);
  }, [isOpenPopup]);

  // 팝업 모달 콘텐츠 렌더링 함수
  const renderPopupContent = () => {
    if (!currentPopupItem) {
      return null;
    }

    const achievementPercentage = getAchievementPercentage(currentPopupItem);

    return (
      <div
        className={`${classes.body} ${c.modalGiftBody}`}
        key={currentPopupItem._id + gif}
      >
        <div style={{ position: "relative", width: "100%", height: "172px" }}>
          {gif ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <ImageLoader
                src={process.env.NEXT_PUBLIC_URL + "/images/animate/1.gif"}
                alt={"Egg"}
                width={336}
                height={172}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  position: "absolute",
                  top: "-150px",
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <ImageLoader
                src={process.env.NEXT_PUBLIC_URL + "/images/animate/2.gif"}
                alt={"Egg"}
                width={336}
                height={172}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  position: "absolute",
                  top: "-150px",
                }}
              />
            </motion.div>
          )}
        </div>
        <div className={c.voucherImage}></div>
        <h3 className={c.voucherTitle}>{achievementPercentage}% 달성</h3>
        <p className={c.voucherDescription}>
          {currentPopupItem?.product?.name}
        </p>
        <button
          className="button_primary"
          onClick={() => {
            setIsOpenPopup(false);
            window.scrollTo({
              top: document.getElementById(currentPopupItem._id).offsetTop,
              behavior: "smooth",
            });
            handleClosePopup();
          }}
        >
          자세히보기
        </button>
        <button className={c.closeModal} onClick={handleClosePopup}>
          괜찮습니다.
        </button>
      </div>
    );
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <>
          {!showPointHistory ? (
            <>
              <div className={c.pointContainer}>
                <div className={c.header}>
                  <div className={c.headerLeft}>
                    <div className={c.icon}>P</div>
                    <span>나의 포인트</span>
                  </div>
                  <div className={c.totalPoint}>
                    {" "}
                    {formatNumberWithCommaAndFloor(
                      data.data.totalWithdrawablePoint +
                        data.data.totalShoppingPoint
                    )}{" "}
                    원
                  </div>
                </div>
                <div className={c.actions}>
                  <button className={c.btn} onClick={() => setOpenPoint(true)}>
                    <svg
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 4.59375H5.5C5.13756 4.59375 4.84375 4.88756 4.84375 5.25C4.84375 5.61244 5.13756 5.90625 5.5 5.90625H11.4157L5.03596 12.286C4.77968 12.5422 4.77968 12.9578 5.03596 13.214C5.29224 13.4703 5.70776 13.4703 5.96404 13.214L12.3438 6.83433V12.75C12.3438 13.1124 12.6376 13.4062 13 13.4062C13.3624 13.4062 13.6562 13.1124 13.6562 12.75V5.25C13.6562 5.06949 13.5834 4.906 13.4654 4.78735L13.4626 4.78457C13.4 4.72234 13.328 4.67533 13.2512 4.64355C13.1738 4.61146 13.089 4.59375 13 4.59375Z"
                        fill="white"
                      />
                    </svg>
                    전송하기
                  </button>
                  <button className={c.btn}>
                    <svg
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 9C3.75 12.3137 6.43629 15 9.75 15C13.0637 15 15.75 12.3137 15.75 9"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M9.75 10.5L9.75 3M9.75 3L12 5.25M9.75 3L7.5 5.25"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    출금하기
                  </button>
                  <button
                    className={c.btn}
                    onClick={() => {
                      router.push("/profile/points-history");
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.5662 1.5H5.43376C4.56461 1.5 4.13003 1.5 3.77954 1.62196C3.11491 1.85322 2.59311 2.39039 2.36847 3.0746C2.25 3.43541 2.25 3.88279 2.25 4.77755V15.2806C2.25 15.9243 2.98875 16.2658 3.45607 15.8382C3.73063 15.587 4.14437 15.587 4.41893 15.8382L4.78125 16.1698C5.26244 16.6101 5.98756 16.6101 6.46875 16.1698C6.94994 15.7294 7.67506 15.7294 8.15625 16.1698C8.63744 16.6101 9.36256 16.6101 9.84375 16.1698C10.3249 15.7294 11.0501 15.7294 11.5312 16.1698C12.0124 16.6101 12.7376 16.6101 13.2188 16.1698L13.5811 15.8382C13.8556 15.587 14.2694 15.587 14.5439 15.8382C15.0113 16.2658 15.75 15.9243 15.75 15.2806V4.77755C15.75 3.88279 15.75 3.43541 15.6315 3.0746C15.4069 2.39039 14.8851 1.85322 14.2205 1.62196C13.87 1.5 13.4354 1.5 12.5662 1.5Z"
                        stroke="white"
                        stroke-width="1.5"
                      />
                      <path
                        d="M7.875 8.25L12.75 8.25"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M5.25 8.25H5.625"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M5.25 5.625H5.625"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M5.25 10.875H5.625"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M7.875 5.625H12.75"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M7.875 10.875H12.75"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                    사용내역
                  </button>
                </div>
                <div className={c.infoBox}>
                  <div className={c.infoItem}>
                    <p>적립 예정 포인트</p>
                    <strong>
                      {formatNumberWithCommaAndFloor(
                        data.data.totalWithdrawablePoint +
                          data.data.totalShoppingPoint
                      )}
                      원
                    </strong>
                  </div>
                  <div className={c.infoItem}>
                    <p>쇼핑 포인트</p>
                    <strong>
                      {" "}
                      {formatNumberWithCommaAndFloor(data.data.shoppingPoint)}원
                    </strong>
                  </div>
                  <div className={c.infoItem}>
                    <p>출금 가능 포인트</p>
                    <strong>
                      {formatNumberWithCommaAndFloor(
                        data.data.totalWithdrawablePoint
                      )}
                      원
                    </strong>
                  </div>
                </div>
                <div className={c.rewardStatus}>
                  <div className={c.rewardStatusText}>
                    <span className={c.title}>리워드 현황</span>
                    <p>
                      진행 중인 게이지 <span>999 개</span>
                      <br />
                      완료된 게이지 <span>1,342 개</span>
                    </p>
                  </div>
                  <p className={c.rewardStatusPoint}>
                    <span className={c.green}>20,417 </span>원
                  </p>
                </div>
                <div className={c.rewardStatusMobile}>
                  <div className={c.rewardStatusText}>
                    <span>리워드 현황</span>
                    <div className={c.rewardStatusPoint}>
                      <p className={c.green}>20,417 </p>원
                    </div>
                  </div>
                  <div className={c.rewardStatusPointMobile}>
                    <p>진행 중인 케이지</p>
                    <p>999 개</p>
                  </div>
                  <div className={c.rewardStatusPointMobile}>
                    <p>완료된 케이지</p>
                    <p>1,342 개</p>
                  </div>
                </div>
              </div>
              <div className={c.pointContainer}>
                <p className={c.productTitle}>상품별 포인트 현황</p>
                <div className={c.filters}>
                  <div className={c.filterRight}>
                    <div
                      className={`${c.filterRightItem} ${
                        activeFilter === "최신순" ? c.active : ""
                      }`}
                      onClick={() => setActiveFilter("최신순")}
                    >
                      {activeFilter === "최신순" && <IconCheck />}
                      <span>최신순</span>
                    </div>
                    <div className={c.filterDivider}></div>
                    <div
                      className={`${c.filterRightItem} ${
                        activeFilter === "진행률 높은순" ? c.active : ""
                      }`}
                      onClick={() => setActiveFilter("진행률 높은순")}
                    >
                      {activeFilter === "진행률 높은순" && <IconCheck />}
                      <span>진행률 높은순</span>
                    </div>
                    <div className={c.filterDivider}></div>
                    <div
                      className={`${c.filterRightItem} ${
                        activeFilter === "진행률 낮은 순" ? c.active : ""
                      }`}
                      onClick={() => setActiveFilter("진행률 낮은 순")}
                    >
                      {activeFilter === "진행률 낮은 순" && <IconCheck />}
                      <span>진행률 낮은 순</span>
                    </div>
                  </div>
                  <div className={c.filterRight}>
                    <div
                      className={`${c.filterRightItem} ${
                        activeFilter2 === "전체" ? c.active : ""
                      }`}
                      onClick={() => setActiveFilter2("전체")}
                    >
                      <span>전체</span>
                    </div>
                    <div className={c.filterDivider}></div>
                    <div
                      className={`${c.filterRightItem} ${
                        activeFilter2 === "적립 대기" ? c.active : ""
                      }`}
                      onClick={() => setActiveFilter2("적립 대기")}
                    >
                      <span>적립 대기</span>
                    </div>
                    <div className={c.filterDivider}></div>
                    <div
                      className={`${c.filterRightItem} ${
                        activeFilter2 === "적립 중" ? c.active : ""
                      }`}
                      onClick={() => setActiveFilter2("적립 중")}
                    >
                      <span>적립 중</span>
                    </div>
                  </div>
                </div>
                {specialData?.data?.map((item, idx) => (
                  <div className={c.itemProduct} key={item + idx}>
                    <div className={c.left}>
                      <div className={c.productImage}>
                        <img
                          src={"/images/product_ex.png"}
                          alt={"title"}
                          width={97}
                          height={97}
                        />
                      </div>
                      <div className={c.info}>
                        <p className={c.title}>
                          MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                        </p>
                        <div className={c.priceBox}>
                          <p className={c.productPoint}>
                            총 45,000 Points 적립가능 <span>적립 준비중</span>
                          </p>
                          <p className={c.discount}>
                            25%
                            <span className={c.newPrice}>89,002원</span>
                          </p>
                          <p className={c.tagPoint}>
                            <span>포인트</span>
                            출금 가능 포인트 : 0 | 쇼핑 포인트 : 0
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={c.process}>
                      <div className={c.processBar}></div>
                      <span>98%</span>
                    </div>
                  </div>
                ))}
                {/* <div className={c.actions}>
                  <button onClick={() => setIsOpen(true)}>포인트 보내기</button>
                  <button onClick={() => setIsVoucherOpen(true)}>
                    상품권 구매하기
                  </button>
                  <button onClick={() => setIsWithdrawalOpen(true)}>
                    출금하기
                  </button>
                </div> */}
              </div>
              <Popup
                open={openPoint}
                onClose={() => {
                  setOpenPoint(false);
                }}
                content={
                  <div>
                    <div
                      style={{
                        padding: "24px",
                        backgroundColor: "var(--white)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "16px",
                          fontWeight: "500",
                          gap: "12px",
                          color: "var(--text-121212)",
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "16px",
                            borderRadius: "50%",
                            background: "var(--purple)",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          P
                        </span>
                        내 포인트
                      </div>
                      <p
                        style={{
                          fontSize: "28px",
                          fontWeight: "600",
                          marginBottom: 0,
                          color: "var(--text-121212)",
                        }}
                      >
                        743,129,563 P
                      </p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      <SearchSelect
                        options={[
                          {
                            title: "Testuser1",
                            sub: "홍석 010-1254-**** zxcs****@naver.com",
                          },
                          {
                            title: "Testuser12",
                            sub: "홍석 010-1254-**** zxcs****@naver.com",
                          },
                          {
                            title: "Testuser123",
                            sub: "홍석 010-1254-**** zxcs****@naver.com",
                          },
                          {
                            title: "Testuser1234",
                            sub: "홍석 010-1254-**** zxcs****@naver.com",
                          },
                        ]}
                      />
                      <input
                        placeholder="전송할 포인트를 입력해주세요"
                        name="point"
                        type="text"
                        value={point}
                        onChange={(e) => setPoint(e.target.value)}
                        style={{
                          margin: "24px 0 12px",
                          border: "none",
                          borderBottom: "1px solid #e8ecef",
                          outline: "none",
                          background: "transparent",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          width: "100%",
                        }}
                      >
                        <CheckboxCustom
                          label={t("전체 포인트 사용")}
                          name="useAllPoint"
                          value="useAllPoint"
                          checked={useAllPoint}
                          onChange={() => {
                            setUseAllPoint(!useAllPoint);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                }
                styleAction={{
                  backgroundColor: "#fff",
                }}
                action={
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <ButtonCustom
                      text={t("취소")}
                      onClick={() => {
                        setOpenPoint(false);
                      }}
                    />
                    <ButtonCustom
                      variant={"primary"}
                      text={t("전환하기")}
                      onClick={() => {
                        setOpenPoint(false);
                        setOpenPointConfirm(true);
                      }}
                    />
                  </div>
                }
              />
              {/* Point confirm popup */}
              <Popup
                open={openPointConfirm}
                onClose={() => setOpenPointConfirm(false)}
                content={
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "16px",
                          borderRadius: "50%",
                          background: "var(--purple)",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        P
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: "400",
                          color: "var(--text-121212)",
                          fontSize: "18px",
                          marginBottom: "0",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>Testuser123 </span>
                        님에게
                        <br />
                        <span style={{ fontWeight: "600" }}>50,000P</span> 를
                        전송하시겠습니까?
                      </p>
                    </div>
                  </div>
                }
                small
                styleAction={{
                  backgroundColor: "var(--white)",
                }}
                action={
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <ButtonCustom
                      text={t("취소")}
                      onClick={() => setOpenPointConfirm(false)}
                    />
                    <ButtonCustom
                      variant={"primary"}
                      text={t("전환하기")}
                      onClick={() => setOpenPointConfirm(false)}
                    />
                  </div>
                }
              />
            </>
          ) : (
            <PointHistory
              id={props.id}
              onBack={() => setShowPointHistory(false)}
            />
          )}
          <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            onAfterOpen={resetSendPointsForm}
            closeTimeoutMS={400}
            className={`${classes.content_small} ${c.modalContent}`}
            overlayClassName={classes.overlay}
          >
            <div className={`${c.modalBody}`}>
              <h3 className={c.modalTitle}>포인트 보내기</h3>
              <div className={c.modalContainer}>
                <div className={c.flexForm}>
                  <label className={c.labelForm}>이메일</label>
                  <input
                    className={c.inputForm}
                    type="text"
                    value={sendPointsData.email}
                    onChange={(e) =>
                      setSendPointsData({
                        ...sendPointsData,
                        email: e.target.value,
                      })
                    }
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div className={c.flexForm}>
                  <label className={c.labelForm}>금액</label>
                  <input
                    className={c.inputForm}
                    type="number"
                    value={sendPointsData.amount}
                    onChange={(e) =>
                      setSendPointsData({
                        ...sendPointsData,
                        amount: e.target.value,
                      })
                    }
                    placeholder="금액을 입력하세요"
                  />
                </div>
                <p>
                  사용 가능한 포인트 :{" "}
                  {formatNumberWithCommaAndFloor(
                    data?.data?.withdrawablePoint || 0
                  )}
                </p>
              </div>
              <button
                className="button_primary"
                onClick={handleSendPoints}
                disabled={loading === "loading"}
              >
                {loading === "loading" ? "전송 중..." : "보내기"}
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isVoucherOpen}
            onRequestClose={() => setIsVoucherOpen(false)}
            closeTimeoutMS={400}
            className={`${classes.content_small} ${c.modalContent}`}
            overlayClassName={classes.overlay}
          >
            <div className={`${c.modalBody}`}>
              <h3 className={c.modalTitle}>상품권 구매하기</h3>
              <div className={c.modalContainer}>
                <div className={c.flexForm}>
                  <label className={c.labelForm}>상품권 선택</label>
                  <select className={c.inputForm}>
                    <option>Google Gift Vouchers</option>
                  </select>
                </div>
                <p>
                  사용 가능한 포인트 :{" "}
                  {formatNumberWithCommaAndFloor(
                    data?.data?.totalWithdrawablePoint || 0
                  )}
                </p>
                <div className={c.voucherCard}>
                  <div className={c.voucherLeft}>
                    <ImageLoader
                      src={`${process.env.NEXT_PUBLIC_URL}/images/voucher1.png`}
                      alt={"title"}
                      width={64}
                      height={64}
                      style={{
                        borderRadius: "12px",
                      }}
                    />
                    <div>
                      <h4>Google Gift Voucher</h4>
                      <p>수량 : 1</p>
                      <p>유효기간: 무기한</p>
                    </div>
                  </div>
                  <div className={c.voucherRight}>
                    <h3>$10</h3>
                  </div>
                </div>
              </div>
              <button
                className="button_primary"
                onClick={() => setIsVoucherOpen(false)}
              >
                구매하기
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isWithdrawalOpen}
            onRequestClose={() => setIsWithdrawalOpen(false)}
            closeTimeoutMS={400}
            className={`${classes.content_small} ${c.modalContent}`}
            overlayClassName={classes.overlay}
          >
            <div className={`${c.modalBody}`}>
              <h3 className={c.modalTitle}>출금하기</h3>
              <div className={c.modalContainer}>
                <div className={c.flexForm}>
                  <label className={c.labelForm}>은행명</label>
                  <select className={c.inputForm}>
                    <option>South Korea Central Bank</option>
                  </select>
                </div>
                <div className={c.flexForm}>
                  <label className={c.labelForm}>계좌번호</label>
                  <input
                    className={c.inputForm}
                    type="text"
                    value="3553-6474-7472-3456"
                  />
                </div>
                <div className={c.flexForm}>
                  <label className={c.labelForm}>예금주</label>
                  <input className={c.inputForm} type="text" value="Xian Lee" />
                </div>
                <div className={c.flexForm}>
                  <label className={c.labelForm}>금액</label>
                  <input className={c.inputForm} type="text" value="$50" />
                </div>
                <p>
                  사용 가능한 포인트 :{" "}
                  {formatNumberWithCommaAndFloor(
                    data?.data?.totalWithdrawablePoint || 0
                  )}
                </p>
              </div>
              <button
                className="button_primary"
                onClick={() => setIsWithdrawalOpen(false)}
              >
                출금 요청
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isOpenPopup}
            onRequestClose={handleClosePopup}
            closeTimeoutMS={400}
            className={`${classes.content_small} ${c.modalGiftContent}`}
            overlayClassName={classes.overlay}
          >
            {renderPopupContent()}
          </Modal>
        </>
      )}
    </>
  );
};

export default ManageMyPoints;
