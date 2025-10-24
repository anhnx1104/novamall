import Link from "next/dist/client/link";
import ImageLoader from "../Image";
import classes from "./homeBrandLove.module.css";

function Brand(props) {
  return (
    <Link href={`/gallery/?brand=${props.slug}`}>
      <div className={classes.category_root}>
        <div className={classes.container}>
          <figure>
            <div className={classes.img}>
              <ImageLoader
                src={props.img}
                alt={props.name}
                width={80}
                height={80}
              />
            </div>
          </figure>
        </div>
      </div>
    </Link>
  );
}

export default Brand;
