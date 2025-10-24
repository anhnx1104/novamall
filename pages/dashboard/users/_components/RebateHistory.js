import React, { useState } from "react";
import GlobalModal from "~/components/Ui/Modal/modal";
import classes from "~/components/tableFilter/table.module.css";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetchData, updateData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const RebateHistory = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("진행중");
  const router = useRouter();
  const { id } = router.query;

  const url = `/api/users/rebate?userId=${id}`;
  const { data, error, mutate } = useSWR(url, fetchData);

  const openModal = (item) => {
    setSelectedItem(item);
    setSelectedStatus(item.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const bodyData = JSON.stringify({
        id: selectedItem._id,
        status: selectedStatus,
      });
      const data = new FormData();
      data.append("data", bodyData);

      const response = await updateData("/api/users/rebate", data);

      response.success
        ? (toast.success("리베이트 상태가 성공적으로 업데이트되었습니다."),
          mutate())
        : toast.error("리베이트 상태 업데이트에 실패했습니다.");

      setShowModal(false);
    } catch (err) {
      console.log(err);
      toast.error("리베이트 상태 업데이트에 실패했습니다.");
    }
  };

  if (error) return <div>Failed to load rebate history</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h4 style={{ marginBottom: "20px" }}>리베이트 내역</h4>
      <h5 style={{ fontSize: "16px", marginBottom: "15px" }}>
        상품 그룹별 리베이트
      </h5>
      <div className="cs_table" style={{ overflowX: "auto" }}>
        <table className="table" style={{ width: "100%", minWidth: "900px" }}>
          <thead>
            <tr>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "120px",
                }}
              >
                그룹
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "150px",
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
                  minWidth: "100px",
                }}
              >
                순위
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "120px",
                }}
              >
                목표 리베이트
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "120px",
                }}
              >
                적립된 포인트
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "120px",
                }}
              >
                미도달 포인트
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "80px",
                }}
              >
                달성률
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "16px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "100px",
                }}
              >
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((item, index) => (
              <tr key={index} style={{ minHeight: "70px" }}>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "120px",
                  }}
                >
                  {item.group.name}
                </td>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "150px",
                  }}
                >
                  {item.product.name}
                </td>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "100px",
                  }}
                >
                  {item.ranking}
                </td>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "120px",
                  }}
                >
                  {formatNumberWithCommaAndFloor(item.product.pointLimit)}
                </td>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "120px",
                  }}
                >
                  {formatNumberWithCommaAndFloor(item.totalEarnedPoint)}
                </td>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "120px",
                  }}
                >
                  {formatNumberWithCommaAndFloor(
                    item.product.pointLimit - item.totalEarnedPoint
                  )}
                </td>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "80px",
                  }}
                >
                  {Math.round(
                    (item.totalEarnedPoint / item.product.pointLimit) * 100
                  )}
                  %
                </td>
                <td
                  className="rdt_TableCell"
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    minWidth: "100px",
                  }}
                >
                  <span
                    className={`badge rounded-pill ${
                      item.status === "progress" ? "bg-primary" : "bg-success"
                    }`}
                    style={{ fontSize: "12px" }}
                  >
                    {item.status === "progress" ? "진행중" : "완료"}
                  </span>
                  {item.status === "progress" && (
                    <button
                      className="btn btn-sm"
                      style={{
                        marginLeft: "5px",
                        padding: "2px 4px",
                        border: "1px solid #dee2e6",
                        borderRadius: "3px",
                        background: "white",
                      }}
                      onClick={() => openModal(item)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Change Modal */}
      <GlobalModal
        isOpen={showModal}
        handleCloseModal={closeModal}
        small={true}
      >
        <div style={{ textAlign: "center" }}>
          <h5
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            리베이트 상태 변경
          </h5>

          <div style={{ marginBottom: "25px", textAlign: "left" }}>
            <label
              htmlFor="statusSelect"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              상태 선택
            </label>
            <div className="select-wrapper" style={{ position: "relative" }}>
              <select
                id="statusSelect"
                className="form-select"
                value={selectedStatus}
                onChange={handleStatusChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  appearance: "none",
                  paddingRight: "30px",
                }}
              >
                <option value="progress">진행중</option>
                <option value="completion">완료</option>
              </select>
            </div>
          </div>

          <div>
            <button className={classes.danger_button} onClick={closeModal}>
              취소
            </button>
            <button
              className={classes.success_button}
              onClick={handleUpdateStatus}
            >
              저장
            </button>
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default RebateHistory;
