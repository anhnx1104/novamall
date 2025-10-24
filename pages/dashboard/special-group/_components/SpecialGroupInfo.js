import React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const SpecialGroupInfo = ({ group }) => {
  const router = useRouter();
  const { slug } = router.query;

  if (!group) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h5 className="mb-4 fw-bold">그룹 상세 정보</h5>

      <div className="row border-bottom py-3 mx-0">
        <div className="col-md-3 col-12 text-secondary mb-1 mb-md-0">
          그룹명
        </div>
        <div className="col-md-9 col-12 fw-medium">{group.name}</div>
      </div>

      <div className="row border-bottom py-3 mx-0">
        <div className="col-md-3 col-12 text-secondary mb-1 mb-md-0">
          그룹 가격
        </div>
        <div className="col-md-9 col-12 fw-medium">
          {formatNumberWithCommaAndFloor(group.price)}
        </div>
      </div>

      <div className="row border-bottom py-3 mx-0">
        <div className="col-md-3 col-12 text-secondary mb-1 mb-md-0">
          유저 한도 수
        </div>
        <div className="col-md-9 col-12 fw-medium">{group.user_limit}</div>
      </div>

      <div className="row py-3 mx-0">
        <div className="col-md-3 col-12 text-secondary mb-1 mb-md-0">
          등록된 상품 수
        </div>
        <div className="col-md-9 col-12 fw-medium">
          {group.productCount || 0}
        </div>
      </div>
    </div>
  );
};

export default SpecialGroupInfo;
