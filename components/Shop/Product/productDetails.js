import customId from "custom-id-new";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import useSWR from "swr";
import ImageLoader from "~/components/Image";
import { fetchData, formatNumber, stockInfo } from "~/lib/clientFunctions";
import { addToCart, addVariableProductToCart } from "~/redux/cart.slice";
import Spinner from "../../Ui/Spinner";
import classes from "./productDetails.module.css";
import { useTranslation } from "react-i18next";
import { _simpleProductCart, _variableProductCart } from "~/lib/cartHandle";

const Carousel = dynamic(() =>
  import("react-responsive-carousel").then((com) => com.Carousel)
);

const ProductDetails = (props) => {
  const url = `/api/product/${props.productSlug}`;
  const { data, error } = useSWR(url, fetchData);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState({
    name: null,
    value: null,
  });
  const [selectedAttribute, setSelectedAttribute] = useState({
    name: null,
    value: null,
    for: null,
  });
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const quantityAmount = useRef();
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.product) {
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
    if (data && data.product) {
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

  if (error) return <div className="text-danger">failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.product) return <div>문제가 발생했습니다....</div>;

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

  const checkVariantInfo = (color_name, attr_name) => {
    const colorName = color_name || selectedColor.name;
    const attrName = attr_name || selectedAttribute.name;
    return data.product.variants.find(
      (item) => item.color === colorName && item.attr === attrName
    );
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
    const qty = Number(quantityAmount.current.value);
    if (data.product.type === "simple") {
      simpleProductCart(qty);
    } else {
      variableProductCart(qty);
    }
  };

  const thumbs = () => {
    const thumbList = data.product.gallery.map((item, index) => (
      <ImageLoader
        key={item.name + index}
        src={item.url}
        alt={data.product.name}
        width={67}
        height={67}
        style={{ width: "100%", height: "auto" }}
      />
    ));
    return thumbList;
  };

  return (
    <div className={classes.container}>
      <div className="row">
        <div className="col-lg-6 p-0">
          <div className={classes.slider}>
            <div className={classes.image_container_main}>
              <Carousel
                showArrows={false}
                showThumbs={true}
                showIndicators={false}
                renderThumbs={thumbs}
                showStatus={false}
                emulateTouch={true}
                preventMovementUntilSwipeScrollTolerance={true}
                swipeScrollTolerance={50}
                selectedItem={selectedImage}
              >
                {data.product.gallery.map((item, index) => (
                  <InnerImageZoom
                    key={item.name + index}
                    src={item.url}
                    className={classes.magnifier_container}
                    fullscreenOnMobile={true}
                  />
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className="col-lg-6 p-0">
          <div className={classes.details}>
            <p className={classes.unit}>{data.product.brand}</p>
            <h1 className={classes.heading}>{data.product.name}</h1>
            <hr />
            <div className={classes.price_container}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {data.product.discount < data.product.price && (
                  <p className={classes.price_ori}>
                    {formatNumber(data.product.price)}원
                  </p>
                )}
                <p className={classes.price}>{formatNumber(price)}원</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "22px",
                }}
              >
                <p className={classes.sales}> 1,238 Sold </p>

                <p className={classes.rating}>
                  <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.04894 0.927052C9.3483 0.00574112 10.6517 0.00573993 10.9511 0.927051L12.4697 5.60081C12.6035 6.01284 12.9875 6.2918 13.4207 6.2918H18.335C19.3037 6.2918 19.7065 7.53141 18.9228 8.10081L14.947 10.9894C14.5966 11.244 14.4499 11.6954 14.5838 12.1074L16.1024 16.7812C16.4017 17.7025 15.3472 18.4686 14.5635 17.8992L10.5878 15.0106C10.2373 14.756 9.7627 14.756 9.41221 15.0106L5.43648 17.8992C4.65276 18.4686 3.59828 17.7025 3.89763 16.7812L5.41623 12.1074C5.55011 11.6954 5.40345 11.244 5.05296 10.9894L1.07722 8.10081C0.293507 7.53141 0.696283 6.2918 1.66501 6.2918H6.57929C7.01252 6.2918 7.39647 6.01284 7.53035 5.60081L9.04894 0.927052Z"
                      fill="#FFA439"
                    />
                  </svg>
                  4.5
                </p>
              </div>
            </div>
            <p style={{ fontWeight: "bold" }}>설명:</p>
            <p
              className={` ${isExpanded ? "line-clamp-none" : ""} ${
                classes.description
              }`}
            >
              {isExpanded
                ? data.product.shortDescription
                : data.product.shortDescription.slice(0, 200)}
              {!isExpanded && data.product.shortDescription.length > 200 && (
                <span
                  className={classes.seeMore}
                  onClick={() => setIsExpanded(true)}
                >
                  ... 더 보기
                </span>
              )}
            </p>
            {data.product.type === "variable" && (
              <div>
                {data.product.colors.length > 0 && (
                  <div className={classes.color_selector}>
                    <p
                      className={classes.section_heading}
                      style={{ marginBottom: "11px" }}
                    >
                      {t("색상")}: {selectedColor.name}
                    </p>
                    <div className={classes.color_selector_container}>
                      {data.product.colors.map((color, i) => (
                        <div
                          className={classes.circle_outer}
                          key={i}
                          onClick={() => changeColor(color)}
                          title={color.name}
                        >
                          <label
                            data-selected={color.value === selectedColor.value}
                            style={{ backgroundColor: color.value }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.product.attributes.length > 0 && (
                  <div>
                    <p className={classes.section_heading}>
                      {data.product.attributes[0]?.for}
                      {": "}
                      {selectedAttribute.name}
                    </p>
                    <div className={classes.select}>
                      {data.product.attributes.map((attr, i) => (
                        <span
                          key={i}
                          className={classes.attr}
                          onClick={() => changeVariant(attr)}
                          data-selected={attr.label === selectedAttribute.name}
                        >
                          {attr.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className={classes.cart_section}>
              <p className={classes.section_heading}>QTY</p>
              <div className={classes.number_input}>
                <button
                  onClick={stepDownQty}
                  className={classes.minus}
                ></button>
                <input
                  className={classes.quantity}
                  ref={quantityAmount}
                  min="1"
                  max={
                    data.product.quantity === -1
                      ? 100000
                      : data.product.quantity
                  }
                  defaultValue="1"
                  type="number"
                  disabled
                />
                <button onClick={stepUpQty} className={classes.plus}></button>
              </div>
              <div className={classes.button_container}>
                {stockInfo(data.product) ? (
                  <button
                    className={classes.cart_button}
                    onClick={() => addItemToCart()}
                  >
                    {t("장바구니")}
                  </button>
                ) : (
                  <button className={classes.cart_button} disabled>
                    {t("재고 없음")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
