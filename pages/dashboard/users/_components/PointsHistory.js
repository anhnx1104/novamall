import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GlobalModal from "~/components/Ui/Modal/modal";
import classes from "~/components/tableFilter/table.module.css";
import { fetchData, updateData } from "~/lib/clientFunctions";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const PointsHistory = () => {
  const router = useRouter();
  const { id: userId } = router.query;
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userPointData, setUserPointData] = useState({
    totalWithdrawablePoint: 0,
    withdrawablePoint: 0,
    totalShoppingPoint: 0,
    shoppingPoint: 0,
  });
  const [userPointHistory, setUserPointHistory] = useState([]);
  const [editType, setEditType] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchData(`/api/users/point?id=${userId}`)
      .then((res) => {
        if (res.success) setUserPointData(res.data);
        else toast.error("포인트 정보를 불러오지 못했습니다.");
      })
      .catch(() => toast.error("포인트 정보를 불러오지 못했습니다."));

    fetchData(`/api/users/point/history?id=${userId}`)
      .then((res) => {
        if (res.success) {
          setUserPointHistory(res.data);
        } else toast.error("포인트 사용 내역을 불러오지 못했습니다.");
      })
      .catch(() => toast.error("포인트 사용 내역을 불러오지 못했습니다."));
  }, [userId]);

  const handleUpdatePoint = async () => {
    let body = {};
    if (editType === "withdrawablePoint") {
      body = { withdrawablePoint: editValue };
    } else if (editType === "shoppingPoint") {
      body = { shoppingPoint: editValue };
    }
    try {
      const res = await updateData(`/api/users/point/${editType}`, {
        id: userId,
        ...body,
      });
      if (res.success) {
        toast.success("포인트 정보가 업데이트되었습니다.");
        fetchData(`/api/users/point?id=${userId}`).then((res) => {
          if (res.success) setUserPointData(res.data);
        });
        closeModal();
      }
    } catch (error) {
      closeModal();
      toast.error("포인트 정보를 업데이트하지 못했습니다.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openWithdrawableModal = () => {
    setEditType("withdrawablePoint");
    setEditValue(userPointData.withdrawablePoint.toString());
    setShowModal(true);
  };

  const openShoppingModal = () => {
    setEditType("shoppingPoint");
    setEditValue(userPointData.shoppingPoint.toString());
    setShowModal(true);
  };

  const handleEditValueChange = (e) => {
    setEditValue(e.target.value.replace(/[^0-9]/g, ""));
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const openDetailModal = () => {
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  return (
    <div className="container-fluid px-0">
      <h4 style={{ marginBottom: "20px" }}>포인트 내역</h4>
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-3">
          <div
            style={{
              padding: "16px",
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              출금 포인트
            </h5>
            <div>
              <div
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                총 적립된 출금 포인트
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "24px", margin: 0 }}>
                  {formatNumberWithCommaAndFloor(
                    userPointData.totalWithdrawablePoint
                  )}
                </h3>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <div
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                출금 잔여 포인트
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "24px", margin: 0 }}>
                  {formatNumberWithCommaAndFloor(
                    userPointData.withdrawablePoint
                  )}
                </h3>
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #eaeaea",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                  onClick={openWithdrawableModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{ marginRight: "5px" }}
                  >
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                  </svg>
                  변경
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-12 mb-3">
          <div
            style={{
              padding: "16px",
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <h5
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              쇼핑몰 포인트
            </h5>
            <div>
              <div
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                총 적립된 쇼핑몰 포인트
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "24px", margin: 0 }}>
                  {formatNumberWithCommaAndFloor(
                    userPointData.totalShoppingPoint
                  )}
                </h3>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <div
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                쇼핑몰 잔여 포인트
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "24px", margin: 0 }}>
                  {formatNumberWithCommaAndFloor(userPointData.shoppingPoint)}
                </h3>
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #eaeaea",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                  onClick={openShoppingModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{ marginRight: "5px" }}
                  >
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                  </svg>
                  변경
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5
        style={{
          fontSize: "18px",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        사용 내역
      </h5>

      <div className="table-responsive">
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
                날짜
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "12px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "120px",
                }}
              >
                내용
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "12px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "100px",
                }}
              >
                종류
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "12px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "100px",
                }}
              >
                포인트
              </th>
              <th
                className="rdt_TableCol"
                style={{
                  padding: "12px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "80px",
                }}
              >
                확인
              </th>
              <th
                className="rdt_TableCol text-center"
                style={{
                  padding: "12px",
                  fontWeight: "600",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                  minWidth: "80px",
                }}
              >
                상세
              </th>
            </tr>
          </thead>
          <tbody>
            {userPointHistory.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#888",
                  }}
                >
                  포인트 내역이 없습니다.
                </td>
              </tr>
            ) : (
              userPointHistory.map((history, index) => (
                <tr style={{ minHeight: "60px" }} key={index}>
                  <td
                    className="rdt_TableCell"
                    style={{
                      padding: "12px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      minWidth: "100px",
                    }}
                  >
                    {history.createAt
                      ? new Date(history.createAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{
                      padding: "12px",
                      fontWeight: "500",
                      minWidth: "120px",
                    }}
                  >
                    {history.pointUsage === "voucher"
                      ? "상품권 구매"
                      : history.pointUsage === "withdrawal"
                      ? "출금 신청"
                      : history.pointUsage === "purchase"
                      ? "상품 구매"
                      : history.pointUsage === "send"
                      ? "포인트 전송"
                      : "-"}
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{
                      padding: "12px",
                      fontWeight: "500",
                      minWidth: "100px",
                    }}
                  >
                    {history.pointType === "withdrawal"
                      ? "출금포인트"
                      : "쇼핑몰 포인트"}
                  </td>
                  <td
                    className="rdt_TableCell"
                    style={{
                      padding: "12px",
                      fontWeight: "500",
                      color: "red",
                      minWidth: "100px",
                    }}
                  >
                    {formatNumberWithCommaAndFloor(history.point)}
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
                      onClick={openConfirmModal}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        style={{ marginRight: "5px" }}
                      >
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg>
                      <span>확인</span>
                    </button>
                  </td>
                  <td
                    className="rdt_TableCell text-center"
                    style={{
                      padding: "12px",
                      fontWeight: "500",
                      minWidth: "100px",
                    }}
                  >
                    <button
                      onClick={openDetailModal}
                      style={{
                        background: "transparent",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: "0",
                        margin: "0 auto",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                      </svg>
                      <span style={{ marginLeft: "5px" }}>보기</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Points Modification Modal */}
      <GlobalModal
        isOpen={showModal}
        handleCloseModal={closeModal}
        small={true}
      >
        <div style={{ textAlign: "center", padding: "10px" }}>
          <h5
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            {editType === "withdrawable"
              ? "출금 잔여 포인트 수정"
              : "쇼핑몰 포인트 수정"}
          </h5>

          <div style={{ marginBottom: "25px", textAlign: "left" }}>
            <label
              htmlFor="pointInput"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              포인트 값
            </label>
            <input
              id="pointInput"
              type="text"
              className="form-control"
              defaultValue={editValue}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
              }}
              onChange={handleEditValueChange}
            />
          </div>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button className={classes.danger_button} onClick={closeModal}>
              취소
            </button>
            <button
              className={classes.success_button}
              onClick={handleUpdatePoint}
            >
              저장
            </button>
          </div>
        </div>
      </GlobalModal>

      {/* Confirmation Modal */}
      <GlobalModal
        isOpen={showConfirmModal}
        handleCloseModal={closeConfirmModal}
        small={true}
      >
        <div style={{ textAlign: "center", padding: "10px" }}>
          <h5
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            출금 신청 확인
          </h5>

          <div
            style={{
              marginBottom: "25px",
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              padding: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              <span style={{ fontWeight: "500" }}>은행명</span>
              <span>신한은행</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              <span style={{ fontWeight: "500" }}>계좌번호</span>
              <span>110-123-456789</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              <span style={{ fontWeight: "500" }}>예금주</span>
              <span>홍길동</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              <span style={{ fontWeight: "500" }}>출금 금액</span>
              <span>30,000원</span>
            </div>
          </div>

          <p style={{ marginBottom: "20px" }}>출금 신청을 확인하시겠습니까?</p>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              className={classes.danger_button}
              onClick={closeConfirmModal}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
                취소
              </span>
            </button>
            <button className={classes.success_button}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
                확인
              </span>
            </button>
          </div>
        </div>
      </GlobalModal>

      {/* Product Detail Modal */}
      <GlobalModal
        isOpen={showDetailModal}
        handleCloseModal={closeDetailModal}
        small={true}
      >
        <div style={{ textAlign: "center", padding: "10px" }}>
          <h5
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            상품권 구매 확인
          </h5>

          <div
            style={{
              marginBottom: "25px",
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "240px",
                height: "auto",
                aspectRatio: "1/1",
                backgroundColor: "#f0f0f0",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#ccc"
                viewBox="0 0 16 16"
              >
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                <path d="M10.648 7.646a.5.5 0 0 1 .577-.093L15.002 9.5V14h-14v-4.5l3.777-1.947a.5.5 0 0 1 .577.093l2.646 2.647 2.646-2.647z" />
              </svg>
            </div>
          </div>

          <p style={{ marginBottom: "20px" }}>
            상품권 구매를 확인하시겠습니까?
          </p>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              className={classes.danger_button}
              onClick={closeDetailModal}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
                취소
              </span>
            </button>
            <button className={classes.success_button}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
                확인
              </span>
            </button>
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default PointsHistory;
