import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import HeadData from "~/components/Head";
import classes from "./products.module.css";
import { useTranslation } from "react-i18next";
import SidebarFilter from "~/components/Layout/Client/sidebarFilter";
import ProductItem from "~/components/ProductItem/productItem";
import DropdownCustom from "~/components/DropdownCustom/dropdownCustom";
import SidebarFilterMobile from "~/components/Layout/Client/sidebarFilterMobile";

function Products() {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("전체상품");

  const product = {
    image: "/images/product_item.png",
    name: "MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L",
    oldPrice: 110002,
    newPrice: 89002,
    discount: 25,
    rating: 4.7,
    reviews: 2341,
  };
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [productBasic, setProductBasic] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
      setProductBasic(window.innerWidth <= 750);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <HeadData />

      <div className={classes.content_container + " bg_star"}>
        <div className={`${classes.custom_container} custom_container`}>
          <div
            className={`${classes.section} ${classes.section_products_list}`}
          >
            {/* Filter */}
            <div className={classes.filters}>
              <div className={classes.filterContainer}>
                <div
                  className={`${classes.filterItem} ${
                    activeFilter === "전체상품" ? classes.active : ""
                  }`}
                  onClick={() => setActiveFilter("전체상품")}
                >
                  <span>전체상품</span>
                </div>
                <div className={classes.filterDivider}></div>
                <div
                  className={`${classes.filterItem} ${
                    activeFilter === "특별상품" ? classes.active : ""
                  }`}
                  onClick={() => setActiveFilter("특별상품")}
                >
                  <span>특별상품</span>
                </div>
                <div className={classes.filterDivider}></div>
                <div
                  className={`${classes.filterItem} ${
                    activeFilter === "일반상품" ? classes.active : ""
                  }`}
                  onClick={() => setActiveFilter("일반상품")}
                >
                  <span>일반상품</span>
                </div>
              </div>
            </div>
            <div className={classes.section_products}>
              {[
                { ...product, id: 1 },
                { ...product, id: 2 },
                { ...product, id: 3 },
                { ...product, id: 4 },
                { ...product, id: 5 },
                { ...product, id: 6 },
                { ...product, id: 7 },
                { ...product, id: 8 },
                { ...product, id: 9 },
                { ...product, id: 10 },
                { ...product, id: 11 },
                { ...product, id: 12 },
                { ...product, id: 13 },
                { ...product, id: 14 },
                { ...product, id: 15 },
                { ...product, id: 16 },
                { ...product, id: 17 },
                { ...product, id: 18 },
              ].map((product, index) => (
                <div key={product.id} className={classes.card}>
                  <ProductItem
                    key={product.id}
                    tag={
                      activeFilter === "전체상품"
                        ? index === 0
                          ? "special"
                          : index === 1
                          ? "general"
                          : ""
                        : ""
                    }
                    product={product}
                    size="sm"
                    basic={productBasic}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
