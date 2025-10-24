import productModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { slug } = req.query;

        if (!slug) {
          return res.status(400).json({ success: false, message: "Slug is required" });
        }

        const product = await productModel.findOne({ slug }).select("review").lean();

        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        const reviews = product.review || [];
        const totalReviewCount = reviews.length;

        // 5~1점 카운트
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let ratingSum = 0;
        reviews.forEach(r => {
          if ([1,2,3,4,5].includes(r.rating)) {
            ratingCounts[r.rating]++;
            ratingSum += r.rating;
          }
        });

        const averageRating = totalReviewCount > 0 ? (ratingSum / totalReviewCount) : 0;

        res.status(200).json({
          success: true,
          data : {
            totalReviewCount,
            ratingCounts,
            averageRating,
          }
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}