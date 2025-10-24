const bcrypt = require("bcryptjs");
import userModel from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user (신규 사용자 등록)
 *     description: Create a new user account with email and password (이메일과 비밀번호로 새 사용자 계정 생성)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registration successful or duplicate email (사용자 등록 성공 또는 중복 이메일)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 duplicate:
 *                   type: boolean
 *       400:
 *         description: Registration failed (등록 실패)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const data = await parseForm(req);
        const { name, email, password } = data.field;
        const salt = await bcrypt.genSalt(6);
        const hash = await bcrypt.hash(password, salt);
        const userData = { name, email, hash, salt };
        await userModel.create(userData);
        res.status(200).json({ success: true });
      } catch (err) {
        if (err && err.code == 11000) {
          console.log(err);
          res.status(200).json({ success: false, duplicate: true });
        } else {
          console.log(err);
          res.status(400).json({ success: false, duplicate: false });
        }
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
