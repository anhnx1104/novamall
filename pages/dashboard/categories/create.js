import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import { postData } from "~/lib/clientFunctions";

const FileUpload = dynamic(() => import("~/components/FileUpload/fileUpload"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const NewCategory = (props) => {
  const [categoryImage, updateCategoryImage] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const name = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();
  const redirectToPage = (url, waitingTime) => {
    setTimeout(() => {
      router.push(url);
    }, waitingTime);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!categoryImage[0]) {
        return toast.warning("카테고리 아이콘을 추가해주세요.");
      }
      setButtonState("loading");
      const formData = {
        name: name.current.value,
        categoryImage,
      };
      const response = await postData("/api/categories", formData);
      response.success
        ? (toast.success("카테고리가 성공적으로 추가되었습니다."),
          redirectToPage("/dashboard/categories", 2000))
        : toast.error("문제가 발생했습니다.");
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(`문제가 발생했습니다. ${err.message}`);
    }
  };
  return (
    <>
      <h4 className="text-center pt-3 pb-5">{t("Create New Category")}</h4>
      <form id="category_form" onSubmit={submitHandler}>
        <div className="mb-5">
          <label htmlFor="inp-1" className="form-label">
            {t("name")}*
          </label>
          <input
            type="text"
            id="inp-1"
            className={classes.input + " form-control"}
            ref={name}
            required
          />
        </div>
        <div className="mb-4 pt-2">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={`${t("Upload your category icon here")}*`}
            updateFilesCb={updateCategoryImage}
          />
        </div>
        <div className="mb-4">
          <LoadingButton
            type="submit"
            text={t("Add Category")}
            state={buttonState}
          />
        </div>
      </form>
    </>
  );
};

NewCategory.requireAuthAdmin = true;
NewCategory.dashboard = true;

export default NewCategory;
