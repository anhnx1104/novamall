import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import Banner from "~/components/Banner/banner";
import ButtonCustom from "~/components/ButtonCustom";
import HeadData from "~/components/Head";
import { setSettingsData } from "~/lib/clientFunctions";
import homePageData from "~/lib/dataLoader/home";
import { wrapper } from "~/redux/store";
import c from "~/styles/index.module.css";

const Error500 = dynamic(() => import("~/components/error/500"));
const Header = dynamic(() => import("~/components/Header/header"));
const CategoryList = dynamic(() =>
  import("~/components/Categories/categoriesList")
);
const HomeBrandLove = dynamic(() =>
  import("~/components/HomeBrandLove/homeBrandLove")
);
const HomeTestimonial = dynamic(() =>
  import("~/components/HomeTestimonial/homeTestimonial")
);
const HomeContact = dynamic(() =>
  import("~/components/HomeContact/homeContact")
);

const HomeReviews = dynamic(() =>
  import("~/components/HomeReviews/homeReviews")
);
const HomeCollection = dynamic(() =>
  import("~/components/HomeCollection/homeCollection")
);
const HomeWhyUse = dynamic(() => import("~/components/HomeWhyUse/homeWhyUse"));
const HomeSlide = dynamic(() => import("~/components/HomeSlide/homeSlide"));
const ProductDetails = dynamic(() =>
  import("~/components/Shop/Product/productDetails")
);
const ProductList = dynamic(() => import("~/components/ProductListView"));

const ProductItem = dynamic(() =>
  import("~/components/ProductItem/productItem")
);
const FaqList = dynamic(() => import("~/components/FaqListView"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

const fetcher = (url) => fetch(url).then((res) => res.json());
const product = {
  image: "/images/product_item.png",
  name: "MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L",
  oldPrice: 110002,
  newPrice: 89002,
  discount: 25,
  rating: 4.7,
  reviews: 2341,
};

function HomePage({ data, error }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const { data: reviewsData, error: reviewsError } = useSWR(
    `/api/review/new?page=1&pageSize=10`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const handleCloseModal = () => {
    router.push("/", undefined, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData />
          <HomeSlide />

          <CategoryList categoryList={data.category} />
          <HomeCollection
            mode="light"
            title=" 놓치지 마세요!"
            highlight="특별 상품"
            products={[
              { ...product, id: 1 },
              { ...product, id: 2 },
              { ...product, id: 3 },
              { ...product, id: 4 },
              { ...product, id: 5 },
              { ...product, id: 6 },
            ]}
          />
          <HomeWhyUse />
          <Header
            carousel={data.additional && data.additional.homePage.carousel}
          />

          <HomeCollection
            title="특별 상품 보기"
            subtitle={`특별상품에 대한 설명입니다\nIn magna est nisi pulvinar nulla sit arcu donec. Sem molestie enim id urna sem pellentesque ut eget nisl.`}
            products={[
              { ...product, id: 1 },
              { ...product, id: 2 },
              { ...product, id: 3 },
              { ...product, id: 4 },
              { ...product, id: 5 },
              { ...product, id: 6 },
            ]}
          />
          <HomeCollection
            title="신상품 보기"
            subtitle={`특별상품에 대한 설명입니다\nIn magna est nisi pulvinar nulla sit arcu donec. Sem molestie enim id urna sem pellentesque ut eget nisl.`}
            products={[
              { ...product, id: 1 },
              { ...product, id: 2 },
              { ...product, id: 3 },
              { ...product, id: 4 },
              { ...product, id: 5 },
              { ...product, id: 6 },
            ]}
          />
          <HomeCollection
            title="추천 상품 보기"
            subtitle={`특별상품에 대한 설명입니다\nIn magna est nisi pulvinar nulla sit arcu donec. Sem molestie enim id urna sem pellentesque ut eget nisl.`}
            products={[
              { ...product, id: 1 },
              { ...product, id: 2 },
              { ...product, id: 3 },
              { ...product, id: 4 },
              { ...product, id: 5 },
              { ...product, id: 6 },
            ]}
          />

          <HomeReviews />
        </>
      )}
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, locale, ...etc }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const _data = await homePageData();
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

export default HomePage;
HomePage.navbarMode = "dark";
