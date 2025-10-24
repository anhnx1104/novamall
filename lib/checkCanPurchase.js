import userModel from "~/models/user";

export const checkCanPurchase = async (products, userId) => {
    //상품에 일반 상품이 있는 지 확인
    const normalProduct = products.find((item) => !item.isSpecial);
    if (!normalProduct) return true; // 일반 상품이 없으면 구매 가능

    //상품에 일반 상품이 있다면 유저의 레벨 및 경험치를 조회
    const user = await userModel.findById(userId);
    if (!user) return false; // 유저가 없으면 구매 불가
    const { level, level_exp } = user;

    //레벨이 0 이상이거나 경험치가 0 이상이면 구매 가능
    const canPurchase = level > 0 || level_exp > 0;
    return canPurchase;
}