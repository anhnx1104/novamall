import React from "react";
import styles from "./sidebarFilter.module.css";
import Checkbox from "~/components/Ui/Form/Checkbox/checkbox";

export default function SidebarFilter({ mode, filterOptions }) {
  const [filterPrice, setFilterPrice] = React.useState([]);
  const [filterCategory, setFilterCategory] = React.useState([]);
  const [filterSort, setFilterSort] = React.useState([]);
  const [filterPopular, setFilterPopular] = React.useState([]);

  const handleCheckboxChange = (type, value) => {
    switch (type) {
      case "price":
        setFilterPrice((prev) => {
          if (prev.includes(value)) {
            return prev.filter((item) => item !== value);
          } else {
            return [...prev, value];
          }
        });
        break;
      case "category":
        setFilterCategory((prev) => {
          if (prev.includes(value)) {
            return prev.filter((item) => item !== value);
          } else {
            return [...prev, value];
          }
        });
        break;
      case "sort":
        setFilterSort((prev) => {
          if (prev.includes(value)) {
            return prev.filter((item) => item !== value);
          } else {
            return [...prev, value];
          }
        });
        break;
      case "popular":
        setFilterPopular((prev) => {
          if (prev.includes(value)) {
            return prev.filter((item) => item !== value);
          } else {
            return [...prev, value];
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${
        mode === "dark" ? styles.dark : styles.light
      }`}
    >
      {/* 가격별 */}

      {filterOptions.includes("price") && (
        <div className={styles.section}>
          <h3 className={styles.title}>가격별</h3>
          <ul className={styles.list}>
            {[
              {
                label: "50,000원 그룹",
                value: "50000",
              },
              {
                label: "75,000원 그룹",
                value: "75000",
              },
              {
                label: "85,000원 그룹",
                value: "85000",
              },
              {
                label: "90,000원 그룹",
                value: "90000",
              },
              {
                label: "100,000원 그룹",
                value: "100000",
              },
              {
                label: "200,000원 그룹",
                value: "200000",
              },
            ].map((item, idx) => (
              <li key={idx}>
                <Checkbox
                  label={item.label}
                  value={item.value}
                  checked={filterPrice.includes(item.value)}
                  onChange={() => handleCheckboxChange("price", item.value)}
                  mode={mode}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 카테고리 */}
      {filterOptions.includes("category") && (
        <div className={styles.section}>
          <h3 className={styles.title}>카테고리</h3>
          <ul className={styles.list}>
            {[
              {
                label: "상품군1",
                value: "상품군1",
              },
              {
                label: "상품군2",
                value: "상품군2",
              },
              {
                label: "상품군3",
                value: "상품군3",
              },
              {
                label: "상품군4",
                value: "상품군4",
              },
              {
                label: "상품군5",
                value: "상품군5",
              },
              {
                label: "상품군6",
                value: "상품군6",
              },
            ].map((item, idx) => (
              <li key={idx}>
                <Checkbox
                  label={item.label}
                  value={item.value}
                  checked={filterCategory.includes(item.value)}
                  onChange={() => handleCheckboxChange("category", item.value)}
                  mode={mode}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 가격순 */}
      {filterOptions.includes("sort") && (
        <div className={styles.section}>
          <h3 className={styles.title}>가격순</h3>
          <ul className={styles.list}>
            {["높은 가격순", "낮은 가격순"].map((item, idx) => (
              <li key={idx}>
                <Checkbox
                  label={item}
                  value={item}
                  checked={filterSort.includes(item)}
                  onChange={() => handleCheckboxChange("sort", item)}
                  mode={mode}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 인기순 */}
      {filterOptions.includes("popular") && (
        <div className={styles.section}>
          <h3 className={styles.title}>인기순</h3>
          <ul className={styles.list}>
            {["최신순", "리뷰 많은순", "판매 많은순"].map((item, idx) => (
              <li key={idx}>
                <Checkbox
                  label={item}
                  value={item}
                  checked={filterPopular.includes(item)}
                  onChange={() => handleCheckboxChange("popular", item)}
                  mode={mode}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
