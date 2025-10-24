
import productModel from "~/models/product";
import groupModel from "~/models/group";
import groupRankingModel from "~/models/groupRanking";
import pointHistoryModel from "~/models/pointHistory";
import userModel from "~/models/user";
import product from "~/models/product";

export const levelUpUser = async (products, order, userId) => {
    const LEVEL_UNIT = 100000;

    // qty만큼 productId를 복제해서 배열 생성
    const productIds = products.flatMap((item) =>
        Array(item.qty || 1).fill(item._id)
    );

    const specialProductData = await productModel
        .find({
            _id: { $in: productIds },
            isSpecial: true,
        })
        .select("group")
        .populate("group", "price");

    // specialProductData의 각 상품이 qty만큼 반복되도록 배열 생성
    const expandedSpecialProductData = [];
    for (const item of specialProductData) {
        const qty = products.find((p) => String(p._id) === String(item._id))?.qty || 1;
        for (let i = 0; i < qty; i++) {
            expandedSpecialProductData.push(item);
        }
    }

    // expandedSpecialProductData의 모든 group.price 합산
    const totalSpecialProductPrice = expandedSpecialProductData.reduce(
        (sum, item) => sum + (item.group?.price || 0),
        0
    );

    // 유저 정보 조회
    const user = await userModel.findById(userId);
    if (!user) return;

    // 기존 exp와 합산
    let totalExp = (user.level_exp || 0) + totalSpecialProductPrice;
    let levelUp = Math.floor(totalExp / LEVEL_UNIT);
    let remainExp = totalExp % LEVEL_UNIT;

    if (levelUp > 0) {
        await userModel.findByIdAndUpdate(
        userId,
        { $inc: { level: levelUp }, $set: { level_exp: remainExp } },
        { new: true }
        );
    } else {
        await userModel.findByIdAndUpdate(
        userId,
        { $set: { level_exp: remainExp } },
        { new: true }
        );
    }
}