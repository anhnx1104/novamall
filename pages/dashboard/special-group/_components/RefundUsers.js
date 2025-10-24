import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "@styled-icons/bootstrap";
import { useRouter } from "next/router";
import { fetchData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";
import useSWR from "swr";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const RefundUsers = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, error, mutate } = useSWR(`/api/group?id=${slug}`, fetchData);
  const [status, setStatus] = useState("progress");
  const [allPurchases, setAllPurchases] = useState([]);
  const [completedPurchases, setCompletedPurchases] = useState([]);
  const [progressPurchases, setProgressPurchases] = useState([]);
  const [waitingPurchases, setWaitingPurchases] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData(`/api/group/user?groupId=${slug}`)
      .then((res) => {
        if (res.success) {
          setAllPurchases(res.data);
          const completedPurchases = res.data.filter(
            (purchase) => purchase.status === "completed"
          );
          const progressPurchases = res.data.filter(
            (purchase) => purchase.status === "progress"
          );

          const userLimit = data.data?.user_limit || 0;

          const topProgress = progressPurchases.slice(0, userLimit);
          const waitingPurchases = progressPurchases.slice(userLimit);

          setWaitingPurchases(waitingPurchases);
          setProgressPurchases(topProgress);
          setCompletedPurchases(completedPurchases);
        } else {
          toast.error("유저 진행상황 리스트 조회 실패");
        }
      })
      .catch(() => toast.error("유저 진행상황 리스트 조회dd 실패"));
  }, []);

  // Tabs for filtering by group type
  const [activeTab, setActiveTab] = useState("진행 중인 내역");

  const getTotals = (list) => {
    return {
      purchaseAmount: list.reduce(
        (sum, item) => sum + (Number(item.group?.price) || 0),
        0
      ),
      pointAmount: list.reduce(
        (sum, item) => sum + (Number(item.product?.pointLimit) || 0),
        0
      ),
      accumulatedPoints: list.reduce(
        (sum, item) => sum + (Number(item.totalWithdrawable) || 0),
        0
      ),
      refundPoints: list.reduce(
        (sum, item) => sum + (Number(item.totalShopping) || 0),
        0
      ),
    };
  };

  // 검색 필터링
  const filterPurchases = (members) => {
    if (!search.trim()) return members;
    return members.filter((member) => {
      const email = member.user?.email?.toLowerCase() || "";
      const productName = member.product?.name?.toLowerCase() || "";
      const keyword = search.toLowerCase();
      return (
        email.includes(keyword) ||
        name.includes(keyword) ||
        productName.includes(keyword)
      );
    });
  };

  // 초기화 버튼
  const handleReset = () => {
    setSearch("");
  };

  // 진행 중인 내역
  const filteredProgress = filterPurchases(progressPurchases);
  const progressTotals = getTotals(filteredProgress);

  // 완료된 내역
  const filteredCompleted = filterPurchases(completedPurchases);
  const completedTotals = getTotals(filteredCompleted);

  // 대기 중인 내역
  const filteredWaiting = filterPurchases(waitingPurchases);

  return (
    <div>
      <h2 className="mb-3 fw-bold" style={{ fontSize: "20px" }}>
        유저 진행상황
      </h2>

      {/* Search bar */}
      <div className="d-flex flex-column flex-md-row gap-2 gap-md-0 mb-4">
        <div className="position-relative w-100" style={{ maxWidth: "600px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="유저 ID, 이름 또는 상품명으로 검색..."
            style={{
              paddingLeft: "40px",
              height: "38px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span
            className="position-absolute"
            style={{
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
            }}
          >
            <Search size={16} />
          </span>
        </div>
        <button
          className="btn btn-outline-dark btn-sm px-3 ms-md-3"
          style={{
            height: "38px",
            fontSize: "14px",
            alignSelf: "flex-start",
          }}
          onClick={handleReset}
        >
          초기화
        </button>
      </div>

      {/* Tabs for filtering */}
      <div className="mb-4 overflow-auto">
        <ul className="nav nav-pills flex-nowrap" style={{ fontSize: "14px" }}>
          <li className="nav-item me-2">
            <button
              className={`nav-link px-3 py-2 ${
                activeTab === "진행 중인 내역" ? "active" : ""
              }`}
              onClick={() => setActiveTab("진행 중인 내역")}
              style={{
                borderRadius: "4px",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                border: "none",
                fontWeight: activeTab === "진행 중인 내역" ? "bold" : "normal",
                whiteSpace: "nowrap",
              }}
            >
              진행 중인 내역
            </button>
          </li>
          <li className="nav-item me-2">
            <button
              className={`nav-link px-3 py-2 ${
                activeTab === "대기 중인내역" ? "active" : ""
              }`}
              onClick={() => setActiveTab("대기 중인 내역")}
              style={{
                borderRadius: "4px",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                border: "none",
                fontWeight: activeTab === "대기 중인 내역" ? "bold" : "normal",
                whiteSpace: "nowrap",
              }}
            >
              대기 중인 내역
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link px-3 py-2 ${
                activeTab === "완료된 내역" ? "active" : ""
              }`}
              onClick={() => setActiveTab("완료된 내역")}
              style={{
                borderRadius: "4px",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                border: "none",
                position: "relative",
                fontWeight: activeTab === "완료된 내역" ? "bold" : "normal",
                whiteSpace: "nowrap",
              }}
            >
              완료된 내역
            </button>
          </li>
        </ul>
      </div>

      {/* Table for 전체등록내역 */}
      {activeTab === "진행 중인 내역" && (
        <div className="table-responsive">
          <table
            className="table"
            style={{ fontSize: "14px", minWidth: "900px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "600" }}>
                <th
                  className="ps-3 py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  유저 ID
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  상품명
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매일
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매 금액
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  포인트 적립 한도
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  출금 가능 포인트
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  쇼핑몰 포인트
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProgress.map((purchase) => (
                <tr
                  key={purchase._id}
                  className="align-middle"
                  style={{ height: "56px", borderBottom: "1px solid #dee2e6" }}
                >
                  <td className="ps-3">{purchase.user?.email}</td>
                  <td>{purchase.product.name}</td>
                  <td>
                    {purchase.order.orderDate
                      ? new Date(purchase.order.orderDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{formatNumberWithCommaAndFloor(purchase.group.price)}</td>
                  <td>
                    {formatNumberWithCommaAndFloor(purchase.product.pointLimit)}
                  </td>
                  <td>
                    {formatNumberWithCommaAndFloor(purchase.totalWithdrawable)}
                  </td>
                  <td>
                    {formatNumberWithCommaAndFloor(purchase.totalShopping)}
                  </td>
                </tr>
              ))}
              <tr
                className="align-middle fw-bold"
                style={{
                  height: "56px",
                  borderBottom: "1px solid #dee2e6",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <td className="ps-3" colSpan="3">
                  합계:
                </td>
                <td>{progressTotals.purchaseAmount.toLocaleString()}원</td>
                <td>{progressTotals.pointAmount.toLocaleString()}원</td>
                <td>{progressTotals.accumulatedPoints.toLocaleString()}P</td>
                <td>{progressTotals.refundPoints.toLocaleString()}P</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Table for 대기중내역 */}
      {activeTab === "대기 중인 내역" && (
        <div className="table-responsive">
          <table
            className="table"
            style={{ fontSize: "14px", minWidth: "900px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "600" }}>
                <th
                  className="ps-3 py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  유저 ID
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  상품명
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매일
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매 금액
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  전체 순위
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  대기 순위
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  포인트 적립 한도
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWaiting.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="align-middle"
                  style={{ height: "56px", borderBottom: "1px solid #dee2e6" }}
                >
                  <td className="ps-3">{purchase.user?.email}</td>
                  <td>{purchase.product.name}</td>
                  <td>
                    {purchase.order.orderDate
                      ? new Date(purchase.order.orderDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{formatNumberWithCommaAndFloor(purchase.group.price)}</td>
                  <td>
                    {purchase.rank}/
                    {progressPurchases.length + waitingPurchases.length}
                  </td>
                  <td>{purchase.rank - data.data.user_limit}</td>
                  <td>
                    {formatNumberWithCommaAndFloor(purchase.product.pointLimit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table for 완료된내역 */}
      {activeTab === "완료된 내역" && (
        <div className="table-responsive">
          <table
            className="table"
            style={{ fontSize: "14px", minWidth: "900px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "600" }}>
                <th
                  className="ps-3 py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  유저 ID
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  상품명
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매일
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  완료일
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매 금액
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  포인트 적립 한도
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  출금 가능 포인트
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  쇼핑몰 포인트
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCompleted.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="align-middle"
                  style={{ height: "56px", borderBottom: "1px solid #dee2e6" }}
                >
                  <td className="ps-3">{purchase.user?.email}</td>
                  <td>{purchase.product.name}</td>
                  <td>
                    {purchase.order.orderDate
                      ? new Date(purchase.order.orderDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    {purchase.updatedAt
                      ? new Date(purchase.updatedAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{formatNumberWithCommaAndFloor(purchase.group.price)}</td>
                  <td>
                    {formatNumberWithCommaAndFloor(purchase.product.pointLimit)}
                  </td>
                  <td>
                    {formatNumberWithCommaAndFloor(purchase.totalWithdrawable)}
                  </td>
                  <td>
                    {formatNumberWithCommaAndFloor(purchase.totalShopping)}
                  </td>
                </tr>
              ))}
              <tr
                className="align-middle fw-bold"
                style={{
                  height: "56px",
                  borderBottom: "1px solid #dee2e6",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <td className="ps-3" colSpan="4">
                  합계:
                </td>
                <td>{completedTotals.purchaseAmount.toLocaleString()}원</td>
                <td>{completedTotals.pointAmount.toLocaleString()}원</td>
                <td>{completedTotals.accumulatedPoints.toLocaleString()}P</td>
                <td>{completedTotals.refundPoints.toLocaleString()}P</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RefundUsers;
