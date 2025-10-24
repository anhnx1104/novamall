import Link from "next/link";
import Image from "next/image";
import c from "./breadcrumbs.module.css";
const BreadcrumbsCustom = ({ dataBreadcrumbs }) => {
  return (
    <div className={c.breadcrumbs}>
      {dataBreadcrumbs.map((segment, index) => (
        <p key={index} className={c.breadcrumbs_item}>
          {index < dataBreadcrumbs.length - 1 ? (
            <Link href={`${segment.href}`}>
              {segment.title}{" "}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.45508 9.95999L7.71508 6.69999C8.10008 6.31499 8.10008 5.68499 7.71508 5.29999L4.45508 2.03999"
                  stroke="#818B9C"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <>
              {segment.title.length > 20
                ? `${segment.title.slice(0, 20)}…`
                : `${segment.title}`}
            </>
          )}
        </p>
      ))}
    </div>
  );
};

export default BreadcrumbsCustom;
