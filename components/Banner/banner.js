import Link from "next/link";
import classes from "./banner.module.css";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { darkenHexColor, lightenHexColor } from "~/lib/clientFunctions";

const Banner = (props) => {
  const { t } = useTranslation();
  if (!props.banner) return null;

  return (
    <div
      className={classes.banner}
      style={{
        height: props.banner.heightItem ? props.banner.heightItem : "auto",
        background: `linear-gradient(150deg,
          ${lightenHexColor(props.banner.backgroundColor, 0.4)},
          ${props.banner.backgroundColor}
        )`,
        boxShadow: `3px 3px 0 0 ${darkenHexColor(
          props.banner.backgroundColor,
          0.1
        )}`,
      }}
    >
      {" "}
      <div
        className={classes.bannerContainer}
        style={{
          height: props.banner.heightItem ? props.banner.heightItem : "auto",
        }}
      >
        <div
          className={`${classes.content} ${
            props.banner.style ? classes.style : ""
          }`}
        >
          <h2
            className={classes.heading}
            style={{
              fontSize: props.banner.titleSize
                ? `${props.banner.titleSize}px`
                : "16px",
            }}
          >
            {props.banner.title}
          </h2>
          <p
            className={classes.subheading}
            style={{
              whiteSpace: "pre-line",
              fontWeight: "400",
              fontSize: props.banner.descriptionSize
                ? `${props.banner.descriptionSize}px`
                : "12px",
            }}
          >
            {props.banner.description}
          </p>
          {!props.banner.hideButton && (
            <Link href={props.banner.url} className={classes.button}>
              {props.banner.buttonText || "특별 상품 보기"}
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.7071 5.50695C15.8946 5.69444 16 5.94875 16.0001 6.21395C16.0002 6.34543 15.9744 6.47564 15.9241 6.59713C15.8738 6.71861 15.8001 6.82899 15.7071 6.92195L11.2071 11.4219C11.0194 11.6095 10.765 11.7147 10.4997 11.7147C10.2345 11.7146 9.98009 11.6091 9.79258 11.4214C9.60507 11.2338 9.49979 10.9794 9.49988 10.7141C9.49997 10.4488 9.60544 10.1945 9.79308 10.0069L12.586 7.21399H1C0.734784 7.21399 0.48043 7.10863 0.292893 6.9211C0.105357 6.73356 0 6.47921 0 6.21399C0 5.94877 0.105357 5.69442 0.292893 5.50688C0.48043 5.31935 0.734784 5.21399 1 5.21399H12.5861L9.79308 2.42095C9.69757 2.3287 9.62139 2.21836 9.56898 2.09635C9.51657 1.97435 9.48898 1.84313 9.48783 1.71035C9.48668 1.57757 9.51198 1.44589 9.56226 1.32299C9.61254 1.2001 9.68679 1.08845 9.78069 0.994554C9.87458 0.900661 9.98623 0.826408 10.1091 0.776127C10.232 0.725846 10.3637 0.700544 10.4965 0.701698C10.6293 0.702852 10.7605 0.730438 10.8825 0.782847C11.0045 0.835256 11.1148 0.911438 11.2071 1.00695L15.7071 5.50695Z"
                  fill="white"
                />
              </svg>
            </Link>
          )}
        </div>
        <div
          className={classes.bg}
          style={{
            width: props.banner.imageWidth ? props.banner.imageWidth : "100%",
          }}
        >
          <Image
            src={props.banner.image[0]?.url}
            alt={props.banner.image[0]?.name}
            width={178}
            height={146}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
