import dbConnect from "../../../../utils/dbConnect";
import sessionChecker from "~/lib/sessionPermission";
import groupModel from "../../../../models/group";
import productModel from "../../../../models/product";
import groupRankingModel from "../../../../models/groupRanking";
import pointHistoryModel from "../../../../models/pointHistory";
import group from "../../../../models/group";

export default async function apiHandler(req, res) {
  const { method } = req;

  // 인증 및 권한 확인
  if (!(await sessionChecker(req, "group"))) {
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });
  }

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // 유저 진행상황 리스트 조회
        const { groupId } = req.query;

        if (!groupId) {
          return res
            .status(400)
            .json({ success: false, message: "Group ID is required" });
        }

        const allRankings = await groupRankingModel
          .find({ group: groupId })
          .populate("group", "name price")
          .populate("user", "email")
          .populate("order", "orderDate")
          .populate("product", "name pointLimit")
          .sort({ createdAt: 1 });

        const progressing = allRankings.filter((r) => r.status !== "completed");

        const result = [];
        for (const ranking of allRankings) {
          const pointHistory = await pointHistoryModel.find({
            groupRanking: ranking._id,
            pointUsage: "earned",
          });

          let totalWithdrawable = 0;
          let totalShopping = 0;
          for (const historyItem of pointHistory) {
            if (historyItem.pointType === "withdrawable") {
              totalWithdrawable += historyItem.point;
            } else if (historyItem.pointType === "shopping") {
              totalShopping += historyItem.point;
            }
          }

          // 진행중인 것만 rank 부여, 완료는 null
          let rank = null;
          if (ranking.status !== "completed") {
            rank = progressing.findIndex((r) => r._id.equals(ranking._id)) + 1;
          }

          result.push({
            ...ranking.toObject(),
            rank,
            totalWithdrawable,
            totalShopping,
          });
        }

        res.status(200).json({ success: true, data: result });
      } catch (err) {
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch group user" });
      }
      break;

    default:
      res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
      break;
  }
}
