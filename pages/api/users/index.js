import sessionChecker from "~/lib/sessionPermission";
import userModel from "~/models/user";
import groupRankingModel from "~/models/groupRanking";
import addressModel from "~/models/address";
import dbConnect from "~/utils/dbConnect";
import mongoose from "mongoose";

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users list or specific user (사용자 목록 또는 특정 사용자 조회)
 *     description: Retrieve all users or a specific user by ID (Admin only) (모든 사용자 또는 ID로 특정 사용자 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: User ID to retrieve specific user (특정 사용자 조회를 위한 사용자 ID)
 *     responses:
 *       200:
 *         description: Users retrieved successfully (사용자 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Access forbidden (접근 금지)
 *       404:
 *         description: User not found (사용자를 찾을 수 없음)
 *       500:
 *         description: Server error (서버 오류)
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user (사용자 삭제)
 *     description: Soft delete a user account (Admin only) (사용자 계정 소프트 삭제 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete (삭제할 사용자 ID)
 *     responses:
 *       200:
 *         description: User deleted successfully (사용자 삭제 성공)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       404:
 *         description: User not found (사용자를 찾을 수 없음)
 *       500:
 *         description: Server error (서버 오류)
 */
export default async function apiHandler(req, res) {
  const { method } = req;

  if (!(await sessionChecker(req, "customers")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // If id is provided, return single user details
        if (req.query.id) {
          const user = await userModel
            .findById(req.query.id)
            .select(["-hash", "-salt", "-isAdmin"])

          const userAddress = await addressModel.find({
            userId: req.query.id,
          });

          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }

          user._doc.addressList = userAddress

          return res.status(200).json({ success: true, user });
        }

        // Otherwise return all users
        const users = await userModel
          .find({ isAdmin: false, "isStaff.status" : false ,isDeleted: false})
          .select(["-hash", "-salt", "-isAdmin"])
          .sort("-createdAt");
        res.status(200).json({ success: true, users });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        // await userModel.findByIdAndRemove(req.query.id);
        const user = await userModel.findById(req.query.id);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
        user.isDeleted = true;
        await user.save();

        await groupRankingModel.deleteMany({
          user: user._id,
        });

        await mongoose.connection.db.collection("accounts").deleteMany({
          userId: new mongoose.Types.ObjectId(req.query.id),
        });

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
