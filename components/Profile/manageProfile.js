import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetchData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";
import Spinner from "../../components/Ui/Spinner";
import { useTranslation } from "react-i18next";
import c from "./profile.module.css";
import GlobalModal from "../Ui/Modal/modal";
import NewCustomer from "./addressForm";
import EditCustomer from "./addressEditForm";
import { deleteData } from "~/lib/clientFunctions";
import PageLoader from "../Ui/pageLoader";

const ManageProfile = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [selected, setSelected] = useState({});
  const updateRef = useRef();

  const url = `/api/profile?id=${props.id}`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const [userData, setUserData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.user) {
      setUserData(data.user);
    }
  }, [data]);

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelected({});
    updateRef.current.update();
  };

  function edit(id) {
    const resp = addressData.user?.address.find((x) => x._id === id);
    setSelected(resp || {});
    setIsOpen(true);
  }

  const deleteAddress = async (id) => {
    try {
      const data = {
        id,
      };
      const response = await deleteData(`/api/profile/address`, data);
      response.success
        ? (toast.success("주소가 성공적으로 삭제되었습니다."),
          updateRef.current.update())
        : toast.error("문제가 발생했습니다.");
    } catch (err) {
      toast.error(`오류: ${err.message}`);
    }
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div className="row">
          <h3
            style={{
              fontWeight: "600",
              fontSize: "28px",
              marginBottom: "40px",
            }}
          >
            내 정보
            <span
              style={{
                fontWeight: "600",
                fontSize: "22px",
                display: "block",
                marginTop: "20px",
              }}
            >
              연락처 정보
            </span>
          </h3>
          <div className={c.card}>
            <div className={c.row}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label className={c.label}>이름</label>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => props?.openAddAddress()}
                >
                  변경하기
                </p>
              </div>
              <div className={c.flex}>
                <p>{userData.name || "-"}</p>
              </div>
            </div>
            <div className={c.row}>
              <label className={c.label}>이메일</label>
              <div className={c.flex}>
                <p>{userData.email || "N/A"}</p>
              </div>
            </div>
            <div className={c.row}>
              <label className={c.label}>전화번호</label>
              <div className={c.flex}>
                <p>{userData.phone || "-"}</p>
              </div>
            </div>
            <div className={c.row}>
              <label className={c.label}>패스워드</label>
              <div className={c.flex}>
                <p>****************</p>
              </div>
            </div>
          </div>
          <div className={c.flex}>
            <label className={c.label}>주소</label>
            <label
              className={c.label}
              style={{ cursor: "pointer" }}
              onClick={() => setAddNew(true)}
            >
              추가하기
            </label>
          </div>
          <PageLoader
            url={`/api/profile/address`}
            setData={setAddressData}
            ref={updateRef}
          >
            <div className={c.cardContainer}>
              <div className={`${c.addressCard}`}>
                {addressData?.user?.address?.map((address) => (
                  <div
                    className={`${c.card} ${c.addressItem} `}
                    key={address._id}
                  >
                    <div className={c.address}>
                      <p>{address.addressTitle}</p>
                      <p>{address.phone}</p>
                      <p>
                        {address.city +
                          " " +
                          address.state +
                          " " +
                          address.house +
                          " " +
                          address.zipCode +
                          " "}
                      </p>
                    </div>
                    <div className={c.action}>
                      {address.addressType === "main address" ? (
                        <button>기본 주소지</button>
                      ) : (
                        <button>주소</button>
                      )}
                    </div>
                    <div className={c.edit}>
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteAddress(address._id)}
                      >
                        제거하기
                      </p>
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => edit(address._id)}
                      >
                        수정하기
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <GlobalModal
              small={false}
              isOpen={isOpen}
              handleCloseModal={handleCloseModal}
            >
              <EditCustomer data={selected} close={handleCloseModal} />
            </GlobalModal>
            <GlobalModal
              small={false}
              isOpen={addNew}
              handleCloseModal={() => {
                setAddNew(false);
                updateRef.current.update();
              }}
            >
              <NewCustomer
                onSuccess={() => {
                  setAddNew(false);
                  updateRef.current.update();
                }}
              />
            </GlobalModal>
          </PageLoader>
        </div>
      )}
    </>
  );
};

export default ManageProfile;
