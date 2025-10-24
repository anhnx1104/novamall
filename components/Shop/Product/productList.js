import InfiniteScroll from "react-infinite-scroll-component";
import Product from "./product";
import c from "./productList.module.css";
import { useTranslation } from "react-i18next";
import ProductSpecial from "../ProductSpecial/productSpecial";
import ProductRegular from "../ProductRegular/productRegular";

function ProductList({ items, data_length, loadMore, productType }) {
  const { t } = useTranslation();

  return (
    <div className={c.list}>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={items.length >= data_length ? false : true}
        loader={<h6 className={c.endMessage}>{t("loading")}</h6>}
        endMessage={
          <h6 className={c.endMessage}>{t("더 이상 보여줄 것이 없습니다")}</h6>
        }
        className={c.container_products}
        style={{
          gap: "20px",
        }}
      >
        {items.map((data) =>
          productType !== "regular" ? (
            <ProductSpecial
              key={data._id}
              product={data}
              button={true}
              layout={"text-start"}
              size={"176px"}
              cssClass={c.product}
            />
          ) : (
            <ProductRegular
              key={data._id}
              product={data}
              button={true}
              layout={"text-start"}
              size={"176px"}
            />
          )
        )}
      </InfiniteScroll>
    </div>
  );
}

export default ProductList;
