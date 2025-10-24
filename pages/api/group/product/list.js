import dbConnect from "../../../../utils/dbConnect";
import sessionChecker from "~/lib/sessionPermission";
import groupModel from "../../../../models/group";
import productModel from "../../../../models/product";
import groupRankingModel from "../../../../models/groupRanking";
import pointHistoryModel from "../../../../models/pointHistory";
import orderModel from "../../../../models/order";
import group from "../../../../models/group";
import product from "../../../../models/product";

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
    // 특별 그룹의 상품 리스트 조회 API
    case "GET":
      try {
        const { groupId } = req.query;

        const specialProductList = await productModel
          .find({
            group: groupId,
            isSpecial: true,
          })
          .populate("group", "name price user_limit")
          .select("name user_limit isSpecial rebateRate image price slug");

        const specialProductIds = specialProductList.map((prod) =>
          prod._id.toString()
        );

        if (specialProductIds.length === 0) {
          return res.status(200).json({ success: true, data: [] });
        }

        for (const prod of specialProductList) {
          const groupRankingDone = await groupRankingModel.find({
            group: groupId,
            product: prod._id,
            status: "completed",
          });
          const groupRankingList = await groupRankingModel.find({
            group: groupId,
            product: prod._id,
            status: { $ne: "completed" },
          });

          // 대기 중인 유저 수
          const groupRankingUserWaitingCount = Math.max(
            groupRankingList.length - prod.group.user_limit,
            0
          );

          // 상품 구매 수
          const productOrderCount = await orderModel.aggregate([
            {
              $match: {
                paymentStatus: "Paid",
                products: {
                  $elemMatch: {
                    _id: prod._id.toString(),
                  },
                },
              },
            },
            {
              $unwind: "$products",
            },
            {
              $match: {
                "products._id": prod._id.toString(),
              },
            },
          ]);

          // 구매 유저 수
          const uniqueUserIds = new Set();
          for (const order of productOrderCount) {
            if (order.user.length > 0)
              uniqueUserIds.add(order.user[0]._id.toString());
          }

          prod._doc.productOrderUserCount = uniqueUserIds.size;
          prod._doc.productOrderCount = productOrderCount.length;
          prod._doc.groupRankingUserDoneCount = groupRankingDone.length;
          prod._doc.groupRankingUserWaitingCount = groupRankingUserWaitingCount;
          prod._doc.groupRankingUserProgressCount =
            groupRankingList.length - groupRankingUserWaitingCount;
        }

        res.status(200).json({ success: true, data: specialProductList });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch group product list",
        });
      }
      break;

    default:
      res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
      break;
  }
}
