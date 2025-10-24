import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { deleteData, postData } from "~/lib/clientFunctions";
import useSWR from "swr";
import GlobalModal from "../Ui/Modal/modal";
import c from "./addressBook.module.css";
import EditCustomer from "./addressEditForm";
import NewCustomer from "./addressForm";
import PageLoader from "../Ui/pageLoader";
import Card from "../Ui/Card";
import { PencilSquare, Trash3 } from "@styled-icons/bootstrap";

const ManageAddressBook = ({ id, closeAddAddress }) => {
  const [loading, setLoading] = useState(false);

  const { data, error, mutate } = useSWR(
    id ? `/api/profile?id=${id}` : null,
    (url) => fetch(url).then((res) => res.json())
  );

  const updateUserInfo = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const firstName = e.target.elements.firstName.value.trim();
      const lastName = e.target.elements.lastName.value.trim();
      const name = `${firstName} ${lastName}`;

      const userData = {
        name,
        email: data.user.email, // Keep existing email
        phone: e.target.elements.phone.value.trim(),
        house: e.target.elements.house.value.trim(),
        city: e.target.elements.city.value.trim(),
        state: e.target.elements.state.value.trim(),
        zipCode: e.target.elements.zipCode.value.trim(),
        country: e.target.elements.country.value.trim(),
      };

      const response = await postData(
        `/api/profile?scope=info&id=${id}`,
        userData
      );

      if (response.success) {
        toast.success("프로필이 성공적으로 업데이트되었습니다");
        mutate();
      } else if (response.duplicate) {
        toast.error("이미 등록된 이메일입니다");
      } else {
        toast.error("오류가 발생했습니다 (500)");
      }
    } catch (err) {
      toast.error(`오류가 발생했습니다 (${err.message})`);
    }
    setLoading(false);
  };

  if (error)
    return (
      <div className="text-center text-danger">
        데이터를 불러오는데 실패했습니다
      </div>
    );
  if (!data) return <div className="text-center">로딩 중...</div>;

  return (
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
          내 정보 상세
        </span>
      </h3>
      <div>
        <form onSubmit={updateUserInfo}>
          <div className={`${c.flex} ${c.formRowContainer}`}>
            <div className={c.flexForm}>
              <label className={c.labelForm}>
                성<span>*</span>
              </label>
              <input
                className={c.inputForm}
                type="text"
                name="firstName"
                defaultValue={data.user?.name?.split(" ")[0] || ""}
                required
              />
            </div>
            <div className={c.flexForm}>
              <label className={c.labelForm}>
                이름<span>*</span>
              </label>
              <input
                className={c.inputForm}
                type="text"
                name="lastName"
                defaultValue={data.user?.name?.split(" ")[1] || ""}
                required
              />
            </div>
          </div>

          <div className={`${c.flex} ${c.formRowContainer}`}>
            <div className={c.flexForm}>
              <label className={c.labelForm}>
                전화번호<span>*</span>
              </label>
              <input
                className={c.inputForm}
                type="text"
                name="phone"
                defaultValue={data.user?.phone || ""}
                required
              />
            </div>
          </div>

          <div className={`${c.flex} ${c.buttons}`}>
            <button className="button_primary" type="submit" disabled={loading}>
              {loading ? "저장 중..." : "저장"}
            </button>
            <button
              className="button_outline"
              type="button"
              onClick={() => closeAddAddress()}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAddressBook;
