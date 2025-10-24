export const POINT_TYPE = {
  shopping: "shopping",
  withdrawable: "withdrawable",
};
export const POINT_TYPE_TEXT = {
  [POINT_TYPE.shopping]: "쇼핑 포인트",
  [POINT_TYPE.withdrawable]: "출금 가능 포인트",
};

export const POINT_USAGE = {
  voucher: "voucher",
  purchase: "purchase",
  withdrawal: "withdrawal",
  earned: "earned",
  send: "send",
};
export const POINT_USAGE_TEXT = {
  [POINT_USAGE.voucher]: "상품권 구매",
  [POINT_USAGE.purchase]: "상품 구매",
  [POINT_USAGE.withdrawal]: "출금 신청",
  [POINT_USAGE.earned]: "포인트 적립",
  [POINT_USAGE.send]: "포인트 전송",
};

export const POINT_TYPE_USE_TEXT = {
  [POINT_USAGE.voucher]: "포인트 사용",
  [POINT_USAGE.purchase]: "포인트 사용",
  [POINT_USAGE.withdrawal]: "포인트 사용",
  [POINT_USAGE.send]: "포인트 사용",
  [POINT_USAGE.earned]: "포인트 적립",
};

export const POINT_STATUS = {
  pending: "pending",
  completion: "completion",
};
export const POINT_STATUS_TEXT = {
  [POINT_STATUS.pending]: "대기",
  [POINT_STATUS.completion]: "완료",
};
