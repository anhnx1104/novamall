import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import ImageLoader from "~/components/Image";
import Error500 from "~/components/error/500";
import { compareData, fetchData, setSettingsData } from "~/lib/clientFunctions";
import galleryPageData from "~/lib/dataLoader/gallery";
import { wrapper } from "~/redux/store";
import classes from "~/styles/gallery.module.css";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const SidebarList = dynamic(() =>
  import("~/components/Shop/Sidebar/sidebarList")
);
const ProductList = dynamic(() =>
  import("~/components/Shop/Product/productList")
);
const ProductDetails = dynamic(() =>
  import("~/components/Shop/Product/productDetails")
);
const BreadcrumbsCustom = dynamic(() => import("~/components/Breadcrumbs/"));
const ColorFilter = dynamic(() =>
  import("~/components/Shop/Sidebar/colorFilter")
);

function GalleryPage({ data, error }) {
  const router = useRouter();
  const breadcrumbs = [
    { title: "홈페이지", href: "/" },
    { title: "쇼핑", href: "/" },
  ];
  const dataSort = [
    { name: "기본", id: "" },
    { name: "최신순", id: "db" },
    { name: "오래된순", id: "da" },
    { name: "가격: 낮은순", id: "pa" },
    { name: "가격: 높은순", id: "pb" },
    { name: "이름: A-Z", id: "na" },
    { name: "이름: Z-A", id: "nb" },
  ];
  const [selectedSort, setSelectedSort] = useState(dataSort[0]);

  const _items = data.product || [];
  const [_productList, _setProductList] = useState(_items);
  const [sortedItemList, setSortedItemList] = useState(_items);
  const [loading, setLoading] = useState(false);
  const [productLength, setProductLength] = useState(data.product_length || 0);
  const [isOpen, setIsOpen] = useState(false);
  const [sortKey, setSortKey] = useState("db");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: data.priceRange?.min || 0,
    max: data.priceRange?.max || 1,
  });
  const [selectedRatingRange, setSelectedRatingRange] = useState({
    min: 0,
    max: 5.0,
  });
  const [selectedRatingRangeFilter, setSelectedRatingRangeFilter] = useState({
    min: 0,
    max: 5.0,
  });
  const [selectedRatings, setSelectedRatings] = useState([]);
  const isInitialMount = useRef(true);
  const { t } = useTranslation();
  //update filter
  async function updateFilteredProduct() {
    try {
      setLoading(true);
      let brandArr = "";
      if (selectedBrand.length > 0) {
        brandArr = "&brands=" + selectedBrand.join("&brands=");
      }

      let colorArr = "";
      if (selectedColors.length > 0) {
        colorArr = "&colors=" + selectedColors.join("&colors=");
      }

      let ratingArr = "";
      if (selectedRatings.length > 0) {
        ratingArr = "&ratings=" + selectedRatings.join("&ratings=");
      }

      const cat = selectedCategory ? `category=${selectedCategory}` : "";
      const sub = selectedSubCategory
        ? `&subcategory=${selectedSubCategory}`
        : "";
      const child = selectedChildCategory
        ? `&childcategory=${selectedChildCategory}`
        : "";
      const priceRange = `&price_min=${selectedPriceRange.min}&price_max=${selectedPriceRange.max}`;
      const ratingRange = `&ratingStart=${selectedRatingRangeFilter.min}&ratingEnd=${selectedRatingRangeFilter.max}`;
      const isSpecial = router.query.isSpecial
        ? router.query.isSpecial === "true"
          ? "&isSpecial=true"
          : "&isSpecial=false"
        : "";

      const trending = router.query.trending
        ? `&trending=${router.query.trending}`
        : "";
      const newProduct = router.query.newProduct
        ? `&newProduct=${router.query.newProduct}`
        : "";
      const bestSelling = router.query.bestSelling
        ? `&bestSelling=${router.query.bestSelling}`
        : "";

      const prefix = `${cat}${sub}${child}${brandArr}${colorArr}${priceRange}${ratingRange}${ratingArr}${isSpecial}${trending}${newProduct}${bestSelling}`;
      const response = await fetchData(`/api/gallery?${prefix}`);
      _setProductList(response.product);
      setProductLength(response.product_length);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    updateFilteredProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedChildCategory,
    selectedBrand,
    selectedColors,
    selectedPriceRange,
    selectedRatings,
    selectedRatingRangeFilter,
    router.query.isSpecial,
    router.query.trending,
    router.query.newProduct,
    router.query.bestSelling,
  ]);

  //Global Data Sorting function
  function sortDataHandler(key) {
    setLoading(true);
    const sortedData = compareData(_productList, key);
    const __sdt = sortedData ? sortedData : _productList;
    setSortedItemList([...__sdt]);
    setLoading(false);
  }

  //Item sorting event handler
  const sortItems = (key) => {
    setSortKey(key);
    sortDataHandler(key);
  };

  //modal close handler
  const handleCloseModal = () => {
    router.push("/gallery", undefined, { shallow: true });
    setIsOpen(false);
  };

  //popup product viewer track
  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  //Load more items
  const moreProduct = async () => {
    await fetchData(
      `/api/gallery/more-product?product_length=${_productList.length}`
    )
      .then((data) => {
        _setProductList([..._productList, ...data]);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`문제가 발생했습니다....(${err.message})`);
      });
  };

  //on data change sort data
  useEffect(() => {
    sortDataHandler(sortKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_productList]);

  const handleRatingChange = (selectedRatings) => {
    setSelectedRatings(selectedRatings);
  };
  const options = dataSort.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleChange = (selectedOption) => {
    sortItems(selectedOption.value);
  };

  return (
    <>
      <HeadData />
      <div className="content_container">
        <div className="custom_container">
          {error ? (
            <Error500 />
          ) : !data ? (
            <Spinner />
          ) : (
            <div>
              <BreadcrumbsCustom dataBreadcrumbs={breadcrumbs} />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                }}
              >
                <SidebarList
                  category={data.category}
                  brand={data.brand}
                  sort={sortItems}
                  updateCategory={setSelectedCategory}
                  updateSubCategory={setSelectedSubCategory}
                  updateChildCategory={setSelectedChildCategory}
                  updateBrand={setSelectedBrand}
                  updatePriceRange={setSelectedPriceRange}
                  updateRatingRange={setSelectedRatingRangeFilter}
                  updateColors={setSelectedColors}
                  priceRange={data.priceRange}
                  ratingRange={selectedRatingRange}
                  updateRatings={handleRatingChange}
                />

                <div className={classes.gallery_container}>
                  <div className={classes.gallery_banner}>
                    {selectedCategory &&
                      selectedCategory === "regular-products" && (
                        <ImageLoader
                          src={`${process.env.NEXT_PUBLIC_URL}/images/category_banner.png`}
                          alt="banner"
                          width={1000}
                          height={300}
                          style={{
                            width: "100%",
                            height: "196px",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                      )}
                    {selectedCategory !== "regular-products" && (
                      <ImageLoader
                        src={`${process.env.NEXT_PUBLIC_URL}/images/category_banner2.png`}
                        alt="banner"
                        width={1000}
                        height={300}
                        style={{
                          width: "100%",
                          height: "196px",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    )}
                  </div>
                  <div className={classes.gallery_sortContainer}>
                    <p>
                      {productLength}개 제품 중 1 - {productLength}개 표시
                    </p>
                    <div className={classes.sort}>
                      <Select
                        options={options}
                        onChange={handleChange}
                        isSearchable={false}
                        placeholder="기본"
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: "200px",
                            position: "relative",
                            borderColor: "var(--primary)",
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ minHeight: "80vh" }}>
                    {!loading && sortedItemList.length === 0 ? (
                      <div className="m-5 p-5">
                        <p className="text-center">
                          {t("제품을 찾을 수 없습니다")}
                        </p>
                      </div>
                    ) : !loading ? (
                      <ProductList
                        items={[...sortedItemList]}
                        data_length={sortedItemList.length}
                        loadMore={moreProduct}
                        productType={
                          selectedCategory === "regular-products"
                            ? "regular"
                            : "variable"
                        }
                      />
                    ) : (
                      <div>
                        <Spinner />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <GlobalModal
        small={false}
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
      >
        {router.query.slug && (
          <ProductDetails productSlug={router.query.slug} />
        )}
      </GlobalModal>
    </>
  );
}

export default GalleryPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, query }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const { category: Qc, brand: Qb, isSpecial } = query;
      let type = null;
      let _query = null;
      if ((Qc && Qc.length > 0) || (Qb && Qb.length > 0) || isSpecial) {
        type = true;
        _query = true;
      }
      const _data = await galleryPageData(type, _query, isSpecial);
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
