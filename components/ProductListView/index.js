import { CaretLeft, CaretRight } from "@styled-icons/bootstrap";
import { useEffect, useRef, useState } from "react";
import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductSpecial from "../Shop/ProductSpecial/productSpecial";
import c from "./productList.module.css";
import useOnScreen from "~/utils/useOnScreen";
import { toast } from "react-toastify";
import { fetchData } from "~/lib/clientFunctions";
import Spinner from "../Ui/Spinner";
import { ArrowUpRightCircle } from "@styled-icons/bootstrap";
import { ArrowUpRightCircleFill } from "@styled-icons/bootstrap";
import { ArrowUpLeftCircle } from "@styled-icons/bootstrap";
import ProductRegular from "../Shop/ProductRegular/productRegular";

const breakpointNewArrival = {
  320: {
    slidesPerView: 1.5,
  },
  480: {
    slidesPerView: 2,
  },
  675: {
    slidesPerView: 3,
  },
  880: {
    slidesPerView: 4,
  },
  1100: {
    slidesPerView: 5,
  },
};

function ProductList(props) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [productList, setProductList] = useState([]);
  const current = useRef();
  const onViewPort = useOnScreen(current);

  async function loadData() {
    try {
      const url = `/api/home/products?type=${props.type}`;
      const resp = await fetchData(url);
      resp.success
        ? setProductList(resp.products || [])
        : toast.error("문제가 발생했습니다.");
    } catch (err) {
      console.log(err);
      toast.error("문제가 발생했습니다.");
    }
    setLoaded(true);
  }

  useEffect(() => {
    if (onViewPort && !loaded) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onViewPort]);

  return (
    <div className="content_container" ref={current}>
      <div className="custom_container">
        <div className={c.head_container}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {" "}
            <p className={c.head_subtitle}>
              {props.subtitle && (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="transparent"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_163_10383)">
                      <path
                        d="M8.1225 8.21594L6.7625 4.68031C6.74209 4.62725 6.70608 4.58163 6.65922 4.54944C6.61236 4.51726 6.55685 4.50003 6.5 4.50003C6.44315 4.50003 6.38764 4.51726 6.34078 4.54944C6.29392 4.58163 6.25791 4.62725 6.2375 4.68031L4.8775 8.21594C4.86337 8.25267 4.84169 8.28603 4.81386 8.31386C4.78603 8.34169 4.75267 8.36337 4.71594 8.3775L1.18031 9.7375C1.12725 9.75791 1.08163 9.79392 1.04944 9.84078C1.01726 9.88764 1.00003 9.94315 1.00003 10C1.00003 10.0568 1.01726 10.1124 1.04944 10.1592C1.08163 10.2061 1.12725 10.2421 1.18031 10.2625L4.71594 11.6225C4.75267 11.6366 4.78603 11.6583 4.81386 11.6861C4.84169 11.714 4.86337 11.7473 4.8775 11.7841L6.2375 15.3197C6.25791 15.3727 6.29392 15.4184 6.34078 15.4506C6.38764 15.4827 6.44315 15.5 6.5 15.5C6.55685 15.5 6.61236 15.4827 6.65922 15.4506C6.70608 15.4184 6.74209 15.3727 6.7625 15.3197L8.1225 11.7841C8.13663 11.7473 8.15831 11.714 8.18614 11.6861C8.21397 11.6583 8.24733 11.6366 8.28406 11.6225L11.8197 10.2625C11.8727 10.2421 11.9184 10.2061 11.9506 10.1592C11.9827 10.1124 12 10.0568 12 10C12 9.94315 11.9827 9.88764 11.9506 9.84078C11.9184 9.79392 11.8727 9.75791 11.8197 9.7375L8.28406 8.3775C8.24733 8.36337 8.21397 8.34169 8.18614 8.31386C8.15831 8.28603 8.13663 8.25267 8.1225 8.21594ZM3.375 2.125L2.75 0.5L2.125 2.125L0.5 2.75L2.125 3.375L2.75 5L3.375 3.375L5 2.75L3.375 2.125ZM13.3334 3.66656L12.5 1.5L11.6666 3.66656L9.5 4.5L11.6666 5.33344L12.5 7.5L13.3334 5.33344L15.5 4.5L13.3334 3.66656Z"
                        stroke="#FF0080"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_163_10383">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {props.subtitle}
                </>
              )}
            </p>
            <h2 className={c.head_title}>{props.title}</h2>{" "}
          </div>
        </div>
        {!loaded && (
          <div className={c.loader}>
            <Spinner />
          </div>
        )}
        {productList.length > 0 && (
          <div className="navigation-wrapper">
            <Swiper
              modules={[Navigation, A11y, Autoplay]}
              spaceBetween={20}
              slidesPerView="auto"
              navigation={{ prevEl, nextEl }}
              breakpoints={breakpointNewArrival}
              className="_feature_slider"
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                waitForTransition: true,
              }}
              loop={false}
              centeredSlides={false}
              centerInsufficientSlides={true}
              speed={900}
            >
              {props.productType === "regular" && (
                <>
                  {productList.map((item, index) => (
                    <SwiperSlide key={item._id} className={c.container}>
                      <>
                        <ProductRegular
                          product={item}
                          button
                          link={`/?slug=${item.slug}`}
                          layout={"text-start"}
                          border
                        />
                        <div
                          style={{
                            height: "50px",
                          }}
                        ></div>
                        {productList[index * 2 + 1] && (
                          <ProductRegular
                            product={productList[index * 2 + 1]}
                            button
                            link={`/?slug=${productList[index * 2 + 1].slug}`}
                            layout={"text-start"}
                            border
                          />
                        )}
                      </>
                    </SwiperSlide>
                  ))}
                </>
              )}
              {props.productType !== "regular" && (
                <>
                  {productList.map((item) => (
                    <SwiperSlide key={item._id} className={c.container}>
                      <ProductSpecial
                        product={item}
                        button
                        link={`/?slug=${item.slug}`}
                        layout={"text-start"}
                        border
                      />
                    </SwiperSlide>
                  ))}
                </>
              )}
            </Swiper>
            {/* <div
              className="swiper-button-prev arrow arrow--left"
              ref={(node) => setPrevEl(node)}
            >
              <CaretLeft width={17} height={17} />
            </div>
            <div
              className="swiper-button-next arrow arrow--right"
              ref={(node) => setNextEl(node)}
            >
              <CaretRight width={17} height={17} />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
