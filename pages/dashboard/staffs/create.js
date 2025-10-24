import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoadingButton from "~/components/Ui/Button";
import { postData } from "~/lib/clientFunctions";

const CreateStaff = () => {
  const [permissions, setPermissions] = useState([
    { name: "상품", view: false, edit: false, delete: false },
    { name: "주문", view: false, edit: false, delete: false },
    { name: "카테고리", view: false, edit: false, delete: false },
    { name: "쿠폰", view: false, edit: false, delete: false },
    { name: "색상", view: false, edit: false, delete: false },
    { name: "옵션", view: false, edit: false, delete: false },
    { name: "브랜드", view: false, edit: false, delete: false },
    { name: "배송 요금", view: false, edit: false, delete: false },
    { name: "고객", view: false, edit: false, delete: false },
    { name: "설정", view: false, edit: false, delete: false },
    { name: "페이지 설정", view: false, edit: false, delete: false },
    { name: "문의", view: false, edit: false, delete: false },
  ]);

  const [state, setState] = useState("");
  const { t } = useTranslation();

  const handleForm = async (e) => {
    e.preventDefault();
    setState("loading");
    try {
      const el = e.target.elements;
      const { name, surname, email, password, confirmPassword } = el;
      if (password.value !== confirmPassword.value) {
        setState("");
        return toast.error("비밀번호 필드 값이 일치하지 않습니다.");
      }
      const formData = {
        name: name.value.trim(),
        surname: surname.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        permissions,
      };
      const response = await postData(`/api/staffs`, formData);
      response.success
        ? toast.success("직원이 성공적으로 추가되었습니다.")
        : response.message
        ? toast.error(response.message)
        : toast.error(`문제가 발생했습니다. (500)`);
    } catch (err) {
      toast.error(`문제가 발생했습니다. (${err.message})`);
    }
    setState("");
  };

  function updatePermission(name, target, value) {
    const idx = permissions.findIndex((x) => x.name === name);
    if (idx > -1) {
      const __item = permissions[idx];
      const __field = (__item[target] = value.checked);
    }
  }

  function convertToTitle(text) {
    if (text === "subscriber") return "Contacts";
    const _r = text.replace(/([A-Z])/g, " $1");
    return _r.charAt(0).toUpperCase() + _r.slice(1);
  }
  return (
    <>
      <form onSubmit={handleForm}>
        <div className="card mb-5 border-0 shadow">
          <div className="card-header bg-white py-3 fw-bold">
            {t("Staff Information")}
          </div>
          <div className="card-body">
            <div className="py-3">
              <label htmlFor="inp-001" className="form-label">
                {t("name")}
              </label>
              <input
                type="text"
                id="inp-001"
                name="name"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-002" className="form-label">
                {t("Surname")}
              </label>
              <input
                type="text"
                id="inp-002"
                name="surname"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-003" className="form-label">
                {t("email")}
              </label>
              <input
                type="email"
                id="inp-003"
                name="email"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-004" className="form-label">
                {t("password")}
              </label>
              <input
                type="password"
                id="inp-004"
                name="password"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-005" className="form-label">
                {t("confirm_password")}
              </label>
              <input
                type="password"
                id="inp-005"
                name="confirmPassword"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="card mb-5 border-0 shadow">
          <div className="card-header bg-white py-3 fw-bold">
            {t("Staff permissions")}
          </div>
          <div className="card-body">
            {permissions
              .filter((item) => !["category", "brand"].includes(item.name))
              .map((item, idx) => (
                <div className="py-3" key={idx}>
                  <h6 className="text-primary fw-bold">
                    {convertToTitle(item.name)}
                  </h6>
                  <div className="form-check form-switch form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={idx + "view"}
                      defaultChecked={item.view}
                      onChange={(e) =>
                        updatePermission(item.name, "view", e.target)
                      }
                    />
                    <label className="form-check-label" htmlFor={idx + "view"}>
                      {t("View")}
                    </label>
                  </div>
                  <div className="form-check form-switch form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={idx + "edit"}
                      defaultChecked={item.edit}
                      onChange={(e) =>
                        updatePermission(item.name, "edit", e.target)
                      }
                    />
                    <label className="form-check-label" htmlFor={idx + "edit"}>
                      {t("Edit")}
                    </label>
                  </div>
                  <div className="form-check form-switch form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={idx + "delete"}
                      defaultChecked={item.delete}
                      onChange={(e) =>
                        updatePermission(item.name, "delete", e.target)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={idx + "delete"}
                    >
                      {t("Delete")}
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="py-3">
          <LoadingButton text={t("Create Staff")} type="submit" state={state} />
        </div>
      </form>
    </>
  );
};

CreateStaff.requireAuthAdmin = true;
CreateStaff.dashboard = true;

export default CreateStaff;
