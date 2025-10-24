import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { cpf, dateFormat, fetchData, deleteData } from "~/lib/clientFunctions";
import PageLoader from "~/components/Ui/pageLoader";
import classes from "~/components/tableFilter/table.module.css";
import dynamic from "next/dynamic";
import UserBasicInfo from "./_components/UserBasicInfo";
import SpecificProductPurchaseHistory from "./_components/SpecificProductPurchaseHistory";
import OrderHistory from "./_components/OrderHistory";
import PointsHistory from "./_components/PointsHistory";
import RebateHistory from "./_components/RebateHistory";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

const UserDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    setPermissions(cpf(session, "customers"));
  }, [session]);

  useEffect(() => {
    if (id) {
      fetchData(`/api/users?id=${id}`)
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            toast.error("유저를 찾을 수 없습니다.");
            router.push("/dashboard/users");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error("문제가 발생했습니다.");
          setLoading(false);
        });
    }
  }, [id, router]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <div className="text-center py-5">User not found</div>;
  }

  const mainTabs = [
    {
      title: "유저 기본 정보",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
        </svg>
      ),
    },
    {
      title: "특별 상품 구매 내역",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
        </svg>
      ),
    },
    {
      title: "주문 내역",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.382h12V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
          <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
        </svg>
      ),
    },
    {
      title: "포인트 내역",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v2h6a.5.5 0 0 1 .5.5c0 .253.08.644.306.958.207.288.557.542 1.194.542.637 0 .987-.254 1.194-.542.226-.314.306-.705.306-.958a.5.5 0 0 1 .5-.5h6v-2A1.5 1.5 0 0 0 14.5 2h-13z" />
          <path d="M16 6.5h-5.551a2.678 2.678 0 0 1-.443 1.042C9.613 8.088 8.963 8.5 8 8.5c-.963 0-1.613-.412-2.006-.958A2.679 2.679 0 0 1 5.551 6.5H0v6A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6z" />
        </svg>
      ),
    },
    {
      title: "리베이트 내역",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
        </svg>
      ),
    },
  ];

  const handleUserStatusUpdate = (payload) => {
    setUser((prev) => ({ ...prev, ...payload }));
  };

  // Render the content based on the active tabs
  const renderContent = () => {
    if (activeMainTab === 0) {
      // User basic info tab
      return (
        <UserBasicInfo
          user={user}
          setShowDeleteModal={setShowDeleteModal}
          onStatusChange={handleUserStatusUpdate}
        />
      );
    } else if (activeMainTab === 1) {
      return <SpecificProductPurchaseHistory />;
    } else if (activeMainTab === 2) {
      return <OrderHistory />;
    } else if (activeMainTab === 3) {
      return <PointsHistory />;
    } else if (activeMainTab === 4) {
      return <RebateHistory />;
    }
  };

  return (
    <div>
      {/* Top navigation bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          overflow: "hidden",
        }}
      >
        {mainTabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveMainTab(index)}
            style={{
              flex: "1 1 auto",
              minWidth: "120px",
              padding: "15px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: activeMainTab === index ? "bold" : "normal",
              color: activeMainTab === index ? "var(--primary)" : "#666",
              borderBottom:
                activeMainTab === index
                  ? "2px solid var(--primary)"
                  : "1px solid #dee2e6",
              transition: "all 0.3s ease",
              textAlign: "center",
            }}
          >
            <span style={{ marginRight: "8px" }}>{tab.icon}</span>
            <span style={{ whiteSpace: "nowrap" }}>{tab.title}</span>
          </div>
        ))}
      </div>

      <div
        className={classes.container}
        style={{
          padding: "15px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        {renderContent()}
      </div>

      {/* Delete Confirmation Modal */}
      <GlobalModal
        isOpen={showDeleteModal}
        handleCloseModal={() => setShowDeleteModal(false)}
        small={true}
      >
        <div className={classes.modal_icon} style={{ textAlign: "center" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="90"
            height="90"
            fill="red"
            viewBox="0 0 16 16"
            style={{ marginBottom: "15px" }}
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
          <h5
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            사용자 삭제 확인
          </h5>
          <p style={{ marginBottom: "8px", fontSize: "15px" }}>
            정말로 이 사용자를 삭제하시겠습니까?
          </p>
          <p style={{ color: "#666", fontSize: "13px", marginBottom: "20px" }}>
            이 작업은 되돌릴 수 없으며, 사용자의 모든 데이타가 삭제됩니다.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className={classes.danger_button}
              onClick={() => {
                // Implement delete logic here
                deleteData(`/api/users?id=${id}`)
                  .then((data) =>
                    data.success
                      ? (toast.success("사용자가 삭제되었습니다."),
                        router.push("/dashboard/users"))
                      : toast.error("오류가 발생했습니다.")
                  )
                  .catch((err) => {
                    console.log(err);
                    toast.error("오류가 발생했습니다.");
                  });
                setShowDeleteModal(false);
              }}
              style={{ minWidth: "100px", margin: "5px" }}
            >
              삭제
            </button>
            <button
              className={classes.success_button}
              onClick={() => setShowDeleteModal(false)}
              style={{ minWidth: "100px", margin: "5px" }}
            >
              취소
            </button>
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

UserDetails.requireAuthAdmin = true;
UserDetails.dashboard = true;

export default UserDetails;
