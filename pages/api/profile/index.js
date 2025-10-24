const bcrypt = require("bcryptjs");
import { getToken } from "next-auth/jwt";
import UserModel from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile (사용자 프로필 조회)
 *     description: Retrieve user profile data including orders, favorites, or refund requests (주문, 즐겨찾기 또는 환불 요청을 포함한 사용자 프로필 데이터 조회)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (사용자 ID)
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [orders, favorite, refund]
 *         description: Data scope to retrieve (조회할 데이터 범위)
 *     responses:
 *       200:
 *         description: User profile retrieved successfully (사용자 프로필 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 거부)
 *   post:
 *     tags:
 *       - Users
 *     summary: Update user profile (사용자 프로필 업데이트)
 *     description: Update user information or password (사용자 정보 또는 비밀번호 업데이트)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (사용자 ID)
 *       - in: query
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *           enum: [info, password]
 *         description: Update scope - info or password (업데이트 범위 - 정보 또는 비밀번호)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 description: User information update (사용자 정보 업데이트)
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   house:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               - type: object
 *                 description: Password update (비밀번호 업데이트)
 *                 properties:
 *                   password:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully (프로필 업데이트 성공)
 *       400:
 *         description: Bad request or duplicate email (잘못된 요청 또는 중복된 이메일)
 *       403:
 *         description: Access forbidden (접근 거부)
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

  const removedItem = [
    "-hash",
    "-salt",
    "-isAdmin",
    "-resetPasswordExpires",
    "-resetPasswordToken",
    "-__v",
    "-createdAt",
    "-updatedAt",
    "-isStaff",
    "-emailVerified",
    "-confirmationCode",
    "-notification",
  ];

  switch (method) {
    case "GET":
      try {
        const scope = req.query.scope;
        let userData = {};
        switch (scope) {
          case "orders":
            userData = await UserModel.findById(req.query.id)
              .select([
                ...removedItem,
                "-wallet",
                "-favorite",
                "-address",
                "-refundRequest",
              ])
              .populate(
                "orders",
                {
                  _id: 0,
                  __V: 0,
                  new: 0,
                  user: 0,
                },
                null,
                { sort: { orderDate: -1 } }
              );
            break;

          case "favorite":
            userData = await UserModel.findById(req.query.id)
              .select([
                ...removedItem,
                "-orders",
                "-address",
                "-wallet",
                "-refundRequest",
                "-bankInfo",
              ])
              .populate("favorite")
              .exec();
            break;

          case "refund":
            userData = await UserModel.findById(req.query.id)
              .select([
                ...removedItem,
                "-orders",
                "-address",
                "-wallet",
                "-favorite",
                "-bankInfo",
              ])
              .populate("refundRequest", {}, null, { sort: { _id: -1 } })
              .exec();
            break;

          default:
            userData = await UserModel.findById(req.query.id)
              .select(removedItem)
              .exec();
            break;
        }
        res.status(200).json({ success: true, user: userData });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { query, body } = req;
        const bodyData = body;
        const userData = await UserModel.findById(query.id);
        if (!userData) {
          return res.status(400).json({ success: false });
        }
        switch (query.scope) {
          case "info":
            userData.name = bodyData.name;
            userData.email = bodyData.email;
            userData.phone = bodyData.phone;
            userData.house = bodyData.house;
            userData.city = bodyData.city;
            userData.state = bodyData.state;
            userData.zipCode = bodyData.zipCode;
            userData.country = bodyData.country;
            await userData.save();
            break;

          case "password":
            const salt = await bcrypt.genSalt(6);
            const hash = await bcrypt.hash(bodyData.password, salt);
            userData.salt = salt;
            userData.hash = hash;
            await userData.save();
            break;

          default:
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        if (err && err.code === 11000) {
          return res.status(400).json({ success: false, duplicate: true });
        }
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
