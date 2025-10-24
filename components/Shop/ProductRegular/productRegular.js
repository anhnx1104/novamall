import { Eye, Repeat, SuitHeart } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ImageLoader from "~/components/Image";
import ReviewCount from "~/components/Review/count";
import { formatNumber, postData, stockInfo } from "~/lib/clientFunctions";
import {
  updateComparelist,
  updateWishlist,
  addToCart,
} from "~/redux/cart.slice";
import { _simpleProductCart } from "~/lib/cartHandle";
import c from "./productRegular.module.css";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const ProductRegular = ({
  product,
  button,
  link,
  deleteButton,
  layout,
  border,
  hideLink,
  cssClass,
  size,
}) => {
  const { session } = useSelector((state) => state.localSession);
  const settings = useSelector((state) => state.settings);
  const {
    wishlist: wishlistState,
    compare: compareState,
    cart: cartData,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const discountInPercent =
    Math.round((100 - (product.discount * 100) / product.price) * 10) / 10;

  function updateWishlistCount() {
    const __data = wishlistState ? wishlistState + 1 : 1;
    dispatch(updateWishlist(__data));
  }

  const addToWishList = async (e) => {
    try {
      e.preventDefault();
      if (!session) {
        return toast.warning("위시리스트를 생성하려면 로그인해야 합니다.");
      }
      const data = {
        pid: product._id,
        id: session.user.id,
      };
      const response = await postData(`/api/wishlist`, data);
      response.success
        ? (toast.success("위시리스트에 항목이 추가되었습니다."),
          updateWishlistCount())
        : response.exists
        ? toast.warning("이 항목은 이미 위시리스트에 있습니다.")
        : toast.error("문제가 발생했습니다.");
    } catch (err) {
      console.log(err);
      toast.error(`오류: ${err.message}`);
    }
  };

  const addToCompareList = () => {
    const pid = product._id;
    const exists = compareState.find((x) => x === pid);
    if (exists) {
      toast.warning("이 항목은 이미 비교 목록에 있습니다.");
    } else {
      const __data = [...compareState, product._id];
      dispatch(updateComparelist(__data));
      toast.success("비교 목록에 항목이 추가되었습니다.");
    }
  };

  const handleAddToCart = () => {
    if (product.type === "variable") {
      // Redirect to product detail page for variable products
      router.push(`/product/${product.slug}`);
      return;
    }

    // For simple products, use the cartHandle function
    const addToCartFunc = _simpleProductCart(
      { product },
      { items: cartData?.items || [] }, // Ensure items array exists
      product.discount,
      dispatch
    );
    addToCartFunc(1);
  };

  const itemLink = link ? link : `/gallery?slug=${product.slug}`;
  const ItemLayout = layout ? layout : "col-lg-3 col-md-4 col-6";

  return (
    <Link href={`/product/${product.slug}`}>
      <div
        className={`${c.item} ${ItemLayout}`}
        style={{ minWidth: size || "188px", maxWidth: size || "188px" }}
      >
        <div
          className={`${c.card} ${border ? c.border : ""} ${
            cssClass ? cssClass : ""
          }`}
        >
          <div className={c.hover_buttons}>
            <button onClick={addToWishList} style={{ zIndex: 100 }}>
              <SuitHeart width={15} height={15} />
            </button>
            {/* <button onClick={addToCompareList}>
            <Repeat width={15} height={15} />
          </button> */}
            {/* {!hideLink && (
            <Link
              href={itemLink}
              as={`/product/${product.slug}`}
              scroll={false}
              shallow={true}
            >
              <button>
                <Eye width={15} height={15} />
              </button>
            </Link>
          )} */}
            {deleteButton && deleteButton}
          </div>
          <div>
            <Link href={`/product/${product.slug}`}>
              <div className={c.container}>
                <ImageLoader
                  src={product.image[0]?.url}
                  alt={product.name}
                  width={80}
                  height={160}
                  style={{ width: "70%", height: "auto" }}
                  quality={100}
                />
              </div>
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              {product.discount === product.price ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                >
                  {/* Price */}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "black",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatNumber(product.discount)}원
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                >
                  {/* Price */}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "black",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatNumber(product.discount)}원
                  </p>
                  {/* Price old */}
                  <p className={c.price_old}>{formatNumber(product.price)}원</p>
                </div>
              )}
              <p
                style={{
                  fontSize: "12px",
                  color: "#98462B",
                  fontWeight: "500",
                  margin: 0,
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {/* Start review */}
                {product.averageRating || 0}
                {/* Start icon*/}
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.50001 11.5166L5.73334 13.1833C5.61112 13.2611 5.48334 13.2944 5.35001 13.2833C5.21667 13.2722 5.10001 13.2277 5.00001 13.15C4.90001 13.0722 4.82223 12.9751 4.76667 12.8586C4.71112 12.7422 4.70001 12.6115 4.73334 12.4666L5.46667 9.31663L3.01667 7.19997C2.90556 7.09997 2.83623 6.98597 2.80867 6.85797C2.78112 6.72997 2.78934 6.60508 2.83334 6.4833C2.87734 6.36152 2.94401 6.26152 3.03334 6.1833C3.12267 6.10508 3.24489 6.05508 3.40001 6.0333L6.63334 5.74997L7.88334 2.7833C7.93889 2.64997 8.02512 2.54997 8.14201 2.4833C8.25889 2.41663 8.37823 2.3833 8.50001 2.3833C8.62178 2.3833 8.74112 2.41663 8.85801 2.4833C8.97489 2.54997 9.06112 2.64997 9.11667 2.7833L10.3667 5.74997L13.6 6.0333C13.7556 6.05552 13.8778 6.10552 13.9667 6.1833C14.0556 6.26108 14.1222 6.36108 14.1667 6.4833C14.2111 6.60552 14.2196 6.73063 14.192 6.85863C14.1644 6.98663 14.0949 7.10041 13.9833 7.19997L11.5333 9.31663L12.2667 12.4666C12.3 12.6111 12.2889 12.7417 12.2333 12.8586C12.1778 12.9755 12.1 13.0726 12 13.15C11.9 13.2273 11.7833 13.2717 11.65 13.2833C11.5167 13.2949 11.3889 13.2615 11.2667 13.1833L8.50001 11.5166Z"
                    fill="#FFAE00"
                  />
                </svg>
              </p>
            </div>

            <div className={c.name}>{product.name}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductRegular;
