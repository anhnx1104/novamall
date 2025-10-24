import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import { postData } from "~/lib/clientFunctions";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const CreateEvent = () => {
  const title = useRef();
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [thumbnail, setThumbnail] = useState("");
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
      const form = document.getElementById("event_form");

      // 날짜 유효성 검사
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        toast.error("종료일은 시작일보다 이후여야 합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title.current.value);
      formData.append("content", content);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("isActive", isActive);
      formData.append("thumbnail", thumbnail);

      const response = await postData("/api/event", formData);
      if (response.success) {
        toast.success("이벤트가 성공적으로 등록되었습니다.");
        form.reset();
        setContent("");
        setStartDate("");
        setEndDate("");
        setIsActive(true);
        setThumbnail("");
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
      <h4 className="text-center pt-3 pb-5">이벤트 등록</h4>
      <form id="event_form" onSubmit={submitHandler}>
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

        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="startDate" className="form-label">
              시작일*
            </label>
            <input
              type="date"
              id="startDate"
              className={classes.input + " form-control"}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="endDate" className="form-label">
              종료일*
            </label>
            <input
              type="date"
              id="endDate"
              className={classes.input + " form-control"}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
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
            value="이벤트 등록"
            className="btn btn-lg btn-success"
          />
        </div>
      </form>
    </>
  );
};

CreateEvent.requireAuthAdmin = true;
CreateEvent.dashboard = true;

export default CreateEvent;
