import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateData } from "~/lib/clientFunctions";

const UserBasicInfo = ({ user, setShowDeleteModal, onStatusChange }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showLevelEdit, setShowLevelEdit] = useState(false);
  const [levelInput, setLevelInput] = useState(user?.level);
  const [loading, setLoading] = useState(false);

  const address =
    user?.addressList?.find((a) => a._id === user?.address[0]) || undefined;

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const res = await updateData(`/api/users/status?id=${user?._id}`, {
        status: newStatus,
      });
      if (res.success) {
        toast.success("상태가 변경되었습니다.");
        setShowStatusDropdown(false);
        // 상태 변경 후 새로고침
        if (onStatusChange) {
          onStatusChange({ ...user, status: newStatus });
        }
      }
    } catch (err) {
      toast.error("상태 변경에 실패했습니다.");
    }
    setLoading(false);
    setShowStatusDropdown(false);
  };

  const handleLevelSave = async () => {
    setLoading(true);
    try {
      const res = await updateData(`/api/users/level?id=${user?._id}`, {
        level: levelInput,
      });
      if (res.success) {
        toast.success("레벨이 변경되었습니다.");
        setShowLevelEdit(false);
        if (onStatusChange) onStatusChange({ ...user, level: levelInput });
      }
    } catch (err) {
      toast.error("레벨 변경에 실패했습니다.");
    }
    setLoading(false);
    setShowLevelEdit(false);
  };

  return (
    <div className="row g-4" style={{ marginBottom: "30px" }}>
      <h4 className="mb-3">유저 기본 정보</h4>
      <div className="col-lg-4 col-md-6 col-12">
        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">ID</div>
          <div>{user?._id}</div>
        </div>

        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">이메일</div>
          <div>{user?.email}</div>
        </div>

        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">연락처</div>
          <div>{user?.phone}</div>
        </div>

        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">가입 상태</div>
          <div
            className="d-flex align-items-center flex-wrap gap-2"
            style={{ position: "relative" }}
          >
            <span
              className="badge rounded-pill bg-dark"
              style={{ fontSize: "12px" }}
            >
              {user?.status === "active" ? "활성" : "비활성"}
            </span>
            <button
              className="btn btn-sm px-3"
              style={{
                border: "1px solid #ced4da",
                background: "#fff",
                fontSize: "14px",
              }}
              onClick={() => setShowStatusDropdown((v) => !v)}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ marginRight: "5px" }}
              >
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
              </svg>
              변경
            </button>
            {showStatusDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ced4da",
                  borderRadius: "6px",
                  zIndex: 100,
                  minWidth: "120px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  marginTop: "4px",
                  padding: "4px 0",
                }}
              >
                <button
                  className="dropdown-item"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    fontSize: "15px",
                    color: "#222",
                    cursor:
                      user?.status === "active" || loading
                        ? "not-allowed"
                        : "pointer",
                    backgroundColor:
                      user?.status === "active" ? "#f8f9fa" : "transparent",
                  }}
                  onClick={() => handleStatusChange("active")}
                  disabled={user?.status === "active" || loading}
                >
                  활성
                </button>
                <button
                  className="dropdown-item"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    fontSize: "15px",
                    color: "#222",
                    cursor:
                      user?.status === "inactive" || loading
                        ? "not-allowed"
                        : "pointer",
                    backgroundColor:
                      user?.status === "inactive" ? "#f8f9fa" : "transparent",
                  }}
                  onClick={() => handleStatusChange("inactive")}
                  disabled={user?.status === "inactive" || loading}
                >
                  비활성
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">유저 레벨</div>
          <div
            className="d-flex align-items-center flex-wrap gap-2"
            style={{ position: "relative" }}
          >
            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: "var(--primary)",
                fontSize: "12px",
              }}
            >
              {user?.level}
            </span>
            <button
              className="btn btn-sm px-3"
              style={{
                border: "1px solid #ced4da",
                background: "#fff",
                fontSize: "14px",
              }}
              onClick={() => setShowLevelEdit((v) => !v)}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ marginRight: "5px" }}
              >
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
              </svg>
              편집
            </button>
            {showLevelEdit && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ced4da",
                  borderRadius: "6px",
                  zIndex: 100,
                  minWidth: "160px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  marginTop: "4px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  type="number"
                  value={levelInput}
                  onChange={(e) => setLevelInput(Number(e.target.value))}
                  style={{
                    width: "60px",
                    padding: "4px 8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  disabled={loading}
                />
                <button
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "13px", padding: "4px 10px" }}
                  onClick={handleLevelSave}
                  disabled={loading}
                >
                  저장
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "13px", padding: "4px 10px" }}
                  onClick={() => setShowLevelEdit(false)}
                  disabled={loading}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 col-12">
        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">이름</div>
          <div>{user?.name}</div>
        </div>

        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">회원가입일</div>
          <div>
            {user?.createdAt
              ? new Date(user?.createdAt).toLocaleDateString()
              : ""}
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 col-12">
        <div className="mb-4">
          <div className="text-muted mb-2 fs-6">배송지 정보</div>
          <div style={{ color: "var(--primary)", fontWeight: "bold" }}>
            배송지
          </div>
        </div>
        {address ? (
          <div className="mb-4">
            <div style={{ fontWeight: "bold" }}>{address?.addressTitle}</div>
            <div>
              <p>{address?.phone}</p>
              <p>
                {address?.city +
                  " " +
                  address?.state +
                  " " +
                  address?.house +
                  " " +
                  address?.zipCode +
                  " "}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4">배송지 정보가 없습니다.</div>
        )}
      </div>
      <div className="mt-3">
        <button
          className="btn btn-danger"
          style={{
            borderRadius: "4px",
            padding: "6px 15px",
            fontWeight: "normal",
          }}
          onClick={() => setShowDeleteModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            style={{ marginRight: "5px" }}
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
          사용자 삭제
        </button>
      </div>
    </div>
  );
};

export default UserBasicInfo;
