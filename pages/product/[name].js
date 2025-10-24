import { CardText, ChatLeftDots, StarHalf } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from "react-i18next";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import classes from "~/components/Shop/Product/productDetails.module.css";
import ProductReviews from "~/components/Shop/Product/productReviews";
import { _simpleProductCart, _variableProductCart } from "~/lib/cartHandle";
import {
  formatNumber,
  postData,
  setSettingsData,
  stockInfo,
  deleteData,
  fetchData,
} from "~/lib/clientFunctions";
import productDetailsData from "~/lib/dataLoader/productDetails";
import { wrapper } from "~/redux/store";
import { updateWishlist, selectAllItems } from "~/redux/cart.slice";
import useSWR from "swr";
import {
  ArrowMoreIcon,
  CloseIcon,
  MessageIcon,
  ShareIcon,
} from "~/components/Ui/Icons/icons";
import { ButtonViewMore } from "~/components/ButtonViewMore/buttonViewMore";
import TruckDelivery from "~/components/TruckDelivery/truckDelivery";
import DropdownCustom from "~/components/DropdownCustom/dropdownCustom";
import ButtonCustom from "~/components/ButtonCustom";
import { IconHeart } from "~/components/Profile/myProfile";
import RelatedProductSection from "~/components/Shop/Product/relatedProducts";
import ReviewSection from "~/components/Shop/Product/reviewSection";
import ProductTabDetail from "~/components/Shop/Product/productTabDetail";
import ProductTabReview from "~/components/Shop/Product/productTabReview";
import ProductTabQna from "~/components/Shop/Product/productTabQna";
import ProductTabReturn from "~/components/Shop/Product/productTabReturn";
import useIsMobile from "~/hooks/isMobile";
import { ArrowDownIcon } from "../cs-center/qna";
import BottomSheet from "~/components/BottomSheet/bottomSheet";

const Error404 = dynamic(() => import("~/components/error/404"));
const Error500 = dynamic(() => import("~/components/error/500"));
const HeadData = dynamic(() => import("~/components/Head"));
const ImageLoader = dynamic(() => import("~/components/Image"));
const Question = dynamic(() => import("~/components/question"));
const Review = dynamic(() => import("~/components/Review"));
const Product = dynamic(() => import("~/components/Shop/Product/product"));
const InnerImageZoom = dynamic(() => import("react-inner-image-zoom"));
const Carousel = dynamic(() =>
  import("react-responsive-carousel").then((com) => com.Carousel)
);

function ProductDetailsPage({ data, error }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tabDetailRef = useRef(null);
  const tabReviewRef = useRef(null);
  const tabQnaRef = useRef(null);
  const tabReturnRef = useRef(null);
  const productTabsRef = useRef(null);
  const isScrollingProgrammatically = useRef(false);
  const [activeTab, setActiveTab] = useState("detail");

  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const [selectedColor, setSelectedColor] = useState({
    name: null,
    value: null,
  });
  const [selectedAttribute, setSelectedAttribute] = useState({
    name: null,
    value: null,
    for: null,
  });
  const { session } = useSelector((state) => state.localSession);
  const [price, setPrice] = useState(0);
  const [tabId, setTabId] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const quantityAmount = useRef();
  const question = useRef();
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const router = useRouter();
  const relatedItem =
    data.related &&
    data.related.filter((obj) => {
      return obj._id !== data.product._id;
    });
  const { t } = useTranslation();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { wishlist: wishlistState } = useSelector((state) => state.cart);
  const url = `/api/review/stats?slug=${data.product.slug}`;
  const { data: reviewStats, error: reviewError } = useSWR(url, fetchData);
  useEffect(() => {
    if (data && data.product) {
      if (typeof window !== "undefined" && data?.product) {
        if (data.product.isSpecial) {
          window.sessionStorage.setItem("productType", "special");
        } else {
          window.sessionStorage.setItem("productType", "general");
        }
      }
      setPrice(data.product.discount);
      if (data.product.type !== "variable") {
        return;
      }
      if (data.product.colors && data.product.colors.length > 0) {
        setSelectedColor({
          name: data.product.colors[0]?.label,
          value: data.product.colors[0]?.value,
        });
      }
      if (data.product.attributes && data.product.attributes.length > 0) {
        setSelectedAttribute({
          name: data.product.attributes[0]?.label,
          value: data.product.attributes[0]?.value,
          for: data.product.attributes[0]?.for,
        });
      }
    }
  }, [data]);

  useEffect(() => {
    // Check if product is in wishlist when component mounts
    if (data?.product?._id && session?.user?.id) {
      checkWishlistStatus();
    }
  }, [data, session]);

  // Scroll spy effect - update activeTab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Skip scroll spy if programmatically scrolling
      if (isScrollingProgrammatically.current) {
        return;
      }

      const tabRefs = [
        { ref: tabDetailRef, name: "detail" },
        { ref: tabReviewRef, name: "review" },
        { ref: tabQnaRef, name: "qna" },
        { ref: tabReturnRef, name: "return" },
      ];

      // Get the sticky tabs height
      const tabsElement = document.querySelector(`.${classes.tabs}`);
      const tabsHeight = tabsElement ? tabsElement.offsetHeight : 0;

      // Calculate scroll position accounting for sticky tabs
      const scrollPosition = window.scrollY + tabsHeight + 1; // 1px buffer

      for (let i = tabRefs.length - 1; i >= 0; i--) {
        const tab = tabRefs[i];
        if (tab.ref.current) {
          const offsetTop = tab.ref.current.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveTab(tab.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(
        `/api/profile?id=${session.user.id}&scope=favorite`
      );
      const result = await response.json();
      if (
        result.user?.favorite?.some((item) => item._id === data.product._id)
      ) {
        setIsInWishlist(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleWishlist = async () => {
    try {
      if (!session) {
        return toast.warning("위시리스트를 관리하려면 로그인이 필요합니다");
      }

      if (isInWishlist) {
        // Remove from wishlist
        const response = await deleteData("/api/wishlist", {
          pid: data.product._id,
          id: session.user.id,
        });
        if (response.success) {
          setIsInWishlist(false);
          const __data = wishlistState > 0 ? wishlistState - 1 : 0;
          dispatch(updateWishlist(__data));
          toast.success("위시리스트에서 제품이 제거되었습니다");
        } else {
          toast.error("오류가 발생했습니다");
        }
      } else {
        // Add to wishlist
        const response = await postData("/api/wishlist", {
          pid: data.product._id,
          id: session.user.id,
        });
        if (response.success) {
          setIsInWishlist(true);
          const __data = wishlistState ? wishlistState + 1 : 1;
          dispatch(updateWishlist(__data));
          toast.success("위시리스트에 제품이 추가되었습니다");
        } else if (response.exists) {
          toast.warning("이 제품은 이미 위시리스트에 있습니다");
        } else {
          toast.error("오류가 발생했습니다");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const checkVariantInfo = (color, attr) => {
    const colorName = color || selectedColor.name;
    const attrName = attr || selectedAttribute.name;
    return data.product.variants.find(
      (item) => item.color === colorName && item.attr === attrName
    );
  };

  const stepUpQty = () => {
    quantityAmount.current.stepUp();
  };

  const stepDownQty = () => {
    quantityAmount.current.stepDown();
  };

  const selectPreviewImage = (vd) => {
    if (vd.imageIndex && vd.imageIndex > 0) {
      setSelectedImage(vd.imageIndex - 1);
    }
  };

  const updatePrice = (color, attr) => {
    const variantData = checkVariantInfo(color, attr);
    if (variantData && variantData.price) {
      const itemPrice = data.product.discount + Number(variantData.price);
      setPrice(itemPrice);
      selectPreviewImage(variantData);
    }
  };

  const changeColor = (e) => {
    try {
      const value = {
        name: e.label,
        value: e.value,
      };
      setSelectedColor(value);
      updatePrice(value.name, null);
    } catch (err) {
      console.log(err);
    }
  };

  const changeVariant = (e) => {
    try {
      const value = {
        name: e.label,
        value: e.value,
        for: e.for,
      };
      setSelectedAttribute(value);
      updatePrice(null, value.name);
    } catch (err) {
      console.log(err);
    }
  };

  const simpleProductCart = _simpleProductCart(data, cartData, price, dispatch);

  const checkQty = (prevQty, currentQty, availableQty) => {
    const avQty = Number(availableQty);
    if (avQty === -1) {
      return true;
    } else {
      return prevQty + currentQty <= avQty;
    }
  };

  const variableProductCart = _variableProductCart(
    data,
    selectedColor,
    selectedAttribute,
    cartData,
    checkVariantInfo,
    checkQty,
    price,
    dispatch
  );

  const addItemToCart = () => {
    const qty = Number(quantityAmount.current?.value) || 1;
    if (data.product.type === "simple") {
      simpleProductCart(qty);
    } else {
      variableProductCart(qty);
    }
  };

  const buyNow = async () => {
    if (settings.settingsData.security.loginForPurchase && !session) {
      toast.info("계속하려면 로그인해주세요");
      router.push("/signin");
    } else {
      dispatch(selectAllItems(false));
      const qty = Number(quantityAmount.current.value);
      if (data.product.type === "simple") {
        simpleProductCart(qty);
      } else {
        variableProductCart(qty);
      }

      router.push("/checkout");
    }
  };

  const thumbs = () => {
    // const thumbList = data.product.gallery.map((item, index) => (
    //   <ImageLoader
    //     key={item.name + index}
    //     src={item.url}
    //     alt={data.product.name}
    //     width={67}
    //     height={67}
    //     style={{ width: "100%", height: "auto" }}
    //   />
    // ));
    const thumbList = [
      {
        url: "/images/review_img_detail.png",
        name: "image1",
      },
      {
        url: "/images/review_img_detail.png",
        name: "image2",
      },
      {
        url: "/images/review_img_detail.png",
        name: "image3",
      },
    ].map((item, index) => (
      <img
        key={item.name + index}
        src={`${item.url}`}
        alt={data.product.name}
        width={67}
        height={67}
        style={{ width: "100%", height: "auto" }}
      />
    ));
    return thumbList;
  };

  const _showTab = (i) => {
    setTabId(i);
  };

  const refreshData = () => router.replace(router.asPath);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    // Set flag to prevent scroll spy interference
    isScrollingProgrammatically.current = true;

    // Map tab names to their refs
    const tabRefMap = {
      detail: tabDetailRef,
      review: tabReviewRef,
      qna: tabQnaRef,
      return: tabReturnRef,
    };

    const targetRef = tabRefMap[tabName];
    if (targetRef?.current) {
      // Get the sticky tabs height
      const tabsElement = document.querySelector(`.${classes.tabs}`);
      const tabsHeight = tabsElement ? tabsElement.offsetHeight : 0;

      // Get the target div's absolute position from the top of the document
      const targetTop = targetRef.current.getBoundingClientRect().top + window.scrollY;

      // Scroll so the target div appears right below the sticky tabs
      const scrollToPosition = targetTop - tabsHeight;

      window.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });

      // Reset flag after smooth scroll completes (typically ~500ms)
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 600);
    }
  };

  async function postQuestion(e) {
    try {
      e.preventDefault();
      const _data = {
        pid: data.product._id,
        question: question.current.value.trim(),
      };
      const _r = await postData("/api/question", _data);
      _r.success
        ? (toast.success("질문이 성공적으로 추가되었습니다."), refreshData())
        : toast.error("문제가 발생했습니다. 500");
    } catch (err) {
      console.log(err);
      toast.error(`문제가 발생했습니다. - ${err.message}`);
    }
  }

  useEffect(() => {
    if (data.product) {
      const cl = data.product.colors?.length || 0;
      const al = data.product.attributes?.length || 0;
      if (cl > 0 && al > 0) {
        updatePrice(selectedColor.name, selectedAttribute.name);
      }
      if (cl > 0 && al === 0) {
        updatePrice(selectedColor.name, null);
      }
      if (cl === 0 && al > 0) {
        updatePrice(null, selectedAttribute.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, selectedAttribute]);

  if (error) return <Error500 />;
  if (!data.product) return <Error404 />;

  return (
    <>
      <HeadData
        title={data.product.name}
        seo={data.product.seo}
        url={`product/${data.product.slug}`}
      />
      <div className={classes.productDetails}>
        <div className={" custom_container " + classes.custom_container}>
          {/* Product Slide & Product Detail */}
          <div className={classes.container}>
            <div className={classes.productSlide}>
              <div className={classes.slider}>
                <Carousel
                  showArrows={true}
                  renderArrowPrev={(onClickHandler, hasPrev, label) => (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      aria-label={label}
                      className={
                        classes.btn_slide + " " + classes.btn_slide_prev
                      }
                    >
                      <ArrowLeftIcon />
                    </button>
                  )}
                  renderArrowNext={(onClickHandler, hasNext, label) => (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      aria-label={label}
                      className={
                        classes.btn_slide + " " + classes.btn_slide_next
                      }
                    >
                      <ArrowRightIcon />
                    </button>
                  )}
                  showThumbs={true}
                  showIndicators={false}
                  showStatus={false}
                  renderThumbs={thumbs}
                  preventMovementUntilSwipeScrollTolerance={true}
                  swipeScrollTolerance={50}
                  emulateTouch={true}
                  selectedItem={selectedImage}
                  autoPlay={true}
                  interval={3000}
                  className={classes.carousel}
                >
                  {/* {data.product.gallery.map((item, index) => (
                          <InnerImageZoom
                            key={item.name + index}
                            src={item.url}
                            className={classes.magnifier_container}
                            fullscreenOnMobile={true}
                          />
                        ))} */}
                  {[
                    {
                      url: "/images/review_img_detail.png",
                      name: "image1",
                    },
                    {
                      url: "/images/review_img_detail.png",
                      name: "image2",
                    },
                    {
                      url: "/images/review_img_detail.png",
                      name: "image3",
                    },
                  ].map((item, index) => (
                    <InnerImageZoom
                      key={item.name + index}
                      src={item.url}
                      className={classes.magnifier_container}
                      fullscreenOnMobile={true}
                    />
                  ))}
                </Carousel>
              </div>
              <div className={classes.productRating}>
                <StarRatingIcon /> <span className={classes.rating}>4.93</span>
                <span className={classes.oldRating}>(최근 6개월 4.99)</span>
                <span className={classes.dot}></span>
                <span className={classes.reviewCount}>1,625</span>{" "}
                <ButtonViewMore label="전체보기" onClick={() => {}} />
              </div>
            </div>
            <div className={classes.productDetail}>
              <div className={classes.details}>
                <h1 className={classes.heading}>{data.product.name}</h1>
                <div className={classes.price_container}>
                  <div className={classes.discount}>10%</div>
                  <div className={classes.priceBox}>
                    <p className={classes.priceWrapper}>
                      <span className={classes.oldPrice}>95,000원</span>
                      <span className={classes.price}>85,000원</span>
                    </p>
                    <TruckDelivery label="무료배송" />
                  </div>
                </div>
                {/* Options dropdown */}
                <div>
                  <div className={classes.optionsContainer}>
                    <p className={classes.optionsHeading}>필수 옵션</p>
                    <div className={classes.options}>
                      <DropdownCustom
                        options={[
                          { value: "사이즈1", label: "사이즈1" },
                          { value: "사이즈2", label: "사이즈2" },
                          { value: "사이즈3", label: "사이즈3" },
                          { value: "사이즈4", label: "사이즈4" },
                          { value: "사이즈5", label: "사이즈5" },
                        ]}
                        onChange={() => {}}
                        label="사이즈"
                        width={"442px"}
                      />
                      <DropdownCustom
                        options={[
                          { value: "색상1", label: "색상1" },
                          { value: "색상2", label: "색상2" },
                          { value: "색상3", label: "색상3" },
                          { value: "색상4", label: "색상4" },
                          { value: "색상5", label: "색상5" },
                        ]}
                        onChange={() => {}}
                        label="색상"
                        width={"442px"}
                      />
                    </div>
                  </div>
                  <div className={classes.optionsContainer}>
                    <p className={classes.optionsHeading}>추가 상품</p>
                    <div className={classes.options}>
                      <DropdownCustom
                        options={[
                          { value: "프로그램1", label: "프로그램1" },
                          { value: "프로그램2", label: "프로그램2" },
                          { value: "프로그램3", label: "프로그램3" },
                          { value: "프로그램4", label: "프로그램4" },
                          { value: "프로그램5", label: "프로그램5" },
                        ]}
                        onChange={() => {}}
                        label="프로그램"
                        width={"442px"}
                      />
                      <DropdownCustom
                        options={[
                          { value: "주변 용품1", label: "주변 용품1" },
                          { value: "주변 용품2", label: "주변 용품2" },
                          { value: "주변 용품3", label: "주변 용품3" },
                          { value: "주변 용품4", label: "주변 용품4" },
                          { value: "주변 용품5", label: "주변 용품5" },
                        ]}
                        onChange={() => {}}
                        label="주변 용품"
                        width={"442px"}
                      />
                    </div>
                  </div>
                </div>
                {/* Options selected */}
                <div className={classes.optionSelectedContainer}>
                  <div className={classes.optionSelected}>
                    <p className={classes.optionSelectedHeading}>
                      PD 배터리팩 20000 mAh 베이지(EB-P4520XUEGKR)
                    </p>
                    <div className={classes.optionSelectedInfo}>
                      <div
                        className={classes.productButtons}
                        data-name="Actions"
                      >
                        <button
                          className={classes.btn}
                          onClick={() => () => {}}
                        >
                          -
                        </button>
                        <span className={classes.qty}>1</span>
                        <button
                          className={classes.btn}
                          onClick={() => () => {}}
                        >
                          +
                        </button>
                      </div>
                      <div className={classes.optionPrice}>
                        <p>
                          <span>24,021</span>원
                        </p>
                        <button>
                          <CloseIcon fill="#757575" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={classes.optionSelected}>
                    <p className={classes.optionSelectedHeading}>
                      PD 배터리팩 20000 mAh 베이지(EB-P4520XUEGKR)
                    </p>
                    <div className={classes.optionSelectedInfo}>
                      <div
                        className={classes.productButtons}
                        data-name="Actions"
                      >
                        <button
                          className={classes.btn}
                          onClick={() => () => {}}
                        >
                          -
                        </button>
                        <span className={classes.qty}>1</span>
                        <button
                          className={classes.btn}
                          onClick={() => () => {}}
                        >
                          +
                        </button>
                      </div>
                      <div className={classes.optionPrice}>
                        <p>
                          <span>24,021</span>원
                        </p>
                        <button>
                          <CloseIcon fill="#757575" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Price total */}
                <div className={classes.price_total}>
                  <p className={classes.price_total_heading}>총 상품 금액</p>
                  <p className={classes.price_total_price}>
                    <span className={classes.price_total_qty}>총 수량 2개</span>
                    <p className={classes.price_total_value}>
                      <span>85,000</span>원
                    </p>
                  </p>
                </div>

                {/* Cart action */}
                <div className={classes.cart_action}>
                  <ButtonCustom
                    variant={"primary-outline"}
                    text="장바구니"
                    onClick={() => {
                      addItemToCart();
                    }}
                  />
                  <ButtonCustom
                    variant={"primary"}
                    text="바로 구매하기"
                    onClick={() => {
                      // buyNow();
                      router.push("/checkout");
                    }}
                  />
                </div>
                {/* Product Action */}
                <div className={classes.product_action}>
                  <ButtonCustom
                    variant={"outline"}
                    text="문의하기"
                    style={{
                      fontWeight: "600",
                    }}
                    onClick={() => {}}
                    icon={<MessageIcon />}
                  />
                  <ButtonCustom
                    variant={"outline"}
                    text="찜하기"
                    style={{
                      fontWeight: "600",
                    }}
                    onClick={() => {
                      toggleWishlist();
                    }}
                    icon={<IconHeart />}
                  />
                  <ButtonCustom
                    variant={"outline"}
                    text="공유하기"
                    style={{
                      fontWeight: "600",
                    }}
                    onClick={() => {}}
                    icon={<ShareIcon />}
                  />
                </div>
              </div>
              <div className={classes.detailsMobile}>
                <h1 className={classes.heading}>{data.product.name}</h1>
                <div className={classes.productRatingMobile}>
                  <span className={classes.starIcon}>
                    <StarRatingIcon />
                  </span>
                  <span className={classes.rating}>4.93</span>
                  <span className={classes.oldRating}>(최근 6개월 4.99)</span>
                  <span className={classes.viewMore}>5건 리뷰</span>
                </div>
                <div className={classes.price_container}>
                  <div className={classes.priceBox}>
                    <span className={classes.oldPrice}>95,000원</span>
                    <span className={classes.price}>85,000원</span>
                    <TruckDelivery label="무료배송" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Product Reviews */}
          <div className={classes.productReviews}>
            <ReviewSection />
          </div>
          {/* Related Products */}
          <div className={classes.relatedProducts}>
            <RelatedProductSection title="비슷한 다른 상품" id="similar" />
            <div className={classes.paginationMobile}>10개 더보기</div>
          </div>
          {/* Product Infomation */}
          <div className={classes.productInfomation}>
            <p className={classes.productInfomation_title}>상품정보</p>
            <div className={classes.productInfomation_content}>
              <table className={classes.productInfomation_table}>
                <tr>
                  <td className={classes.tableLabel}>상품번호</td>
                  <td>12312312312313</td>
                  <td className={classes.tableLabel}>상품상태</td>
                  <td>신상품</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel}>제조자(사)</td>
                  <td>골마비(엔에이치)</td>
                  <td className={classes.tableLabel}>브랜드</td>
                  <td>컷슬린</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel}>이벤트</td>
                  <td>리뷰쓰고 얼마 받아가세요</td>
                  <td className={classes.tableLabel}>원산지</td>
                  <td>상세설명에 표시</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel}>제조일자</td>
                  <td>2025.01.01</td>
                  <td className={classes.tableLabel}>유효일자</td>
                  <td>2025.01.01</td>
                </tr>
              </table>
              <table className={classes.productInfomation_table}>
                <tr>
                  <td className={classes.tableLabel}>제품타입</td>
                  <td>정</td>
                  <td className={classes.tableLabel}>섭취방법</td>
                  <td>물과 함께</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel}>섭취대상</td>
                  <td>성인남녀</td>
                  <td className={classes.tableLabel}>섭취횟수</td>
                  <td>하루 한 번</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel}>이벤트</td>
                  <td>리뷰쓰고 얼마 받아가세요</td>
                  <td className={classes.tableLabel}>제품용량</td>
                  <td>3개월 분</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel}>주요 기능성</td>
                  <td>체지방 감량에 도움</td>
                  <td className={classes.tableLabel}>영양소 원료명</td>
                  <td>
                    비타민 B1, 비타민 B2, 나이아신, 판토텐산, 비타민 B1, 비타민
                    B2, 나이아신, 판토텐산
                  </td>
                </tr>
              </table>
              <table className={classes.productInfomation_table}>
                <tr>
                  <td className={classes.tableLabel}>영수증발급</td>
                  <td colSpan={2}>신용카드 전표, 현금영수증 발급</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel}>A/S안내</td>
                  <td colSpan={2}>상세정보 확인</td>
                </tr>
                <tr>
                  <td className={classes.tableLabel} rowSpan={2}>
                    인증정보
                  </td>
                  <td>
                    <span style={{ color: "#121212" }}>
                      [GMP]우수건강기능식품제조기준_국가인증-서울지방식품의약품안전청장
                    </span>
                    <br />
                    <span style={{ color: "#121212" }}>10101020301010</span>
                    <br />
                    <span style={{ color: "#949494", fontSize: "12px" }}>
                      구매전 인증번호를 꼭 확인하세요.
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#121212" }}>
                      서울지방식품의약품안전청에서 인증한 우수 건강기능식품 제조
                      기준에 대한 정보입니다.{" "}
                    </span>
                    <br />
                    <span style={{ color: "#121212" }}>10101020301010 </span>
                    <br />
                    <span style={{ color: "#949494", fontSize: "12px" }}>
                      구매전 인증번호를 꼭 확인하세요.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    +해당 인증정보는 판매자가 등록한 것으로 등록 정보에 대한
                    일체의 책임은 판매자에게 있습니다.
                  </td>
                </tr>
              </table>
            </div>
          </div>
          {/* Product tabs */}
          <div className={classes.productTabs} ref={productTabsRef}>
            <div className={classes.tabs}>
              <div
                className={`${classes.tab} ${
                  activeTab === "detail" ? classes.active : ""
                }`}
                onClick={() => handleTabClick("detail")}
              >
                상세 정보
              </div>

              <div
                className={`${classes.tab} ${
                  activeTab === "review" ? classes.active : ""
                }`}
                onClick={() => handleTabClick("review")}
              >
                리뷰 <span className={classes.count}>12,242</span>
              </div>

              <div
                className={`${classes.tab} ${
                  activeTab === "qna" ? classes.active : ""
                }`}
                onClick={() => handleTabClick("qna")}
              >
                Q&amp;A <span className={classes.count}>8,449</span>
              </div>

              <div
                className={`${classes.tab} ${
                  activeTab === "return" ? classes.active : ""
                }`}
                onClick={() => handleTabClick("return")}
              >
                반품 / 교환정보
              </div>
            </div>
            <div ref={tabDetailRef}>
              <ProductTabDetail />
            </div>
            <div ref={tabReviewRef}>
              <ProductTabReview />
            </div>
            <div ref={tabQnaRef}>
              <ProductTabQna />
            </div>
            <div ref={tabReturnRef}>
              <ProductTabReturn />
            </div>
          </div>

          {/* Navigation Mobile */}
          <div className={classes.navigationMobile}>
            <ul>
              {[
                "상품정보",
                "상품정보 제공고시",
                "거래조건에 관한 정보",
                "반품 교환 정보",
                "주의사항",
              ].map((item, index) => (
                <li key={index}>
                  {item}{" "}
                  <span>
                    <ArrowDownIcon />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Button Bottom Mobile */}
          <div className={classes.buttonBottomMobile}>
            <div className={classes.product_action_mobile}>
              <ButtonCustom
                variant={"outline"}
                text=""
                onClick={() => {}}
                icon={<MessageIcon />}
              />
              <ButtonCustom
                variant={"outline"}
                text=""
                onClick={() => {
                  toggleWishlist();
                }}
                icon={<IconHeart />}
              />
              <ButtonCustom
                variant={"outline"}
                text=""
                onClick={() => {}}
                className={classes.btnShare}
                icon={<ShareIcon />}
              />
            </div>
            <div className={classes.cart_action_mobile}>
              <ButtonCustom
                variant={"primary-outline"}
                text="장바구니"
                onClick={() => {
                  // addItemToCart();
                  setOpenBottomSheet(true);
                }}
              />
              <ButtonCustom
                variant={"primary"}
                text="바로 구매하기"
                onClick={() => {
                  // buyNow();
                  setOpenBottomSheet(true);
                }}
              />
            </div>
          </div>
        </div>
        <BottomSheet
          open={openBottomSheet}
          onClose={() => setOpenBottomSheet(false)}
          content={
            <div className={classes.bottomSheetContent}>
              {/* Options dropdown */}
              <div>
                <div className={classes.optionsContainer}>
                  <p className={classes.optionsHeading}>필수 옵션</p>
                  <div className={classes.options}>
                    <DropdownCustom
                      options={[
                        { value: "사이즈1", label: "사이즈1" },
                        { value: "사이즈2", label: "사이즈2" },
                        { value: "사이즈3", label: "사이즈3" },
                        { value: "사이즈4", label: "사이즈4" },
                        { value: "사이즈5", label: "사이즈5" },
                      ]}
                      onChange={() => {}}
                      label="사이즈"
                      width={"100%"}
                    />
                    <DropdownCustom
                      options={[
                        { value: "색상1", label: "색상1" },
                        { value: "색상2", label: "색상2" },
                        { value: "색상3", label: "색상3" },
                        { value: "색상4", label: "색상4" },
                        { value: "색상5", label: "색상5" },
                      ]}
                      onChange={() => {}}
                      label="색상"
                      width={"100%"}
                    />
                  </div>
                </div>
                <div className={classes.optionsContainer}>
                  <p className={classes.optionsHeading}>추가 상품</p>
                  <div className={classes.options}>
                    <DropdownCustom
                      options={[
                        { value: "프로그램1", label: "프로그램1" },
                        { value: "프로그램2", label: "프로그램2" },
                        { value: "프로그램3", label: "프로그램3" },
                        { value: "프로그램4", label: "프로그램4" },
                        { value: "프로그램5", label: "프로그램5" },
                      ]}
                      onChange={() => {}}
                      label="프로그램"
                      width={"100%"}
                    />
                    <DropdownCustom
                      options={[
                        { value: "주변 용품1", label: "주변 용품1" },
                        { value: "주변 용품2", label: "주변 용품2" },
                        { value: "주변 용품3", label: "주변 용품3" },
                        { value: "주변 용품4", label: "주변 용품4" },
                        { value: "주변 용품5", label: "주변 용품5" },
                      ]}
                      onChange={() => {}}
                      label="주변 용품"
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>
              {/* Options selected */}
              <div className={classes.optionSelectedContainer}>
                <div className={classes.optionSelected}>
                  <p className={classes.optionSelectedHeading}>
                    PD 배터리팩 20000 mAh 베이지(EB-P4520XUEGKR)
                  </p>
                  <div className={classes.optionSelectedInfo}>
                    <div className={classes.productButtons} data-name="Actions">
                      <button className={classes.btn} onClick={() => () => {}}>
                        -
                      </button>
                      <span className={classes.qty}>1</span>
                      <button className={classes.btn} onClick={() => () => {}}>
                        +
                      </button>
                    </div>
                    <div className={classes.optionPrice}>
                      <p>
                        <span>24,021</span>원
                      </p>
                      <button>
                        <CloseIcon fill="#757575" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={classes.optionSelected}>
                  <p className={classes.optionSelectedHeading}>
                    PD 배터리팩 20000 mAh 베이지(EB-P4520XUEGKR)
                  </p>
                  <div className={classes.optionSelectedInfo}>
                    <div className={classes.productButtons} data-name="Actions">
                      <button className={classes.btn} onClick={() => () => {}}>
                        -
                      </button>
                      <span className={classes.qty}>1</span>
                      <button className={classes.btn} onClick={() => () => {}}>
                        +
                      </button>
                    </div>
                    <div className={classes.optionPrice}>
                      <p>
                        <span>24,021</span>원
                      </p>
                      <button>
                        <CloseIcon fill="#757575" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Price total */}
              <div className={classes.price_total}>
                <p className={classes.price_total_heading}>총 수량 2개</p>
                <p className={classes.price_total_price}>
                  <p className={classes.price_total_value}>
                    <span>85,000</span>원
                  </p>
                </p>
              </div>
            </div>
          }
          action={
            <div className={classes.bottomSheetAction}>
              <div className={classes.cart_action}>
                <ButtonCustom
                  variant={"primary-outline"}
                  text="장바구니"
                  onClick={() => {
                    addItemToCart();
                  }}
                />
                <ButtonCustom
                  variant={"primary"}
                  text="바로 구매하기"
                  onClick={() => {
                    // buyNow();
                    router.push("/checkout");
                  }}
                />
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}

function EmptyContent({ icon, text }) {
  return (
    <div className={classes.empty_content}>
      <div className={classes.empty_icon}>{icon}</div>
      <div className={classes.empty_text}>{text}</div>
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, query }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const _data = await productDetailsData(query.name);
      const data = JSON.parse(JSON.stringify(_data));
      if (data.success) {
        setSettingsData(store, data);
      }
      return {
        props: {
          data,
          error: !data.success,
        },
      };
    }
);

export default ProductDetailsPage;
ProductDetailsPage.footer = false;
ProductDetailsPage.headerBack = true;
ProductDetailsPage.headerBackText = "삼성전자";

const ArrowLeftIcon = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          d="M30 36L18 24L30 12"
          stroke="#DDDDDD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};

const ArrowRightIcon = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          d="M18 36L30 24L18 12"
          stroke="#DDDDDD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};
export const StarRatingIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_797_36135)">
      <path
        d="M14.3753 4.92394C14.4261 4.8 14.5126 4.69397 14.6239 4.61935C14.7351 4.54473 14.866 4.50488 15 4.50488C15.1339 4.50488 15.2649 4.54473 15.3761 4.61935C15.4874 4.69397 15.5739 4.8 15.6247 4.92394L18.1775 11.064C18.2253 11.1789 18.3039 11.2784 18.4046 11.3515C18.5052 11.4246 18.6241 11.4686 18.7482 11.4785L25.3772 12.0095C25.9767 12.0575 26.2193 12.806 25.7628 13.1964L20.7124 17.5236C20.618 17.6043 20.5477 17.7095 20.5091 17.8275C20.4706 17.9455 20.4652 18.0719 20.4937 18.1928L22.0375 24.662C22.0685 24.7918 22.0604 24.9279 22.0141 25.053C21.9678 25.1782 21.8855 25.2869 21.7775 25.3653C21.6696 25.4437 21.5408 25.4884 21.4074 25.4936C21.2741 25.4989 21.1422 25.4645 21.0283 25.3948L15.352 21.929C15.246 21.8642 15.1242 21.8299 15 21.8299C14.8758 21.8299 14.754 21.8642 14.648 21.929L8.97166 25.396C8.85784 25.4657 8.72592 25.5001 8.59258 25.4948C8.45924 25.4896 8.33044 25.4449 8.22246 25.3665C8.11448 25.2881 8.03216 25.1794 7.9859 25.0542C7.93963 24.9291 7.9315 24.793 7.96253 24.6632L9.50625 18.1928C9.53488 18.0719 9.52962 17.9455 9.49104 17.8274C9.45247 17.7094 9.38207 17.6043 9.28761 17.5236L4.23716 13.1964C4.13546 13.1097 4.06177 12.9948 4.02544 12.8662C3.9891 12.7376 3.99175 12.6011 4.03304 12.474C4.07433 12.3469 4.15242 12.2349 4.25741 12.1522C4.36239 12.0695 4.48956 12.0198 4.62279 12.0095L11.2518 11.4785C11.3758 11.4686 11.4947 11.4246 11.5954 11.3515C11.6961 11.2784 11.7747 11.1789 11.8224 11.064L14.3753 4.92394Z"
        fill="#A16BFF"
      />
      <path
        d="M14.3753 4.92394C14.4261 4.8 14.5126 4.69397 14.6239 4.61935C14.7351 4.54473 14.866 4.50488 15 4.50488C15.1339 4.50488 15.2649 4.54473 15.3761 4.61935C15.4874 4.69397 15.5739 4.8 15.6247 4.92394L18.1775 11.064C18.2253 11.1789 18.3039 11.2784 18.4046 11.3515C18.5052 11.4246 18.6241 11.4686 18.7482 11.4785L25.3772 12.0095C25.9767 12.0575 26.2193 12.806 25.7628 13.1964L20.7124 17.5236C20.618 17.6043 20.5477 17.7095 20.5091 17.8275C20.4706 17.9455 20.4652 18.0719 20.4937 18.1928L22.0375 24.662C22.0685 24.7918 22.0604 24.9279 22.0141 25.053C21.9678 25.1782 21.8855 25.2869 21.7775 25.3653C21.6696 25.4437 21.5408 25.4884 21.4074 25.4936C21.2741 25.4989 21.1422 25.4645 21.0283 25.3948L15.352 21.929C15.246 21.8642 15.1242 21.8299 15 21.8299C14.8758 21.8299 14.754 21.8642 14.648 21.929L8.97166 25.396C8.85784 25.4657 8.72592 25.5001 8.59258 25.4948C8.45924 25.4896 8.33044 25.4449 8.22246 25.3665C8.11448 25.2881 8.03216 25.1794 7.9859 25.0542C7.93963 24.9291 7.9315 24.793 7.96253 24.6632L9.50625 18.1928C9.53488 18.0719 9.52962 17.9455 9.49104 17.8274C9.45247 17.7094 9.38207 17.6043 9.28761 17.5236L4.23716 13.1964C4.13546 13.1097 4.06177 12.9948 4.02544 12.8662C3.9891 12.7376 3.99175 12.6011 4.03304 12.474C4.07433 12.3469 4.15242 12.2349 4.25741 12.1522C4.36239 12.0695 4.48956 12.0198 4.62279 12.0095L11.2518 11.4785C11.3758 11.4686 11.4947 11.4246 11.5954 11.3515C11.6961 11.2784 11.7747 11.1789 11.8224 11.064L14.3753 4.92394Z"
        fill="url(#paint0_linear_797_36135)"
        fill-opacity="0.8"
      />
    </g>
    <path
      d="M14.3753 4.92394C14.4261 4.8 14.5126 4.69397 14.6239 4.61935C14.7351 4.54473 14.866 4.50488 15 4.50488C15.1339 4.50488 15.2649 4.54473 15.3761 4.61935C15.4874 4.69397 15.5739 4.8 15.6247 4.92394L18.1775 11.064C18.2253 11.1789 18.3039 11.2784 18.4046 11.3515C18.5052 11.4246 18.6241 11.4686 18.7482 11.4785L25.3772 12.0095C25.9767 12.0575 26.2193 12.806 25.7628 13.1964L20.7124 17.5236C20.618 17.6043 20.5477 17.7095 20.5091 17.8275C20.4706 17.9455 20.4652 18.0719 20.4937 18.1928L22.0375 24.662C22.0685 24.7918 22.0604 24.9279 22.0141 25.053C21.9678 25.1782 21.8855 25.2869 21.7775 25.3653C21.6696 25.4437 21.5408 25.4884 21.4074 25.4936C21.2741 25.4989 21.1422 25.4645 21.0283 25.3948L15.352 21.929C15.246 21.8642 15.1242 21.8299 15 21.8299C14.8758 21.8299 14.754 21.8642 14.648 21.929L8.97166 25.396C8.85784 25.4657 8.72592 25.5001 8.59258 25.4948C8.45924 25.4896 8.33044 25.4449 8.22246 25.3665C8.11448 25.2881 8.03216 25.1794 7.9859 25.0542C7.93963 24.9291 7.9315 24.793 7.96253 24.6632L9.50625 18.1928C9.53488 18.0719 9.52962 17.9455 9.49104 17.8274C9.45247 17.7094 9.38207 17.6043 9.28761 17.5236L4.23716 13.1964C4.13546 13.1097 4.06177 12.9948 4.02544 12.8662C3.9891 12.7376 3.99175 12.6011 4.03304 12.474C4.07433 12.3469 4.15242 12.2349 4.25741 12.1522C4.36239 12.0695 4.48956 12.0198 4.62279 12.0095L11.2518 11.4785C11.3758 11.4686 11.4947 11.4246 11.5954 11.3515C11.6961 11.2784 11.7747 11.1789 11.8224 11.064L14.3753 4.92394Z"
      fill="#A16BFF"
    />
    <path
      d="M14.3753 4.92394C14.4261 4.8 14.5126 4.69397 14.6239 4.61935C14.7351 4.54473 14.866 4.50488 15 4.50488C15.1339 4.50488 15.2649 4.54473 15.3761 4.61935C15.4874 4.69397 15.5739 4.8 15.6247 4.92394L18.1775 11.064C18.2253 11.1789 18.3039 11.2784 18.4046 11.3515C18.5052 11.4246 18.6241 11.4686 18.7482 11.4785L25.3772 12.0095C25.9767 12.0575 26.2193 12.806 25.7628 13.1964L20.7124 17.5236C20.618 17.6043 20.5477 17.7095 20.5091 17.8275C20.4706 17.9455 20.4652 18.0719 20.4937 18.1928L22.0375 24.662C22.0685 24.7918 22.0604 24.9279 22.0141 25.053C21.9678 25.1782 21.8855 25.2869 21.7775 25.3653C21.6696 25.4437 21.5408 25.4884 21.4074 25.4936C21.2741 25.4989 21.1422 25.4645 21.0283 25.3948L15.352 21.929C15.246 21.8642 15.1242 21.8299 15 21.8299C14.8758 21.8299 14.754 21.8642 14.648 21.929L8.97166 25.396C8.85784 25.4657 8.72592 25.5001 8.59258 25.4948C8.45924 25.4896 8.33044 25.4449 8.22246 25.3665C8.11448 25.2881 8.03216 25.1794 7.9859 25.0542C7.93963 24.9291 7.9315 24.793 7.96253 24.6632L9.50625 18.1928C9.53488 18.0719 9.52962 17.9455 9.49104 17.8274C9.45247 17.7094 9.38207 17.6043 9.28761 17.5236L4.23716 13.1964C4.13546 13.1097 4.06177 12.9948 4.02544 12.8662C3.9891 12.7376 3.99175 12.6011 4.03304 12.474C4.07433 12.3469 4.15242 12.2349 4.25741 12.1522C4.36239 12.0695 4.48956 12.0198 4.62279 12.0095L11.2518 11.4785C11.3758 11.4686 11.4947 11.4246 11.5954 11.3515C11.6961 11.2784 11.7747 11.1789 11.8224 11.064L14.3753 4.92394Z"
      fill="url(#paint1_linear_797_36135)"
      fill-opacity="0.8"
    />
    <defs>
      <filter
        id="filter0_f_797_36135"
        x="0"
        y="0.504883"
        width="30"
        height="28.9902"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="2"
          result="effect1_foregroundBlur_797_36135"
        />
      </filter>
      <linearGradient
        id="paint0_linear_797_36135"
        x1="15"
        y1="13.3346"
        x2="15"
        y2="25.4953"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" stop-opacity="0" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_797_36135"
        x1="15"
        y1="13.3346"
        x2="15"
        y2="25.4953"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" stop-opacity="0" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
    </defs>
  </svg>
);
