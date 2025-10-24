import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const Link = dynamic(() => import("next/link"));

const EventList = () => {
  const url = `/api/event`;
  const { data, error, mutate } = useSWR(url, fetchData);

  const [eventList, setEventList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.events) {
      setEventList(data.events);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "event"));
  }, [session]);

  const openModal = (id) => {
    setSelectedEvent(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteEvent = async () => {
    setIsOpen(false);
    await deleteData(`/api/event?id=${selectedEvent}`)
      .then((data) =>
        data.success
          ? (toast.success("이벤트가 성공적으로 삭제되었습니다."), mutate())
          : toast.error("문제가 발생했습니다.")
      )
      .catch((err) => {
        console.log(err);
        toast.error("문제가 발생했습니다.");
      });
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = eventList.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const customStyles = {
    rows: {
      style: {
        minHeight: "92px",
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const columns = [
    {
      name: "번호",
      selector: (row, index) => filteredItems.length - index,
      sortable: true,
      width: "80px",
    },
    {
      name: "제목",
      selector: (row) => row.title,
      sortable: true,
      grow: 2,
    },
    {
      name: "기간",
      selector: (row) =>
        `${formatDate(row.startDate)} ~ ${formatDate(row.endDate)}`,
      sortable: true,
      width: "220px",
    },
    {
      name: "작성일",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
      width: "120px",
    },
    {
      name: "관리",
      selector: (row) => (
        <div>
          {permissions.delete && (
            <div className={classes.button} onClick={() => openModal(row._id)}>
              <Trash width={22} height={22} title="삭제" />
            </div>
          )}
          {permissions.edit && (
            <Link href={`/dashboard/event/${row._id}`}>
              <div className={classes.button}>
                <PencilSquare width={22} height={22} title="수정" />
              </div>
            </Link>
          )}
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <>
      {error ? (
        <div className="text-center text-danger">
          데이터를 불러오는데 실패했습니다.
        </div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">이벤트 관리</h4>
          <div className="d-flex justify-content-end mb-3">
            <Link href="/dashboard/event/create">
              <button className="btn btn-primary">이벤트 등록</button>
            </Link>
          </div>
          <div className={classes.container}>
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              customStyles={customStyles}
              noDataComponent="등록된 이벤트가 없습니다."
            />
          </div>
          <GlobalModal
            isOpen={isOpen}
            handleCloseModal={closeModal}
            small={true}
          >
            <div className={classes.modal_icon}>
              <Trash width={100} height={100} />
              <p className="mb-1">정말로 삭제하시겠습니까?</p>
              <small className="text-danger d-block mb-3">
                삭제된 이벤트는 복구할 수 없습니다.
              </small>
              <div>
                <button
                  className={classes.danger_button}
                  onClick={() => deleteEvent()}
                >
                  삭제
                </button>
                <button
                  className={classes.success_button}
                  onClick={() => closeModal()}
                >
                  취소
                </button>
              </div>
            </div>
          </GlobalModal>
        </div>
      )}
    </>
  );
};

EventList.requireAuthAdmin = true;
EventList.dashboard = true;

export default EventList;
