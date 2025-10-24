import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchData } from "~/lib/clientFunctions";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const SpecificProductPurchaseHistory = () => {
  const router = useRouter();
  const { id: userId } = router.query; // Get the user ID from the URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetchData(`/api/users/product/special?userId=${userId}`)
      .then((res) => {
        if (res.success) {
          setData(res.data);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div>
      <h4 style={{ marginBottom: "20px" }}>특별 상품 구매 내역</h4>
      <div className="table-responsive">
        <div className="cs_table">
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th
                  className="rdt_TableCol"
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                    minWidth: "100px",
                  }}
                >
                  주문번호
                </th>
                <th
                  className="rdt_TableCol"
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                    minWidth: "100px",
                  }}
                >
                  주문날짜
                </th>
                <th
                  className="rdt_TableCol"
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                    minWidth: "100px",
                  }}
                >
                  그룹명
                </th>
                <th
                  className="rdt_TableCol"
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                    minWidth: "120px",
                  }}
                >
                  상품명
                </th>
                <th
                  className="rdt_TableCol"
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                    minWidth: "120px",
                  }}
                >
                  리베이트 금액
                </th>
                <th
                  className="rdt_TableCol"
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                    minWidth: "80px",
                  }}
                >
                  상태
                </th>
                <th
                  className="rdt_TableCol"
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                    minWidth: "80px",
                  }}
                >
                  상세
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    로딩중...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                data?.map((item, index) => (
                  <tr style={{ minHeight: "70px" }} key={index}>
                    <td
                      className="rdt_TableCell"
                      style={{
                        padding: "12px",
                        fontWeight: "500",
                        minWidth: "100px",
                      }}
                    >
                      {item.order.orderId}
                    </td>
                    <td
                      className="rdt_TableCell"
                      style={{
                        padding: "12px",
                        fontWeight: "500",
                        minWidth: "100px",
                      }}
                    >
                      {item.order.orderDate
                        ? new Date(item.order.orderDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td
                      className="rdt_TableCell"
                      style={{
                        padding: "12px",
                        fontWeight: "500",
                        minWidth: "100px",
                      }}
                    >
                      {item.group.name}
                    </td>
                    <td
                      className="rdt_TableCell"
                      style={{
                        padding: "12px",
                        fontWeight: "500",
                        minWidth: "120px",
                      }}
                    >
                      {item.product.name}
                    </td>
                    <td
                      className="rdt_TableCell"
                      style={{
                        padding: "12px",
                        fontWeight: "500",
                        minWidth: "120px",
                      }}
                    >
                      {formatNumberWithCommaAndFloor(item.rebatePoints)}
                    </td>
                    <td
                      className="rdt_TableCell"
                      style={{
                        padding: "12px",
                        fontWeight: "500",
                        minWidth: "80px",
                      }}
                    >
                      <span
                        className="badge rounded-pill bg-primary"
                        style={{ fontSize: "12px" }}
                      >
                        {item.order.status}
                      </span>
                    </td>
                    <td
                      className="rdt_TableCell"
                      style={{
                        padding: "12px",
                        fontWeight: "500",
                        minWidth: "80px",
                      }}
                    >
                      <button
                        className="btn"
                        style={{
                          padding: "3px 10px",
                          fontSize: "14px",
                        }}
                        onClick={() => {
                          router.push(`/dashboard/orders/${item.order._id}`);
                        }}
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <style jsx>{`
          .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          @media (max-width: 768px) {
            .table th,
            .table td {
              padding: 8px !important;
              font-size: 0.9rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SpecificProductPurchaseHistory;
