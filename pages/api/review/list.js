import { getToken } from "next-auth/jwt";
import orderModel from "~/models/order";
import productModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { slug, hasMedia, hasComment, rating } = req.query;

        if (!slug) {
          return res.status(400).json({ success: false, message: "Slug is required" });
        }

        const product = await productModel.findOne({ slug }).select("review").lean();

        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        let reviews = product.review || [];

        if (hasMedia === "true") {
          reviews = reviews.filter(r => Array.isArray(r.media) && r.media.length > 0);
        } else if (hasMedia === "false") {
          reviews = reviews.filter(r => !Array.isArray(r.media) || r.media.length === 0);
        }

        // 설명(코멘트) 필터
        if (hasComment === "true") {
          reviews = reviews.filter(r => typeof r.comment === "string" && r.comment.trim().length > 0);
        } else if (hasComment === "false") {
          reviews = reviews.filter(r => !r.comment || r.comment.trim().length === 0);
        }

        if (rating) {
          let ratingArr = [];
          if (Array.isArray(rating)) {
            ratingArr = rating.map(Number).filter(n => [1,2,3,4,5].includes(n));
          } else if (typeof rating === "string") {
            ratingArr = rating.split(",").map(Number).filter(n => [1,2,3,4,5].includes(n));
          }
          if (ratingArr.length > 0) {
            reviews = reviews.filter(r => ratingArr.includes(r.rating));
          }
        }

        res.status(200).json({ success: true, data: reviews });
      }
      catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
