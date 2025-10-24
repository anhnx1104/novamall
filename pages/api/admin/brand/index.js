import customId from "custom-id-new";
import s3DeleteFiles from "~/lib/s3Delete";
import sessionChecker from "~/lib/sessionPermission";
import { convertToSlug } from "~/middleware/functions";
import brandModel from "~/models/brand";
import dbConnect from "~/utils/dbConnect";

/**
 * @swagger
 * /api/admin/brand:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Get all brands (모든 브랜드 조회)
 *     description: Retrieve all product brands (Admin only) (모든 상품 브랜드 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Brands retrieved successfully (브랜드 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 brand:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *   post:
 *     tags:
 *       - Brands
 *     summary: Create a new brand (새 브랜드 생성)
 *     description: Create a new product brand (Admin only) (새 상품 브랜드 생성 - 관리자 전용)
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
 *                 example: Samsung
 *               categoryImage:
 *                 type: string
 *                 description: Brand image URL (브랜드 이미지 URL)
 *     responses:
 *       200:
 *         description: Brand created successfully (브랜드 생성 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *   put:
 *     tags:
 *       - Brands
 *     summary: Toggle top brand status (인기 브랜드 상태 토글)
 *     description: Toggle the top brand flag for a brand (Admin only) (브랜드의 인기 브랜드 플래그 토글 - 관리자 전용)
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
 *                 description: Brand ID (브랜드 ID)
 *     responses:
 *       200:
 *         description: Brand status updated (브랜드 상태 업데이트 완료)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 *   delete:
 *     tags:
 *       - Brands
 *     summary: Delete a brand (브랜드 삭제)
 *     description: Delete a brand by ID (Admin only) (ID로 브랜드 삭제 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID to delete (삭제할 브랜드 ID)
 *     responses:
 *       200:
 *         description: Brand deleted successfully (브랜드 삭제 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "brand")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await brandModel.find({});
        res.status(200).json({ success: true, brand: data });
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
        const brandData = {
          brandId: random,
          name: data.name.trim(),
          image: image,
          slug: convertToSlug(data.name, false),
        };
        await brandModel.create(brandData);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const { id } = req.body;
        const brand = await brandModel.findById(id);
        brand.topBrand = !brand.topBrand;
        await brand.save();
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const data = await brandModel.findById(req.query.id);
        const icon = [{ Key: data.image[0]?.name }];
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
