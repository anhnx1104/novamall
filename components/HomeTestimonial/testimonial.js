import Link from "next/dist/client/link";
import ImageLoader from "../Image";
import classes from "./homeTestimonial.module.css";

function Testimonial({ review }) {
  return (
    <div className={classes.category_root}>
      <div className={classes.container}>
        <div
          className={classes.top}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className={classes.avatar}>
            <ImageLoader
              src={review?.image?.[0]?.url}
              alt={review?.name || "Product"}
              width={120}
              height={120}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className={classes.content}>
            <h3 className={classes.name}>{review?.name || "Product"}</h3>
            <p className={classes.description}>
              {review?.review?.[0]?.username || "Customer"}
            </p>
            <div className={classes.rating}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.83553 13.6906L3.97645 15.8968C3.84004 15.9748 3.68629 16.0097 3.53257 15.9977C3.37885 15.9856 3.23131 15.927 3.10662 15.8285C2.98193 15.73 2.88506 15.5955 2.82698 15.4403C2.76889 15.285 2.7519 15.1152 2.77793 14.95L3.51472 10.2772L0.392438 6.96702C0.281983 6.84999 0.20386 6.70167 0.166912 6.53885C0.129963 6.37603 0.135666 6.20521 0.183373 6.04573C0.231081 5.88625 0.318888 5.74448 0.436855 5.63647C0.554822 5.52845 0.698238 5.45851 0.850868 5.43456L5.16507 4.75276L7.09461 0.501212C7.16277 0.350781 7.2683 0.224106 7.39924 0.135527C7.53019 0.0469471 7.68132 0 7.83553 0C7.98974 0 8.14087 0.0469471 8.27181 0.135527C8.40276 0.224106 8.50829 0.350781 8.57645 0.501212L10.506 4.75276L14.8202 5.43546C14.9727 5.45954 15.1159 5.52951 15.2337 5.63746C15.3515 5.74542 15.4392 5.88705 15.4869 6.04637C15.5346 6.20568 15.5404 6.37632 15.5035 6.53901C15.4667 6.7017 15.3888 6.84995 15.2786 6.96702L12.1555 10.2772L12.8923 14.95C12.9182 15.1151 12.9012 15.2848 12.8431 15.4399C12.7851 15.595 12.6883 15.7293 12.5638 15.8278C12.4392 15.9263 12.2918 15.9849 12.1382 15.9971C11.9846 16.0093 11.831 15.9746 11.6946 15.8968L7.83553 13.6906Z"
                    fill={
                      i < (review?.review?.[0]?.rating || 5)
                        ? "#FF7700"
                        : "#E5E5E5"
                    }
                  />
                </svg>
              ))}
              <p>{review?.review?.[0]?.rating || 5}.0</p>
            </div>
          </div>
        </div>
        <div className={classes.bottom}>
          <p className={classes.text}>{review?.review?.[0]?.comment || "-"}</p>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
