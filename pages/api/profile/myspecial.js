import { getToken } from "next-auth/jwt";
import userModel from "../../../models/user";
import groupRankingModel from "../../../models/groupRanking";
import productModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";
import pointHistoryModel from "~/models/pointHistory";

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
    case "GET":
      try {
        // 1. groupRanking 조회
        const rankingData = await groupRankingModel
          .find({ user: session.user.id })
          .sort({ createAt: -1 })
          .select("_id product status createAt")
          .populate("product", "name image pointLimit")
          .lean();

        // 2. groupRanking ID 목록
        const rankingIds = rankingData.map((item) => item._id);

        // 3. pointHistory에서 groupRanking별로 shopping/withdrawable 합산
        const pointsAggregation = await pointHistoryModel.aggregate([
          {
            $match: {
              groupRanking: { $in: rankingIds },
              pointUsage: "earned",
            },
          },
          {
            $group: {
              _id: {
                groupRanking: "$groupRanking",
                pointType: "$pointType",
              },
              totalPoints: { $sum: "$point" },
            },
          },
        ]);

        // 4. aggregation 결과를 groupRanking ID별로 저장
        const pointsMap = {};
        for (const agg of pointsAggregation) {
          const grId = agg._id.groupRanking.toString();
          const pType = agg._id.pointType; // "shopping" or "withdrawable"
          const pSum = agg.totalPoints || 0;

          if (!pointsMap[grId]) {
            pointsMap[grId] = { shopping: 0, withdrawable: 0 };
          }

          if (pType === "shopping") {
            pointsMap[grId].shopping = pSum;
          } else if (pType === "withdrawable") {
            pointsMap[grId].withdrawable = pSum;
          }
        }

        // 5. rankingData에 합계 포인트를 추가
        for (const item of rankingData) {
          const rid = item._id.toString();
          const pointsInfo = pointsMap[rid] || { shopping: 0, withdrawable: 0 };

          item.totalShoppingPoints = pointsInfo.shopping;
          item.totalWithdrawablePoints = pointsInfo.withdrawable;
        }

        res.status(200).json({ success: true, data: rankingData });
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
