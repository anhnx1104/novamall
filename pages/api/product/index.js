import sessionChecker from "~/lib/sessionPermission";
import ProductModel from "../../../models/product";
import groupModel from "../../../models/group";
import dbConnect from "../../../utils/dbConnect";
import { convertToSlug } from "~/middleware/functions";
import customIdNew from "custom-id-new";
import { Types } from "mongoose";
import orderModel from "../../../models/order";

/**
 * @swagger
 * /api/product:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products (모든 상품 조회)
 *     description: Retrieve all products with user count information (Admin only) (구매자 수 정보와 함께 모든 상품 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
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
 *                 product:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Product'
 *                       - type: object
 *                         properties:
 *                           userCount:
 *                             type: number
 *                             description: Number of unique users who purchased this product (이 상품을 구매한 고유 사용자 수)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *   put:
 *     tags:
 *       - Products
 *     summary: Clone a product (상품 복제)
 *     description: Create a duplicate of an existing product (Admin only) (기존 상품의 복제본 생성 - 관리자 전용)
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
 *             properties:
 *               id:
 *                 type: string
 *                 description: Product ID to clone (복제할 상품 ID)
 *     responses:
 *       200:
 *         description: Product cloned successfully (상품 복제 성공)
 *       400:
 *         description: Bad request or product not found (잘못된 요청 또는 상품을 찾을 수 없음)
 *       403:
 *         description: Access forbidden (접근 금지)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const products = await ProductModel
          .find({})
          .populate("group")
          .sort("-date")
          .exec();
          
        const productIds = products.map(p => p._id.toString());

        // 주문에서 각 상품별 구매 인원 수 집계
        const orderCounts = await orderModel.aggregate([
          {
            $match: {
              paymentStatus: "Paid",
            }
          },
          { $unwind: "$products" },
          { $unwind: "$user" },
          {
            $match: {
              "products._id": { $in: productIds }
            }
          },
          {
            $group: {
              _id: "$products._id", // 상품별로 그룹핑
              userSet: { $addToSet: "$user" } // 유저 중복 제거
            }
          },
          {
            $project: {
              _id: 1,
              userCount: { $size: "$userSet" }
            }
          }
        ]);

        // 집계 결과를 상품 ID 기준으로 매핑
        const userCountMap = {};
        orderCounts.forEach(item => {
          userCountMap[item._id?.toString()] = item.userCount;
        });

        // 상품 목록에 userCount 추가
        const productsWithUserCount = products.map(product => {
          const userCount = userCountMap[product._id.toString()] || 0;
          return { ...product.toObject(), userCount };
        });
        
        res.status(200).json({ success: true, product: productsWithUserCount });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const originalDocument = await ProductModel.findById(req.body.id);
        if (!originalDocument) {
          throw new Error("Original document not found.");
        }
        const clonedDocument = new ProductModel(originalDocument.toObject());
        clonedDocument._id = new Types.ObjectId();
        clonedDocument.name = `Clone ${clonedDocument.name}`;
        clonedDocument.slug = convertToSlug(
          `${clonedDocument.name} clone`,
          true
        );
        clonedDocument.date = Date.now();
        clonedDocument.productId =
          "P" + customIdNew({ randomLength: 4, upperCase: true });
        await clonedDocument.save();

        res
          .status(200)
          .json({ success: true, message: "Product Successfully Cloned" });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
