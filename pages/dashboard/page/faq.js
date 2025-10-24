import { Trash, Eye, PencilSquare } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import classes from "~/components/tableFilter/table.module.css";
import newClasses from "~/components/Layout/Client/newsletter.module.css";
import {
  cpf,
  dateFormat,
  deleteData,
  fetchData,
  postData,
  updateData,
} from "~/lib/clientFunctions";
import LoadingButton from "~/components/Ui/Button";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const PageLoader = dynamic(() => import("~/components/Ui/pageLoader"));
const Table = dynamic(() => import("~/components/Table"));

const SubscriberList = () => {
  const [data, setData] = useState([]);
  // const updateData = useRef();
  // function updatePageData() {
  //   updateData.current.update();
  // }
  const updatePageData = () => fetchFaqList(page);

  const [isOpen, setIsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [editData, setEditData] = useState({
    question: "",
    answer: "",
    _id: "",
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addData, setAddData] = useState({ question: "", answer: "" });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedFaq, setSelectedFaq] = useState("");

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    setPermissions(cpf(session, "subscriber"));
  }, [session]);

  const fetchFaqList = async (currentPage) => {
    try {
      const res = await fetchData(
        `/api/faq?page=${currentPage}&pageSize=${pageSize}`
      );

      if (res.success) {
        setData(res.data);
        setTotal(res.total);
      } else {
        toast.error("문제가 발생했습니다.");
      }
    } catch (err) {
      console.log(err);
      toast.error("문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchFaqList(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openModal = (id) => {
    setSelectedFaq(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const openDetailModal = (data) => {
    setSelectedData(data);
    setIsDetailOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailOpen(false);
  };

  const openEditModal = (data) => {
    setEditData({ ...data });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateData(`/api/faq`, editData);
      if (res.success) {
        toast.success("수정 완료");
        setIsEditOpen(false);
        updatePageData();
      } else {
        toast.error("수정 중 오류 발생");
      }
    } catch (err) {
      toast.error("수정 중 오류 발생");
    }
  };

  const openAddModal = () => {
    setAddData({ question: "", answer: "" });
    setIsAddOpen(true);
  };

  const closeAddModal = () => setIsAddOpen(false);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postData("/api/faq", addData);
      if (res.success) {
        toast.success("추가 완료");
        setIsAddOpen(false);
        updatePageData();
      } else {
        toast.error("추가 실패");
      }
    } catch (err) {
      toast.error("추가 중 오류 발생");
    }
  };

  const deleteFaq = async () => {
    try {
      const res = await deleteData(`/api/faq?faqId=${selectedFaq}`);
      if (res.success) {
        toast.success("삭제 완료");
        setIsOpen(false);
        updatePageData();
      } else {
        toast.error("삭제 실패");
      }
    } catch (err) {
      toast.error("삭제 중 오류 발생");
    }
  };
  const columns = [
    {
      name: t("ID"),
      selector: (row) => row._id,
    },
    {
      name: t("Title"),
      selector: (row) => row.question,
    },
    {
      name: t("Created Date"),
      selector: (row) => dateFormat(row.createdAt),
      sortable: true,
    },
    {
      name: t("action"),
      selector: (row) => (
        <div>
          {permissions.delete && (
            <div className={classes.button} onClick={() => openModal(row._id)}>
              <Trash width={22} height={22} title="DELETE" />
            </div>
          )}
          {permissions.view && (
            <div
              className={classes.button}
              onClick={() => openDetailModal(row)}
            >
              <Eye width={22} height={22} title="VIEW" />
            </div>
          )}
          {permissions.edit && (
            <div className={classes.button} onClick={() => openEditModal(row)}>
              <PencilSquare width={22} height={22} title="EDIT" />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    // <PageLoader>
    <div>
      <h4 className="text-center pt-3 pb-5">{t("Faq")}</h4>
      <div className={classes.container}>
        <Table
          data={data}
          columns={columns}
          searchKey="question"
          onChangePage={handlePageChange}
          paginationServer={true}
          paginationPerPage={pageSize}
          paginationTotalRows={total}
          searchPlaceholder={t("title")}
          buttons={[
            <button
              key="add-faq"
              className="btn btn-primary w-100 w-md-auto mt-2 mt-md-0"
              style={{
                background: "var(--primary)",
                borderColor: "var(--primary)",
              }}
              onClick={() => openAddModal()}
            >
              새 FAQ 추가
            </button>,
          ]}
        />
        <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
          <div className={classes.modal_icon}>
            <Trash width={90} height={90} />
            <p>Are you sure, you want to delete?</p>
            <div>
              <button
                className={classes.danger_button}
                onClick={() => deleteFaq()}
              >
                Delete
              </button>
              <button
                className={classes.success_button}
                onClick={() => closeModal()}
              >
                Cancel
              </button>
            </div>
          </div>
        </GlobalModal>
        <GlobalModal isOpen={isDetailOpen} handleCloseModal={closeDetailModal}>
          <div>
            <div className={newClasses.content_container_admin}>
              <form>
                <label className={newClasses.label_admin}>{t("Title")}</label>
                <textarea
                  className={newClasses.custom_input_admin}
                  name="title"
                  value={selectedData?.question}
                  placeholder={t("Title를 작성해주세요...")}
                  required
                  rows="2"
                  disabled
                />
                <label className={newClasses.label_admin}>{t("메세지")}</label>
                <textarea
                  className={newClasses.custom_input_admin}
                  name="content"
                  value={selectedData?.answer}
                  placeholder={t("내용을 작성해주세요...")}
                  required
                  rows="8"
                  disabled
                />
                {/* <LoadingButton
                  text={t("UPDATE")}
                  // state={buttonState}
                  // clickEvent={handleSubmit}
                /> */}
              </form>
            </div>
          </div>
        </GlobalModal>
        <GlobalModal isOpen={isEditOpen} handleCloseModal={closeEditModal}>
          <div>
            <div className={newClasses.content_container_admin}>
              <form onSubmit={handleEditSubmit}>
                <label className={newClasses.label_admin}>{t("Title")}</label>
                <textarea
                  className={newClasses.custom_input_admin}
                  name="question"
                  value={editData.question}
                  placeholder={t("Title를 작성해주세요...")}
                  required
                  rows="2"
                  onChange={handleEditChange}
                />
                <label className={newClasses.label_admin}>{t("메세지")}</label>
                <textarea
                  className={newClasses.custom_input_admin}
                  name="answer"
                  value={editData.answer}
                  placeholder={t("내용을 작성해주세요...")}
                  required
                  rows="8"
                  onChange={handleEditChange}
                />
                <LoadingButton text={t("UPDATE")} type="submit" />
              </form>
            </div>
          </div>
        </GlobalModal>
        <GlobalModal isOpen={isAddOpen} handleCloseModal={closeAddModal}>
          <div>
            <div className={newClasses.content_container_admin}>
              <form onSubmit={handleAddSubmit}>
                <label className={newClasses.label_admin}>{t("Title")}</label>
                <textarea
                  className={newClasses.custom_input_admin}
                  name="question"
                  value={addData.question}
                  placeholder={t("Title를 작성해주세요...")}
                  required
                  rows="2"
                  onChange={handleAddChange}
                />
                <label className={newClasses.label_admin}>{t("메세지")}</label>
                <textarea
                  className={newClasses.custom_input_admin}
                  name="answer"
                  value={addData.answer}
                  placeholder={t("내용을 작성해주세요...")}
                  required
                  rows="8"
                  onChange={handleAddChange}
                />
                <LoadingButton text={t("추가")} type="submit" />
              </form>
            </div>
          </div>
        </GlobalModal>
      </div>
    </div>
    // </PageLoader>
  );
};

SubscriberList.requireAuthAdmin = true;
SubscriberList.dashboard = true;

export default SubscriberList;
