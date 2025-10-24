import ProductModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

const pif = {
  name: 1,
  slug: 1,
  image: 1,
  unit: 1,
  unitValue: 1,
  price: 1,
  discount: 1,
  type: 1,
  variants: 1,
  quantity: 1,
  date: 1,
  review: 1,
  isSpecial: 1,
};

/**
 * @swagger
 * /api/home/products:
 *   get:
 *     tags:
 *       - Home
 *     summary: Get products by type (유형별 상품 조회)
 *     description: Retrieve trending, new, bestselling, or special products for homepage (Public) (홈페이지용 인기, 신상, 베스트셀러 또는 특별 상품 조회 - 공개)
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [trending, new, bestselling, special]
 *         description: Type of products to retrieve (조회할 상품 유형)
 *     responses:
 *       200:
 *         description: Products retrieved successfully (상품 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Product'
 *                       - type: object
 *                         properties:
 *                           averageRating:
 *                             type: number
 *                             nullable: true
 *                             description: Average rating from reviews (리뷰 평균 평점)
 *       400:
 *         description: Bad request or invalid type (잘못된 요청 또는 유효하지 않은 유형)
 */
export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { type } = req.query;
        const arg =
          type === "trending"
            ? { trending: true }
            : type === "new"
            ? { new: true }
            : type === "bestselling"
            ? { bestSelling: true }
            : type === "special"
            ? { isSpecial: true }
            : {};
        if (arg) {
          const data = await ProductModel.aggregate([
            { $match: arg },
            { $limit: 30 },
            {
              $project: {
                ...pif,
                averageRating: {
                  $cond: [
                    { $gt: [{ $size: "$review" }, 0] },
                    { $avg: "$review.rating" },
                    null,
                  ],
                },
              },
            },
          ]);
          res.setHeader(
            "Cache-Control",
            "s-maxage=300, stale-while-revalidate"
          );
          res.status(200).json({
            success: true,
            products: data,
          });
        } else {
          throw new Error("illigal request");
        }
      } catch (err) {
        console.log(err.message);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
