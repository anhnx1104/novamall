import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchData } from "~/lib/clientFunctions";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const OrderHistory = () => {
  const router = useRouter();
  const { id: userId } = router.query; // Get the user ID from the URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetchData(`/api/users/product/?userId=${userId}`)
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
      <h4 style={{ marginBottom: "20px" }}>주문 내역</h4>
      <div className="cs_table" style={{ overflowX: "auto" }}>
        <table className="table" style={{ width: "100%", minWidth: "800px" }}>
          <thead>
            <tr>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                주문번호
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                주문날짜
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                상품명
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                가격
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                배송상태
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
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
                    style={{ padding: "16px", fontWeight: "500" }}
                  >
                    {item.orderId}
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{ padding: "16px", fontWeight: "500" }}
                  >
                    {item.orderDate
                      ? new Date(item.orderDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{ padding: "16px", fontWeight: "500" }}
                  >
                    {item.product.name}
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{ padding: "16px", fontWeight: "500" }}
                  >
                    {formatNumberWithCommaAndFloor(item.product.price)}
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{ padding: "16px", fontWeight: "500" }}
                  >
                    <span
                      className="badge rounded-pill bg-primary"
                      style={{ fontSize: "12px" }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{ padding: "16px", fontWeight: "500" }}
                  >
                    <button
                      className="btn"
                      style={{
                        padding: "3px 10px",
                        fontSize: "14px",
                      }}
                      onClick={() => {
                        router.push(`/dashboard/orders/${item._id}`);
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
    </div>
  );
};

export default OrderHistory;
