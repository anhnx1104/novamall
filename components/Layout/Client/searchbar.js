import { ArrowRepeat, Search } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import OutsideClickHandler from "~/components/ClickOutside";
import ImageLoader from "~/components/Image";
import { fetchData } from "~/lib/clientFunctions";
import classes from "./searchbar.module.css";
import { useTranslation } from "react-i18next";
import { IconSearch } from "~/components/Ui/Icons/icons";
import { useRouter } from "next/navigation";

export default function SearchBar({ mode }) {
  const [searchData, setSearchData] = useState([]);
  const [searching, setSearching] = useState(false);
  const search = useRef("");
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const router = useRouter();
  const hideSearchBar = () => {
    search.current.value = "";
    setSearchData([]);
  };
  const searchItem = async () => {
    setSearching(true);
    try {
      const options = {
        threshold: 0.3,
        keys: ["name"],
      };
      const product = await fetchData(`/api/home/product_search`);
      const Fuse = (await import("fuse.js")).default;
      const fuse = new Fuse(product.product, options);
      setSearchData(fuse.search(search.current.value));
    } catch (err) {
      console.log(err);
    }
    setSearching(false);
  };

  return (
    <div
      className={`${classes.searchBar_def} ${
        mode === "dark" ? classes.dark : ""
      }`}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <input
          type="text"
          ref={search}
          className={classes.searchInput_def}
          onInput={searchItem}
          placeholder={t("상품명 또는 브랜드 입력")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearching(false);
              router.push(`/products?search=${search.current.value}`);
              search.current.value = "";
            }
          }}
        />

        {searching && (
          <span className={classes.spinner_def}>
            <ArrowRepeat width={17} height={17} />
          </span>
        )}
        <span
          className={classes.search_icon_def}
          onClick={() => {
            setSearching(false);
            router.push(`/products?search=${search.current.value}`);
            search.current.value = "";
          }}
        >
          <IconSearch />
        </span>
      </div>

      <OutsideClickHandler
        show={searchData.length > 0}
        onClickOutside={hideSearchBar}
      >
        <ul className={classes.searchData_def}>
          {searchData.map((product, index) => (
            <li key={index}>
              <Link
                href={`/product/${product.item.slug}`}
                onClick={hideSearchBar}
              >
                <div className={classes.thumb}>
                  <ImageLoader
                    src={product.item.image[0]?.url}
                    alt={product.item.name}
                    width={80}
                    height={80}
                  />
                </div>
                <div className={classes.content}>
                  <p>{product.item.name}</p>
                  {/* <div
                    className={classes.unit}
                  >{`${product.item.unitValue} ${product.item.unit}`}</div> */}
                  <span>
                    {product.item.discount}원
                    {product.item.discount < product.item.price && (
                      <del>{product.item.price}원</del>
                    )}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </OutsideClickHandler>
    </div>
  );
}
