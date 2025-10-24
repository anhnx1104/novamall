import { ArrowRepeat, TextLeft } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OutsideClickHandler from "~/components/ClickOutside";
import { fetchData } from "~/lib/clientFunctions";
import c from "./categoryMenu.module.css";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

const ImageLoader = dynamic(() => import("~/components/Image"));

export default function CategoryMenu() {
  const [cat, setCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategory, setShowCategory] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  async function GetData() {
    const url = `/api/home/categories?only_category=true`;
    const data = await fetchData(url);
    data.success ? setCat(data.category) : setCat(null);
    setLoading(false);
  }
  useEffect(() => {
    GetData();
  }, []);

  const toggleCategory = () => setShowCategory(!showCategory);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setShowCategory(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c.category_container}>
      <button onClick={() => toggleCategory()}>
        <svg
          width="18"
          height="16"
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.25H17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 5.75H17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 10.25H17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 14.75H17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 5.5L5 8L1 10.5V5.5Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        &nbsp;{t("카테고리")}
      </button>
      <OutsideClickHandler
        show={showCategory}
        onClickOutside={() => setShowCategory(false)}
      >
        <div className={c.menu}>
          {loading ? (
            <div className={c.loader}>
              <ArrowRepeat width={30} height={30} />
            </div>
          ) : !cat ? (
            <div>문제가 발생했습니다.</div>
          ) : (
            <ul>
              {cat.map((item, idx) => (
                <li key={idx} className={c.item}>
                  <Link
                    href={`/gallery?category=${item.slug}`}
                    className={c.link}
                    shallow={true}
                  >
                    <ImageLoader
                      src={item.icon[0]?.url}
                      width={20}
                      height={20}
                      alt={item.name}
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              <li className={c.item}>
                <Link
                  href={`/categories`}
                  className="justify-content-center fw-bold"
                >
                  {t("모두 보기")}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
