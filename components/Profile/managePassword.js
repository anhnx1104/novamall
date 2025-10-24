import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import LoadingButton from "../Ui/Button";
import { useTranslation } from "react-i18next";

const ManagePassword = (props) => {
  const [loading, setLoading] = useState("");
  const { t } = useTranslation();
  const form = useRef();
  const password = useRef();
  const passwordRef = useRef();

  const updateUserInfo = async (e) => {
    try {
      e.preventDefault();
      if (
        password.current.value.length === 0 ||
        password.current.value !== passwordRef.current.value
      ) {
        return toast.error("두 필드의 비밀번호가 일치하지 않습니다.");
      }
      setLoading("loading");
      const userData = {
        password: password.current.value.trim(),
      };
      const response = await postData(
        `/api/profile?scope=password&id=${props.id}`,
        userData
      );
      response.success
        ? (toast.success("비밀번호가 성공적으로 업데이트되었습니다."),
          form.current.reset())
        : toast.error("문제가 발생했습니다.");
      setLoading("");
    } catch (err) {
      setLoading("");
      console.log(err);
      toast.error(`문제가 발생했습니다. (${err.message})`);
    }
  };

  return (
    <div>
      <div className="card mb-5 border-0 shadow-sm">
        <div className="card-header bg-white py-3">{t("change_password")}</div>
        <form onSubmit={updateUserInfo} ref={form}>
          <div className="card-body">
            <div className="py-2">
              <label className="form-label">{t("new_password")}</label>
              <input
                type="password"
                className="form-control"
                ref={password}
                required
              />
            </div>
            <div className="py-2">
              <label className="form-label">{t("confirm_password")}</label>
              <input
                type="password"
                className="form-control"
                ref={passwordRef}
                required
              />
            </div>
            <div className="py-3">
              <LoadingButton
                text="Update Password"
                state={loading}
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePassword;
