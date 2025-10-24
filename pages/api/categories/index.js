import customId from "custom-id-new";
import s3DeleteFiles from "~/lib/s3Delete";
import sessionChecker from "~/lib/sessionPermission";
import { convertToSlug } from "../../../middleware/functions";
import categoryModel from "../../../models/category";
import dbConnect from "../../../utils/dbConnect";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories (모든 카테고리 조회)
 *     description: Retrieve all product categories (Admin only) (모든 상품 카테고리 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully (카테고리 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 category:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category (새 카테고리 생성)
 *     description: Create a new product category (Admin only) (새 상품 카테고리 생성 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               categoryImage:
 *                 type: string
 *                 description: Category icon/image URL (카테고리 아이콘/이미지 URL)
 *     responses:
 *       200:
 *         description: Category created successfully (카테고리 생성 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category (카테고리 삭제)
 *     description: Delete a category by ID (Admin only) (ID로 카테고리 삭제 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID to delete (삭제할 카테고리 ID)
 *     responses:
 *       200:
 *         description: Category deleted successfully (카테고리 삭제 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "category")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await categoryModel.find({});
        res.status(200).json({ success: true, category: data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

      case "POST":
        try {
          const data = req.body;
          const image = data.categoryImage;
          const random = customId({ randomLength: 2, lowerCase: true });
          const categoryData = {
            categoryId: random,
            name: data.name.trim(),
            icon: image,
            slug: convertToSlug(data.name, false),
          };
          await categoryModel.create(categoryData);
          res.status(200).json({ success: true });
        } catch (err) {
          console.log(err);
          res.status(400).json({ success: false });
        }
        break;
  
      case "DELETE":
        try {
          const data = await categoryModel.findById(req.query.id);
          const icon = [{ Key: data.icon[0]?.name }];
          await s3DeleteFiles(icon);
          await data.remove();
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
