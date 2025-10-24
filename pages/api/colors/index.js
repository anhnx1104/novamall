import sessionChecker from "~/lib/sessionPermission";
import colorModel from "../../../models/colors";
import dbConnect from "../../../utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/colors:
 *   get:
 *     tags:
 *       - Colors
 *     summary: Get all colors (모든 색상 조회)
 *     description: Retrieve all available product colors (사용 가능한 모든 상품 색상 조회)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Colors retrieved successfully (색상 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 colors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       value:
 *                         type: string
 *                         description: Hex color code (16진수 색상 코드)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   post:
 *     tags:
 *       - Colors
 *     summary: Create a new color (새 색상 생성)
 *     description: Add a new color option (Admin only) (새 색상 옵션 추가 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - value
 *             properties:
 *               name:
 *                 type: string
 *                 example: Red
 *               value:
 *                 type: string
 *                 example: "#FF0000"
 *     responses:
 *       200:
 *         description: Color created successfully (색상 생성 성공)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   delete:
 *     tags:
 *       - Colors
 *     summary: Delete a color (색상 삭제)
 *     description: Delete a color by ID (Admin only) (ID로 색상 삭제 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Color ID to delete (삭제할 색상 ID)
 *     responses:
 *       200:
 *         description: Color deleted successfully (색상 삭제 성공)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "color", true)))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const colors = await colorModel.find({}).sort("-_id");
        res.status(200).json({ success: true, colors });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        if (!(await sessionChecker(req, "color")))
          return res
            .status(403)
            .json({ success: false, message: "Access Forbidden" });

        const body = await parseForm(req);
        const color = {
          name: body.field.name.trim(),
          value: body.field.value.trim(),
        };
        await colorModel.create(color);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        if (!(await sessionChecker(req, "color")))
          return res
            .status(403)
            .json({ success: false, message: "Access Forbidden" });
        
        const id = req.query.id;
        await colorModel.findByIdAndRemove(id);
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
