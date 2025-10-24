import HeadData from "~/components/Head";
import dynamic from "next/dynamic";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import classes from "../styles/pages.module.css";
import { useTranslation } from "react-i18next";
import pageData from "~/lib/dataLoader/pageData";
import ImageLoader from "~/components/Image";
import Link from "next/link";
import AboutTop from "~/components/AboutUs/aboutTop";
import AboutOurTeam from "~/components/AboutUs/aboutOurTeam";
import AboutLastNews from "~/components/AboutUs/aboutLastNews";
const Error500 = dynamic(() => import("~/components/error/500"));

const AboutPage = ({ data, error }) => {
  const { t } = useTranslation();
  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData title="About Us" />
          <div className="layout_top">
            <h1 className={`${classes.heading} ${classes.aboutHeading}`}>
              {t("회사 소개")}
            </h1>

            <div className="content_spacing" />
            <AboutTop />
            <div className="content_spacing" />
            {/* <AboutOurTeam /> */}
            {/* <AboutLastNews /> */}

            {/* {data && (
              <div
                className={classes.content}
                dangerouslySetInnerHTML={{
                  __html: data.page && data.page.content,
                }}
              ></div>
            )} */}
          </div>
        </>
      )}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, locale, ...etc }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const _data = await pageData("about");
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

export default AboutPage;
