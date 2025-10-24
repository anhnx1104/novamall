import { XLg } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkPercentage, dateFormat, postData } from "~/lib/clientFunctions";
import classes from "~/styles/orderTrack.module.css";
import LoadingButton from "../Ui/Button";
import StarRating from "../Ui/Rating/ratingInput";
import c from "./purchaseDetails.module.css";
import { useTranslation } from "react-i18next";
import RefundForm from "./refundForm";
import ImageLoader from "../Image";
import { X } from "@styled-icons/bootstrap";
import FileUpload from "../FileUpload/fileUpload";
import dayjs from "dayjs";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

export default function PurchaseDetails({ data, hide, update }) {
  const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    name: null,
    oid: null,
  });
  const [selectedRefund, setSelectedRefund] = useState({
    product: {},
    oid: null,
  });
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const product_review = (id, name, oid) => {
    setSelectedProduct({ id, name, oid });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const orderSteps = [
    { label: "주문 완료", key: "ordered" }, // 0
    { label: "진행중", key: "processing" }, // 1
    { label: "배송중", key: "shipped" }, // 2
    { label: "전달완료", key: "delivered" }, // 3
  ];

  function getActiveStep(status) {
    if (status === "Canceled") return "canceled";
    if (status === "Delivered") return 3;
    if (status === "Shipped") return 2;
    if (["In Progress", "Pending", "Packaged"].includes(status)) return 1;
    return 0;
  }

  const activeStep = getActiveStep(data.status);

  return (
    <>
      <div>
        <h3
          style={{
            fontWeight: "600",
            fontSize: "28px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ cursor: "pointer" }} onClick={hide}>
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6665 5.5L7.2558 9.91074C6.93036 10.2362 6.93036 10.7638 7.2558 11.0893L11.6665 15.5"
                stroke="#3C4242"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          주문 상세
        </h3>
        <div className={c.orderInfo}>
          <div className={c.flex} style={{ alignItems: "start" }}>
            <div>
              <p className={c.orderNo}>주문 번호: #{data.orderId}</p>

              <p>
                <span>
                  {dayjs(data?.orderDate).format("YYYY년 MM월 DD일 A hh:mm")}
                </span>
              </p>
            </div>
            <div className={c.price_container}>
              <div className={c.flex}>
                <p style={{ minWidth: "80px" }}>{t("inv_total_price")}:</p>
                <p style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(data.totalPrice)
                  )}
                </p>
              </div>
              <div className={c.flex}>
                <p style={{ minWidth: "80px" }}>{t("inv_discount")}:</p>
                <p style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {data.coupon?.discount ? "-" : ""}
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(
                      checkPercentage(
                        data.totalPrice,
                        data.coupon?.discount || 0
                      )
                    )
                  )}
                </p>
              </div>
              <div className={c.flex}>
                <p style={{ minWidth: "80px" }}>{t("inv_ship_cost")}:</p>
                <p style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(data.deliveryInfo.cost)}
                </p>
              </div>
              <div className={c.flex}>
                <p style={{ minWidth: "80px" }}>{t("inv_supply_price")}:</p>
                <p style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(data.totalPrice / 1.1)
                  )}
                </p>
              </div>
              <div className={c.flex}>
                <p style={{ minWidth: "80px" }}>{t("inv_vat")}:</p>
                <p style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(decimalBalance(data.vat))}
                </p>
              </div>
              <div className={c.flex}>
                <p style={{ minWidth: "80px" }}>{t("inv_payment_amount")}:</p>
                <p style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(data.payAmount)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={c.orderSteps}>
          <div className={c.progressBar}>
            {orderSteps.map((step, index) => (
              <div
                key={index}
                className={`${c.step} ${index <= activeStep ? c.active : ""}`}
              >
                <div
                  className={`${c.circle} ${
                    index === activeStep
                      ? c.current
                      : index < activeStep
                      ? c.done
                      : ""
                  }`}
                />
                <span
                  className={`${c.label} ${
                    index <= activeStep ? c.activeLabel : ""
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={c.stepDescription}>
          <p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                stroke="#727272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.001 10.0002L12.801 12.8002M15.201 8.80017L11.201 12.8002"
                stroke="#727272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {dateFormat(data.orderDate)}
          </p>
          <p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1744 9.63937C20.8209 9.27 20.4553 8.88938 20.3175 8.55469C20.19 8.24813 20.1825 7.74 20.175 7.24781C20.1609 6.33281 20.1459 5.29594 19.425 4.575C18.7041 3.85406 17.6672 3.83906 16.7522 3.825C16.26 3.8175 15.7519 3.81 15.4453 3.6825C15.1116 3.54469 14.73 3.17906 14.3606 2.82562C13.7137 2.20406 12.9788 1.5 12 1.5C11.0212 1.5 10.2872 2.20406 9.63937 2.82562C9.27 3.17906 8.88938 3.54469 8.55469 3.6825C8.25 3.81 7.74 3.8175 7.24781 3.825C6.33281 3.83906 5.29594 3.85406 4.575 4.575C3.85406 5.29594 3.84375 6.33281 3.825 7.24781C3.8175 7.74 3.81 8.24813 3.6825 8.55469C3.54469 8.88844 3.17906 9.27 2.82562 9.63937C2.20406 10.2863 1.5 11.0212 1.5 12C1.5 12.9788 2.20406 13.7128 2.82562 14.3606C3.17906 14.73 3.54469 15.1106 3.6825 15.4453C3.81 15.7519 3.8175 16.26 3.825 16.7522C3.83906 17.6672 3.85406 18.7041 4.575 19.425C5.29594 20.1459 6.33281 20.1609 7.24781 20.175C7.74 20.1825 8.24813 20.19 8.55469 20.3175C8.88844 20.4553 9.27 20.8209 9.63937 21.1744C10.2863 21.7959 11.0212 22.5 12 22.5C12.9788 22.5 13.7128 21.7959 14.3606 21.1744C14.73 20.8209 15.1106 20.4553 15.4453 20.3175C15.7519 20.19 16.26 20.1825 16.7522 20.175C17.6672 20.1609 18.7041 20.1459 19.425 19.425C20.1459 18.7041 20.1609 17.6672 20.175 16.7522C20.1825 16.26 20.19 15.7519 20.3175 15.4453C20.4553 15.1116 20.8209 14.73 21.1744 14.3606C21.7959 13.7137 22.5 12.9788 22.5 12C22.5 11.0212 21.7959 10.2872 21.1744 9.63937ZM16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1217 15.6557 10.039 15.6004 9.96937 15.5306L7.71937 13.2806C7.64969 13.2109 7.59442 13.1282 7.5567 13.0372C7.51899 12.9461 7.49958 12.8485 7.49958 12.75C7.49958 12.6515 7.51899 12.5539 7.5567 12.4628C7.59442 12.3718 7.64969 12.2891 7.71937 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.34855 11.9996 8.44613 12.019 8.53717 12.0567C8.62822 12.0944 8.71094 12.1497 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.2891 9.14969 15.3718 9.09442 15.4628 9.0567C15.5539 9.01899 15.6515 8.99958 15.75 8.99958C15.8485 8.99958 15.9461 9.01899 16.0372 9.0567C16.1282 9.09442 16.2109 9.14969 16.2806 9.21937C16.3503 9.28906 16.4056 9.37178 16.4433 9.46283C16.481 9.55387 16.5004 9.65145 16.5004 9.75C16.5004 9.84855 16.481 9.94613 16.4433 10.0372C16.4056 10.1282 16.3503 10.2109 16.2806 10.2806Z"
                fill="#00753B"
              />
            </svg>
            주문이 성공적으로 요청되었습니다.
          </p>
        </div>

        <div className={c.orderDetails}>
          {data.products.map((product, idx) => (
            <div className={c.orderItem} key={product._id + idx}>
              <div className={c.left}>
                <div className={c.flex}>
                  <div className={c.productImage}>
                    <ImageLoader
                      src={product?.image[0]?.url}
                      alt={product?.name}
                      width={96}
                      height={96}
                    />
                  </div>
                  <div className={c.productDetails}>
                    <h5>{product.name}</h5>
                    {/* <p>색상 : 흰색</p>
                    <p>사이즈 : M</p> */}
                  </div>
                </div>
              </div>
              <div className={c.right}>
                <div className={c.productQuantity}>
                  <p>수량 : {formatNumberWithCommaAndFloor(product?.qty)}</p>
                </div>
                <div className={c.productPrice}>
                  <p>{formatNumberWithCommaAndFloor(product?.price)}원</p>
                </div>
                <div className={c.productPrice}>
                  {data.status === "Delivered" ? (
                    <>
                      <button
                        className={"button_primary"}
                        onClick={() =>
                          product_review(
                            product._id,
                            product.name,
                            data.orderId
                          )
                        }
                        disabled={product.review ? true : false}
                      >
                        {product.review ? "리뷰됨" : "리뷰"}
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GlobalModal isOpen={isOpen} handleCloseModal={closeModal}>
        <ReviewForm data={selectedProduct} />
      </GlobalModal>
      <GlobalModal
        isOpen={selectedRefund.oid ? true : false}
        handleCloseModal={() => setSelectedRefund({ product: {}, oid: null })}
      >
        <RefundForm
          data={selectedRefund}
          orderData={data}
          update={update}
          hide={hide}
          close={() => setSelectedRefund({ product: {}, oid: null })}
        />
      </GlobalModal>
    </>
  );

  function ReviewForm({ data }) {
    const [loading, setLoading] = useState("");
    const [rating, setRating] = useState(1);
    const [files, setFiles] = useState([]);
    const comment = useRef();
    async function postReview(e) {
      try {
        e.preventDefault();
        setLoading("loading");
        const _data = {
          pid: data.id,
          oid: data.oid,
          rating,
          comment: comment.current.value.trim(),
          media: files.map((file) => ({
            url: file.url,
            type: file.type,
          })),
        };
        const resp = await postData("/api/review", _data);
        if (resp.success) {
          toast.success("리뷰가 성공적으로 등록되었습니다.");
          hide();
          closeModal();
          update();
        } else {
          toast.error("오류가 발생했습니다 500");
        }
      } catch (err) {
        console.log(err);
        toast.error(`오류가 발생했습니다 - ${err.message}`);
      }
      setLoading("");
    }
    return (
      <form onSubmit={postReview}>
        <div className="mb-3">
          <label className="form-label">상품</label>
          <p>{data.name}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">평점</label>
          <StarRating rate={setRating} />
        </div>
        <div className="mb-3">
          <label className="form-label">리뷰 내용</label>
          <textarea className="form-control" ref={comment} required></textarea>
        </div>
        <div className="mb-3">
          <FileUpload
            accept=".jpg,.png,.jpeg,.mp4,.mov"
            label="리뷰 이미지/비디오"
            multiple
            updateFilesCb={setFiles}
          />
        </div>
        <LoadingButton text="리뷰 제출" state={loading} type="submit" />
      </form>
    );
  }
}
