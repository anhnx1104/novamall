import sessionChecker from "~/lib/sessionPermission";
import couponModel from "../../../models/coupon";
import dbConnect from "../../../utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     tags:
 *       - Coupons
 *     summary: Get all coupons (모든 쿠폰 조회)
 *     description: Retrieve all discount coupons (Admin only) (모든 할인 쿠폰 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Coupons retrieved successfully (쿠폰 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 coupon:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   post:
 *     tags:
 *       - Coupons
 *     summary: Create a new coupon (새 쿠폰 생성)
 *     description: Create a new discount coupon (Admin only) (새 할인 쿠폰 생성 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - amount
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER2025
 *                 description: Unique coupon code (고유 쿠폰 코드)
 *               amount:
 *                 type: number
 *                 example: 20
 *                 description: Discount amount or percentage (할인 금액 또는 비율)
 *               active:
 *                 type: boolean
 *                 example: true
 *                 description: Whether coupon is active (쿠폰 활성화 여부)
 *               expire:
 *                 type: string
 *                 format: date-time
 *                 description: Coupon expiration date (쿠폰 만료일)
 *     responses:
 *       200:
 *         description: Coupon created successfully or duplicate code (쿠폰 생성 성공 또는 중복 코드)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 dup:
 *                   type: boolean
 *                   description: True if coupon code already exists (쿠폰 코드가 이미 존재하는 경우 true)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   delete:
 *     tags:
 *       - Coupons
 *     summary: Delete a coupon (쿠폰 삭제)
 *     description: Delete a coupon by ID (Admin only) (ID로 쿠폰 삭제 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID to delete (삭제할 쿠폰 ID)
 *     responses:
 *       200:
 *         description: Coupon deleted successfully (쿠폰 삭제 성공)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "coupon")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const coupon = await couponModel.find({});
        res.status(200).json({ success: true, coupon });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        const formData = await parseForm(req);
        const coupon = {
          code: formData.field.code.trim(),
          amount: Number(formData.field.amount),
          active: formData.field.active,
          expired: formData.field.expire,
        };
        await couponModel.create(coupon);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          return res.status(200).json({
            success: false,
            dup: true,
          });
        }
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const id = req.query.id;
        await couponModel.findByIdAndDelete(id);
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
