import sessionChecker from "~/lib/sessionPermission";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     tags:
 *       - Wishlist
 *     summary: Add product to wishlist (위시리스트에 상품 추가)
 *     description: Add a product to user's wishlist (사용자의 위시리스트에 상품 추가)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - pid
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID (사용자 ID)
 *               pid:
 *                 type: string
 *                 description: Product ID (상품 ID)
 *     responses:
 *       200:
 *         description: Product added to wishlist or already exists (위시리스트에 상품 추가 완료 또는 이미 존재)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 exists:
 *                   type: boolean
 *                   description: True if product already in wishlist (상품이 이미 위시리스트에 있는 경우 true)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: Remove product from wishlist (위시리스트에서 상품 제거)
 *     description: Remove a product from user's wishlist (사용자의 위시리스트에서 상품 제거)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - pid
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID (사용자 ID)
 *               pid:
 *                 type: string
 *                 description: Product ID (상품 ID)
 *     responses:
 *       200:
 *         description: Product removed from wishlist (위시리스트에서 상품 제거 완료)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "general")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const bodyData = req.body;
        const user = await userModel.findById(bodyData.id);
        const exists = await user.favorite.filter((pid) =>
          bodyData.pid.includes(pid),
        );
        if (exists.length > 0) {
          return res.status(200).json({ success: false, exists: true });
        }
        await userModel.findByIdAndUpdate(bodyData.id, {
          $push: { favorite: bodyData.pid },
        });
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const bodyData = req.body;
        await userModel.findByIdAndUpdate(bodyData.id, {
          $pull: { favorite: bodyData.pid },
        });
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
