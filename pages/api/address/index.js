import { getToken } from "next-auth/jwt";
import UserModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";
import xss from "xss";

/**
 * @swagger
 * /api/address:
 *   post:
 *     tags:
 *       - Address
 *     summary: Update user address (사용자 주소 업데이트)
 *     description: Update or add user's shipping/billing address (사용자의 배송/청구 주소 업데이트 또는 추가)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully (주소 업데이트 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 금지)
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
        const body = req.body;
        let obj = {};
        for (const x in body) {
          if (Object.hasOwnProperty.call(body, x)) {
            const el = body[x];
            const cleanData = xss(el);
            obj[x] = cleanData;
          }
        }
        const r = await UserModel.updateOne({ _id: session.user.id }, obj);
        res.status(200).json({
          success: r.modifiedCount && r.modifiedCount === 1 ? true : false,
        });
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
