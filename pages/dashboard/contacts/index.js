import { Trash, Eye } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import classes from "~/components/tableFilter/table.module.css";
import newClasses from "~/components/Layout/Client/newsletter.module.css";
import { cpf, dateFormat, deleteData } from "~/lib/clientFunctions";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const PageLoader = dynamic(() => import("~/components/Ui/pageLoader"));
const Table = dynamic(() => import("~/components/Table"));

const SubscriberList = () => {
  const [data, setData] = useState({ subscribers: { subscribers: [] } });
  const updateData = useRef();
  function updatePageData() {
    updateData.current.update();
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState("");

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    setPermissions(cpf(session, "subscriber"));
  }, [session]);

  const openModal = (id) => {
    setSelectedSubscriber(id);
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

  const deleteSubscriber = async () => {
    setIsOpen(false);
    await deleteData(`/api/subscribers?id=${selectedSubscriber}`)
      .then((data) =>
        data.success
          ? (toast.success("문의가 성공적으로 삭제되었습니다."),
            updatePageData())
          : toast.error("문제가 발생했습니다.")
      )
      .catch((err) => {
        console.log(err);
        toast.error("문제가 발생했습니다.");
      });
  };
  const columns = [
    {
      name: t("email"),
      selector: (row) => row.email,
    },
    {
      name: t("username"),
      selector: (row) => row.username,
    },
    {
      name: t("Subscription Date"),
      selector: (row) => dateFormat(row.date),
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
        </div>
      ),
    },
  ];

  return (
    <PageLoader url={`/api/subscribers`} setData={setData} ref={updateData}>
      <div>
        <h4 className="text-center pt-3 pb-5">{t("Contacts")}</h4>
        <div className={classes.container}>
          <Table
            data={data.subscribers.subscribers || []}
            columns={columns}
            searchKey="email"
            searchPlaceholder={t("email")}
          />
          <GlobalModal
            isOpen={isOpen}
            handleCloseModal={closeModal}
            small={true}
          >
            <div className={classes.modal_icon}>
              <Trash width={90} height={90} />
              <p>Are you sure, you want to delete?</p>
              <div>
                <button
                  className={classes.danger_button}
                  onClick={() => deleteSubscriber()}
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
          <GlobalModal
            isOpen={isDetailOpen}
            handleCloseModal={closeDetailModal}
          >
            <div>
              <div className={newClasses.content_container_admin}>
                <form>
                  {" "}
                  <label className={newClasses.label_admin}>{t("이름")}</label>
                  <input
                    className={newClasses.custom_input_admin}
                    type="text"
                    name="username"
                    value={selectedData?.username}
                    placeholder={t("이름 *")}
                    required
                    disabled
                  />
                  <label className={newClasses.label_admin}>
                    {t("이메일")}
                  </label>
                  <input
                    className={newClasses.custom_input_admin}
                    type="email"
                    name="email"
                    value={selectedData?.email}
                    placeholder={t("이메일 *")}
                    required
                    disabled
                  />
                  <label className={newClasses.label_admin}>
                    {t("전화번호")}
                  </label>
                  <input
                    className={newClasses.custom_input_admin}
                    type="number"
                    name="phone"
                    value={selectedData?.phone}
                    placeholder={t("전화번호 *")}
                    required
                    disabled
                  />
                  <label className={newClasses.label_admin}>
                    {t("메세지")}
                  </label>
                  <textarea
                    className={newClasses.custom_input_admin}
                    name="message"
                    value={selectedData?.message}
                    placeholder={t("메세지를 작성해주세요...")}
                    required
                    rows="4"
                    disabled
                  />
                </form>
              </div>
            </div>
          </GlobalModal>
        </div>
      </div>
    </PageLoader>
  );
};

SubscriberList.requireAuthAdmin = true;
SubscriberList.dashboard = true;

export default SubscriberList;
