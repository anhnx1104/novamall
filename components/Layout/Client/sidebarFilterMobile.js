import React from "react";
import styles from "./sidebarFilterMobile.module.css";
import DropdownCustom from "~/components/DropdownCustom/dropdownCustom";

export default function SidebarFilterMobile({
  mode,
  filterOptions,
  hideRightContent,
}) {
  const [filterPrice, setFilterPrice] = React.useState([]);
  const [filterCategory, setFilterCategory] = React.useState([]);
  const [filterSort, setFilterSort] = React.useState([]);
  const [filterPopular, setFilterPopular] = React.useState([]);
  const [activeFilter, setActiveFilter] = React.useState("전체");

  // Mobile dropdown options
  const priceOptions = [
    { value: "50000", label: "50,000원 그룹" },
    { value: "75000", label: "75,000원 그룹" },
    { value: "85000", label: "85,000원 그룹" },
    { value: "90000", label: "90,000원 그룹" },
    { value: "100000", label: "100,000원 그룹" },
    { value: "200000", label: "200,000원 그룹" },
  ];

  const categoryOptions = [
    { value: "상품군1", label: "상품군1" },
    { value: "상품군2", label: "상품군2" },
    { value: "상품군3", label: "상품군3" },
    { value: "상품군4", label: "상품군4" },
    { value: "상품군5", label: "상품군5" },
    { value: "상품군6", label: "상품군6" },
  ];

  const sortOptions = [
    { value: "높은 가격순", label: "높은 가격순" },
    { value: "낮은 가격순", label: "낮은 가격순" },
  ];

  const popularOptions = [
    { value: "최신순", label: "최신순" },
    { value: "리뷰 많은순", label: "리뷰 많은순" },
    { value: "판매 많은순", label: "판매 많은순" },
  ];

  // Mobile dropdown change handlers
  const handlePriceChange = (values) => {
    setFilterPrice(Array.isArray(values) ? values : [values]);
  };

  const handleCategoryChange = (values) => {
    setFilterCategory(Array.isArray(values) ? values : [values]);
  };

  const handleSortChange = (values) => {
    setFilterSort(Array.isArray(values) ? values : [values]);
  };

  const handlePopularChange = (values) => {
    setFilterPopular(Array.isArray(values) ? values : [values]);
  };

  return (
    <div className={styles.mobileFilters}>
      <div className={styles.filterLeft}>
        {filterOptions.includes("price") && (
          <DropdownCustom
            label="가격별"
            options={priceOptions}
            value={filterPrice}
            type="multi"
            onChange={handlePriceChange}
          />
        )}
        {filterOptions.includes("category") && (
          <DropdownCustom
            label="카테고리"
            options={categoryOptions}
            value={filterCategory}
            type="multi"
            onChange={handleCategoryChange}
          />
        )}
        {filterOptions.includes("sort") && (
          <DropdownCustom
            label="가격순"
            options={sortOptions}
            value={filterSort}
            type="multi"
            onChange={handleSortChange}
          />
        )}
        {filterOptions.includes("popular") && (
          <DropdownCustom
            label="인기순"
            options={popularOptions}
            value={filterPopular}
            type="multi"
            onChange={handlePopularChange}
          />
        )}
      </div>
      {!hideRightContent && (
        <div className={styles.filterRight}>
          <div
            className={`${styles.filterRightItem} ${
              activeFilter === "전체" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("전체")}
          >
            {activeFilter === "전체" && <IconCheck />}
            <span>전체</span>
          </div>
          <div className={styles.filterDivider}></div>
          <div
            className={`${styles.filterRightItem} ${
              activeFilter === "높은 가격순" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("높은 가격순")}
          >
            {activeFilter === "높은 가격순" && <IconCheck />}
            <span>높은 가격순</span>
          </div>
          <div className={styles.filterDivider}></div>
          <div
            className={`${styles.filterRightItem} ${
              activeFilter === "낮은 가격순" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("낮은 가격순")}
          >
            {activeFilter === "낮은 가격순" && <IconCheck />}
            <span>낮은 가격순</span>
          </div>
        </div>
      )}
    </div>
  );
}

export const IconCheck = () => (
  <svg
    width="14"
    height="15"
    viewBox="0 0 14 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.0274 3.43075C12.2268 3.63008 12.2268 3.95326 12.0274 4.15259L5.61076 10.5693C5.41143 10.7686 5.08825 10.7686 4.88892 10.5693L1.97225 7.65259C1.77292 7.45326 1.77292 7.13008 1.97225 6.93075C2.17158 6.73142 2.49476 6.73142 2.69409 6.93075L5.24984 9.48649L11.3056 3.43075C11.5049 3.23142 11.8281 3.23142 12.0274 3.43075Z"
      fill="var(--text-121212)"
    />
  </svg>
);
