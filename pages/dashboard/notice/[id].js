import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/ProductForm/productForm.module.css";
import Spinner from "~/components/Ui/Spinner/index";
import { fetchData, postData } from "~/lib/clientFunctions";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const EditNotice = () => {
  const router = useRouter();
  const url = `/api/notice/${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);

  const titleRef = useRef();
  const noticeId = useRef();
  const [noticeData, setNoticeData] = useState({});
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.notice) {
      setNoticeData(data.notice);
      setContent(data.notice.content);
      setIsImportant(data.notice.isImportant);
    }
  }, [data]);

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
      const formData = new FormData();
      formData.append("title", titleRef.current.value);
      formData.append("content", content);
      formData.append("isImportant", isImportant);
      
      const response = await fetch(`/api/notice/${noticeData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleRef.current.value,
          content: content,
          isImportant: isImportant,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("공지사항이 성공적으로 수정되었습니다.");
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
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : !noticeData._id ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">공지사항 수정</h4>
          <form onSubmit={submitHandler}>
            <input type="hidden" ref={noticeId} defaultValue={noticeData._id} />
            <div className="mb-4">
              <label htmlFor="inp-1" className="form-label">
                제목*
              </label>
              <input
                type="text"
                id="inp-1"
                ref={titleRef}
                defaultValue={noticeData.title}
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
                value="공지사항 수정"
                className="btn btn-lg btn-success"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

EditNotice.requireAuthAdmin = true;
EditNotice.dashboard = true;

export default EditNotice;
