import { Filter } from "@styled-icons/bootstrap/Filter";
import React, { useEffect, useState } from "react";
import BrandList from "./brand";
import ShortMenu from "./ShortMenu";
import SidebarCategoryList from "./category";
import c from "./sidebarList.module.css";
import { XLg } from "@styled-icons/bootstrap";
import { useTranslation } from "react-i18next";
import PriceRange from "./priceFilter";
import ColorFilter from "./colorFilter";
import { RatingFilter } from "./ratingFilter";
import AccordionSidebar from "~/components/Ui/AccordionSidebar";
import RatingRangeSlider from "./ratingRangeFilter";

function SidebarList(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);
  const { t } = useTranslation();
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

  return (
    <>
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
        <h4>{t("filter")}</h4>
        <XLg width={25} height={25} onClick={toggleFilter} />
      </div>
      <div
        className={`${c.sidebar} ${sidebarOpen ? c.s_left : ""} ${
          hideTopBar ? c.sidebar_top_scroll : c.sidebar_top_normal
        }`}
      >
        <div className={c.sidebar_label}>
          <label>{t("카테고리 필터")}</label>
          <div style={{ cursor: "pointer" }}>
            {" "}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.75 6.44444L4.75 2M4.75 18L4.75 10M15.25 18L15.25 10M10 18V13.5556M10 10V2M15.25 6.44444L15.25 2M3 6.44444H6.5M8.25 13.5556H11.75M13.5 6.44444H17"
                stroke="#807D7E"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className={c.sidebar_inner}>
          {/* category menu */}
          <div className={c.category_item}>
            <SidebarCategoryList
              category={props.category}
              updateCategory={props.updateCategory}
              updateSubCategory={props.updateSubCategory}
              updateChildCategory={props.updateChildCategory}
            />
          </div>
        </div>
        {/* Price */}
        {/* <AccordionSidebar title={t("가격 범위")}>
          <PriceRange
            min={props.priceRange?.min || 0}
            max={Math.round(props.priceRange?.max + 1 || 1)}
            onChange={props.updatePriceRange}
          />
        </AccordionSidebar> */}
        {/* Color */}
        {/* <AccordionSidebar title={t("색상 선택")}>
          <ColorFilter onChange={props.updateColors} />
        </AccordionSidebar>{" "} */}
        {/* Rating */}
        {/* <AccordionSidebar title={t("별점 범위")}>
          <RatingRangeSlider
            min={props.ratingRange?.min || 0.0}
            max={props.ratingRange?.max || 5.0}
            onChange={props.updateRatingRange}
          />
        </AccordionSidebar> */}
      </div>
    </>
  );
}

export default React.memo(SidebarList);
