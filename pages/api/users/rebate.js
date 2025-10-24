import sessionChecker from "~/lib/sessionPermission";
import groupRankingModel from "~/models/groupRanking";
import groupModel from "~/models/group";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";
import pointHistoryModel from "~/models/pointHistory";
import { parseFormMultiple } from "~/utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        const { userId } = req.query;

        const data = await groupRankingModel
          .find({ user: userId })
          .populate("group", "name price user_limit")
          .populate("product", "name pointLimit");

        if (!data || data.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "No data found for this user" });
        }

        // 각 데이터 별 그룹의 랭킹, 포인트
        const groupRankings = await Promise.all(
          data.map(async (item) => {
            const groupId = item.group._id;

            // 여태까지 적립한 포인트 계산
            const totalEarnedPoint = await pointHistoryModel
              .find({
                user: userId,
                group: groupId,
                order: item.order,
                pointUsage: "earned",
                groupRanking: item._id,
              })
              .then((points) =>
                points.reduce((sum, point) => sum + point.point, 0)
              );

            if (item.status === "completed") {
              // completed 상태일 경우 ranking을 null로 설정
              return {
                ...item.toObject(),
                totalEarnedPoint: totalEarnedPoint,
                ranking: null,
              };
            }

            // 해당 그룹에 속한 모든 순위 가져오기
            const allRankings = await groupRankingModel
              .find({ group: groupId, status: { $ne: "completed" } })
              .sort({ createAt: 1 }); // 생성일 기준으로 정렬

            // 현재 유저의 순위 계산
            const rankingIndex = allRankings.findIndex(
              (ranking) => ranking._id.toString() === item._id.toString()
            );

            return {
              ...item.toObject(),
              totalEarnedPoint: totalEarnedPoint,
              ranking: rankingIndex + 1,
            };
          })
        );

        res.status(200).json({ success: true, data: groupRankings });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const data = await parseFormMultiple(req);
        const { id, status } = data.field;

        await groupRankingModel.updateOne({ _id: id }, { status: status });

        res
          .status(200)
          .json({ success: true, message: "Status updated successfully" });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
