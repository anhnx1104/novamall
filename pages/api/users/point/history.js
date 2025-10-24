import sessionChecker from "~/lib/sessionPermission";
import userModel from "~/models/user";
import pointHistoryModel from "~/models/pointHistory";
import dbConnect from "~/utils/dbConnect";

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
        // 유저의 포인트 사용 내역 조회 api
        const { id } = req.query;

        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(id);

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        const pointHistory = await pointHistoryModel
          .find({ user: user._id, pointUsage: { $ne: "earned" } })
          .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: pointHistory });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    case "PUT":
      try {
        // 유저의 출금 및 상품권 구매 요청을 처리하는 api
        const { id } = req.body;

        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "User ID is required" });
        }

        const pointHistory = await pointHistoryModel.findOne({
          _id: id,
          pointUsage: { $nin: ["earned", "purchase"] },
        });

        if (!pointHistory) {
          return res
            .status(404)
            .json({ success: false, message: "Point history not found" });
        }

        pointHistory.status = "completion";

        await pointHistory.save();

        res.status(200).json({ success: true, pointHistory });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
