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
    // 그룹 조회
    case "GET":
      try {
        const { productId, page = 1, pageSize = 10 } = req.query;
        if (!productId) {
          return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const specialProduct = await productModel
            .findOne({ _id: productId, isSpecial: true })
            .populate("group", "name price user_limit")

        const rankingList = [];
        const groupRankingList = await groupRankingModel
            .find({
                group: specialProduct.group,
                status: { $ne: "completed" },
            })
            .sort({ createdAt: 1 })
            .populate("user", "email name")
            .populate("group", "name price user_limit")
            .populate("product", "name pointLimit")
        
        // 각 랭킹으로 얻은 포인트 합산
        for (const ranking of groupRankingList) {
            const pointHistory = await pointHistoryModel.find({
              groupRanking: ranking._id,
              pointUsage: "earned",
            });
        
            let totalWithdrawable = 0;
            let totalShopping = 0;
        
            // pointHistory를 순회하며 pointType별로 합산
            for (const historyItem of pointHistory) {
            if (historyItem.pointType === "withdrawable") {
                totalWithdrawable += historyItem.point;
            } else if (historyItem.pointType === "shopping") {
                totalShopping += historyItem.point;
            }
            }
        
            // 필요한 정보를 객체로 만들어 결과 배열에 푸시
            rankingList.push({
                groupRankingId: ranking._id,
                user: ranking.user,
                group: ranking.group,
                product: ranking.product,
                totalWithdrawable,
                totalShopping,
                status : ranking.status,
                createdAt: ranking.createdAt,
            });
        }

        rankingList.forEach((item, index) => {
            item.rank = index + 1;
        });

        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;

        const paginatedRankings = rankingList.slice(startIndex, endIndex);

        const result = {
            rankingList: paginatedRankings,
            totalItems: rankingList.length,
            totalPages: Math.ceil(rankingList.length / pageSize),
            currentPage: parseInt(page, 10),
            pageSize: parseInt(pageSize, 10),
            groupPrice: specialProduct.group.price,
            pointLimit: specialProduct.pointLimit,
            userLimit: specialProduct.group.user_limit,
          };

        res.status(200).json({ success: true, data: result });
      } catch (err) {
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch group product" });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid request method" });
      break;
  }
}