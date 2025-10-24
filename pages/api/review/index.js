import { getToken } from "next-auth/jwt";
import orderModel from "~/models/order";
import productModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

/**
 * @swagger
 * /api/review:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Submit a product review (상품 리뷰 작성)
 *     description: Add a review and rating for a purchased product (구매한 상품에 대한 리뷰 및 평점 추가)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pid
 *               - oid
 *               - rating
 *             properties:
 *               pid:
 *                 type: string
 *                 description: Product ID (상품 ID)
 *               oid:
 *                 type: string
 *                 description: Order ID (주문 ID)
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great product!
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [image, video]
 *     responses:
 *       200:
 *         description: Review submitted successfully (리뷰 제출 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });
  if (!session)
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { pid, oid, rating, comment, media } = req.body;
        const _data = {
          userName: session.user.name,
          email: session.user.email,
          rating,
          comment,
          media : Array.isArray(media)
          ? media.map((m) => ({
              url: m.url,
              type: m.type,
            }))
          : [],
        };
        await productModel.findByIdAndUpdate(pid, {
          $push: { review: _data },
        });

        await orderModel.findOneAndUpdate(
          { orderId: oid, "products._id": pid },
          {
            $set: { "products.$.review": true },
          }
        );

        res.status(200).json({ success: true });
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
