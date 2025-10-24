import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/ProductForm/productForm.module.css";
import Spinner from "~/components/Ui/Spinner/index";
import { fetchData } from "~/lib/clientFunctions";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const EditEvent = () => {
  const router = useRouter();
  const url = `/api/event/${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);

  const titleRef = useRef();
  const eventId = useRef();
  const [eventData, setEventData] = useState({});
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [thumbnail, setThumbnail] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.event) {
      setEventData(data.event);
      setContent(data.event.content);
      setIsActive(data.event.isActive);
      setThumbnail(data.event.thumbnail || "");

      // 날짜 형식 변환 (YYYY-MM-DD)
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setStartDate(formatDate(data.event.startDate));
      setEndDate(formatDate(data.event.endDate));
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
      // 날짜 유효성 검사
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        toast.error("종료일은 시작일보다 이후여야 합니다.");
        return;
      }

      const response = await fetch(`/api/event/${eventData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleRef.current.value,
          content: content,
          startDate: startDate,
          endDate: endDate,
          isActive: isActive,
          thumbnail: thumbnail,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("이벤트가 성공적으로 수정되었습니다.");
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
      ) : !eventData._id ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">이벤트 수정</h4>
          <form onSubmit={submitHandler}>
            <input type="hidden" ref={eventId} defaultValue={eventData._id} />
            <div className="mb-4">
              <label htmlFor="inp-1" className="form-label">
                제목*
              </label>
              <input
                type="text"
                id="inp-1"
                ref={titleRef}
                defaultValue={eventData.title}
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
                value="이벤트 수정"
                className="btn btn-lg btn-success"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

EditEvent.requireAuthAdmin = true;
EditEvent.dashboard = true;

export default EditEvent;
