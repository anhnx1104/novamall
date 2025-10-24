import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import { postData } from "~/lib/clientFunctions";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const CreateNotice = () => {
  const title = useRef();
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const { t } = useTranslation();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const form = document.getElementById("notice_form");
      const formData = new FormData();
      formData.append("title", title.current.value);
      formData.append("content", content);
      formData.append("isImportant", isImportant);
      
      const response = await postData("/api/notice", formData);
      if (response.success) {
        toast.success("공지사항이 성공적으로 등록되었습니다.");
        form.reset();
        setContent("");
        setIsImportant(false);
      } else {
        toast.error("문제가 발생했습니다.");
      }
    } catch (err) {
      console.log(err);
      toast.error("문제가 발생했습니다.");
    }
  };

  return (
    <>
      <h4 className="text-center pt-3 pb-5">공지사항 등록</h4>
      <form id="notice_form" onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="inp-1" className="form-label">
            제목*
          </label>
          <input
            type="text"
            id="inp-1"
            ref={title}
            className={classes.input + " form-control"}
            required
          />
        </div>
        
        <div className="mb-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isImportant"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="isImportant">
              중요 공지사항
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">내용*</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            className="quill-editor"
            style={{ height: "300px", marginBottom: "50px" }}
          />
        </div>

        <div className="my-4">
          <input
            type="submit"
            value="공지사항 등록"
            className="btn btn-lg btn-success"
          />
        </div>
      </form>
    </>
  );
};

CreateNotice.requireAuthAdmin = true;
CreateNotice.dashboard = true;

export default CreateNotice;
