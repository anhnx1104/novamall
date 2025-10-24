import sessionChecker from "~/lib/sessionPermission";
import attrModel from "../../../models/attributes";
import dbConnect from "../../../utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/attributes:
 *   get:
 *     tags:
 *       - Attributes
 *     summary: Get all attributes (모든 속성 조회)
 *     description: Retrieve all product attributes (Admin only) (모든 상품 속성 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Attributes retrieved successfully (속성 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 attributes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       values:
 *                         type: array
 *                         items:
 *                           type: string
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   post:
 *     tags:
 *       - Attributes
 *     summary: Create a new attribute (새 속성 생성)
 *     description: Add a new product attribute (Admin only) (새 상품 속성 추가 - 관리자 전용)
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
 *                 example: Size
 *               value:
 *                 type: string
 *                 description: JSON string array of attribute values (속성 값의 JSON 문자열 배열)
 *                 example: '["Small","Medium","Large"]'
 *     responses:
 *       200:
 *         description: Attribute created successfully (속성 생성 성공)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   delete:
 *     tags:
 *       - Attributes
 *     summary: Delete an attribute (속성 삭제)
 *     description: Delete an attribute by ID (Admin only) (ID로 속성 삭제 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attribute ID to delete (삭제할 속성 ID)
 *     responses:
 *       200:
 *         description: Attribute deleted successfully (속성 삭제 성공)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "attribute")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const attributes = await attrModel.find({});
        res.status(200).json({ success: true, attributes });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        const body = await parseForm(req);
        const values = JSON.parse(body.field.value);
        const attr = { name: body.field.name, values };
        await attrModel.create(attr);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const id = req.query.id;
        await attrModel.findByIdAndRemove(id);
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
