import productModel from "~/models/product";
import groupModel from "~/models/group";
import groupRankingModel from "~/models/groupRanking";
import pointHistoryModel from "~/models/pointHistory";
import userModel from "~/models/user";
import product from "~/models/product";

export const distributeRebatePoints = async (products) => {
  // qty만큼 productId를 복제해서 배열 생성
  const productIds = products.flatMap((item) =>
    Array(item.qty || 1).fill(item._id)
  );

  const specialProductData = await productModel
    .find({
      _id: { $in: productIds },
      isSpecial: true,
    })
    .populate("group");

  // specialProductData의 각 상품이 qty만큼 반복되도록 배열 생성
  const expandedSpecialProductData = [];
  for (const item of specialProductData) {
    const qty =
      products.find((p) => String(p._id) === String(item._id))?.qty || 1;
    for (let i = 0; i < qty; i++) {
      expandedSpecialProductData.push(item);
    }
  }

  // 특별 상품의 그룹으로 그룹 정보를 조회
  for (const item of expandedSpecialProductData) {
    // group.user_limit 만큼의 인원조회
    const groupRankingUser = await groupRankingModel
      .find({ group: item.group._id, status: { $ne: "completed" } })
      .sort({ createAt: 1 })
      .limit(item.group.user_limit)
      .populate("user");

    // 지급 할 총 포인트
    const totalPoint = (item.rebateRate * item.group.price) / 100;
    // 한 명의 유저에게 지급할 withdrawable 포인트
    const withdrawablePoint =
      (totalPoint * item.withdrawablePointRate) / 100 / item.group.user_limit;
    // 한 명의 유저에게 지급할 shopping 포인트
    const shoppingPoint =
      (totalPoint * item.shoppingPointRate) / 100 / item.group.user_limit;

    for (const user of groupRankingUser) {
      if (!user.user) {
        // 삭제된 유저의 groupRanking 레코드는 status를 completed로 변경
        await groupRankingModel.updateOne(
          { _id: user._id },
          { status: "completed" }
        );
        continue;
      }
      const userPointHistory = await pointHistoryModel
        .find({ user: user.user._id, groupRanking: user._id })
        .then((points) => points.reduce((sum, point) => sum + point.point, 0));

      // 만약 유저가 여태까지 지급받은 포인트와 이번에 지급할 포인트 의 합이 pointLimit 보다 크다면 이번에 지급시 딱 pointLimit에 맞게 지급
      if (
        userPointHistory + withdrawablePoint + shoppingPoint >=
        item.pointLimit
      ) {
        const remainingPoint = item.pointLimit - userPointHistory;

        if (remainingPoint <= 0) {
          // 남은 지급 포인트가 0 이하인 경우, 포인트 지급을 건너뜀
          await groupRankingModel.updateOne(
            { _id: user._id },
            { status: "completed" }
          );
          continue;
        }

        // withdrawablePoint와 shoppingPoint를 비율에 맞게 조정
        const adjustedWithdrawablePoint =
          (remainingPoint * item.withdrawablePointRate) /
          (item.withdrawablePointRate + item.shoppingPointRate);
        const adjustedShoppingPoint =
          (remainingPoint * item.shoppingPointRate) /
          (item.withdrawablePointRate + item.shoppingPointRate);

        // 공통 함수 사용
        await createPointHistory({
          user: user.user._id,
          pointType: "withdrawable",
          point: adjustedWithdrawablePoint,
          pointUsage: "earned",
          order: user.order,
          product: item._id,
          groupRanking: user._id,
        });
        await createPointHistory({
          user: user.user._id,
          pointType: "shopping",
          point: adjustedShoppingPoint,
          pointUsage: "earned",
          order: user.order,
          product: item._id,
          groupRanking: user._id,
        });

        // 유저에게 실제 포인트 지급
        await userModel.updateOne(
          { _id: user.user._id },
          {
            $inc: {
              withdrawablePoint: adjustedWithdrawablePoint,
              shoppingPoint: adjustedShoppingPoint,
              totalWithdrawablePoint: adjustedWithdrawablePoint,
              totalShoppingPoint: adjustedShoppingPoint,
            },
          }
        );

        await groupRankingModel.updateOne(
          { _id: user._id },
          { status: "completed" }
        );
      } else {
        await createPointHistory({
          user: user.user._id,
          pointType: "withdrawable",
          point: withdrawablePoint,
          pointUsage: "earned",
          order: user.order,
          product: item._id,
          groupRanking: user._id,
        });
        await createPointHistory({
          user: user.user._id,
          pointType: "shopping",
          point: shoppingPoint,
          pointUsage: "earned",
          order: user.order,
          product: item._id,
          groupRanking: user._id,
        });

        // 유저에게 실제 포인트 지급
        await userModel.updateOne(
          { _id: user.user._id },
          {
            $inc: {
              withdrawablePoint: withdrawablePoint,
              shoppingPoint: shoppingPoint,
              totalWithdrawablePoint: withdrawablePoint,
              totalShoppingPoint: shoppingPoint,
            },
          }
        );
      }
    }
  }
};

export const registerGroupRanking = async (products, order, userId) => {
  // qty만큼 productId를 복제해서 배열 생성
  const productIds = products.flatMap((item) =>
    Array(item.qty || 1).fill(item._id)
  );

  const specialProductData = await productModel
    .find({
      _id: { $in: productIds },
      isSpecial: true,
    })
    .populate("group");

  // specialProductData의 각 상품이 qty만큼 반복되도록 배열 생성
  const expandedSpecialProductData = [];
  for (const item of specialProductData) {
    const qty =
      products.find((p) => String(p._id) === String(item._id))?.qty || 1;
    for (let i = 0; i < qty; i++) {
      expandedSpecialProductData.push(item);
    }
  }

  for (const item of expandedSpecialProductData) {
    await groupRankingModel.create({
      group: item.group._id,
      user: userId,
      order: order._id,
      product: item._id,
      status: "progress",
    });
  }
};

export const createPointHistory = async ({
  user,
  pointType,
  point,
  pointUsage,
  order,
  status = "completion",
  product,
  groupRanking,
}) => {
  if (!point || point === 0) return;
  await pointHistoryModel.create({
    user,
    pointType,
    point,
    pointUsage,
    order,
    status,
    product,
    groupRanking,
  });
};
