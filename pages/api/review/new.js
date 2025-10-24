import productModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
        // 최신 상품 리뷰 리스트
      try {
        const { page = 1, pageSize = 10 } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSizeNumber = parseInt(pageSize, 10);
        
        const newReviewList = await productModel
            .find({
                "review.0": { $exists: true },
                new: true,
            })
            .select("name image review")
            .skip((pageNumber - 1) * pageSizeNumber)
            .limit(pageSizeNumber)
            .lean();

        res.status(200).json({ success: true, data: newReviewList });
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
