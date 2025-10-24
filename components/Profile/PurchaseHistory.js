import { Eye } from "@styled-icons/bootstrap";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import c from "./purchaseHistory.module.css";
import { dateFormat, fetchData, formatNumber } from "~/lib/clientFunctions";
import FilterComponent from "../../components/tableFilter";
import Spinner from "../../components/Ui/Spinner";
import PurchaseDetails from "./PurchaseDetails";
import { useTranslation } from "react-i18next";
import ImageLoader from "../Image";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

const PurchaseHistory = (props) => {
  const url = `/api/profile?id=${props.id}&scope=orders`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const [userData, setUserData] = useState([]);
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.user) {
      setUserData(data.user.orders);
    }
  }, [data]);

  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [tab, setTab] = useState("Pending");

  function showPurchaseDetails(id) {
    const _data = userData.find((d) => d.orderId === id);
    setDetailsData(_data);
    setShowDetails(true);
  }

  function hidePurchaseDetails() {
    setDetailsData(null);
    setShowDetails(false);
  }
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  function translateStatus(status) {
    const statusMap = {
      "In Progress": "진행 중",
      Pending: "대기 중",
      Packaged: "포장 완료",
      Shipped: "배송 중",
      Cancelled: "취소됨",
      Delivered: "배송 완료",
    };
    return statusMap[status] || status;
  }

  const filteredItems = useMemo(() => {
    return userData.filter((item) => {
      const matchesSearch =
        item.orderId &&
        item.orderId.toLowerCase().includes(filterText.toLowerCase());
      const matchesTab =
        (tab === "Pending" &&
          ["진행 중", "대기 중", "포장 완료", "배송 중"].includes(
            translateStatus(item.status)
          )) ||
        (tab === "Cancelled" && translateStatus(item.status) === "취소됨") ||
        (tab === "Delivered" && translateStatus(item.status) === "배송 완료");
      return matchesSearch && matchesTab;
    });
  }, [userData, filterText, tab]);

  const subHeaderComponentMemo = useMemo(() => {
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
        placeholder="Tracking Number"
      />
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: t("tracking_number"),
      selector: (row) => row.orderId,
      grow: 1.5,
    },
    {
      name: t("date"),
      selector: (row) => dateFormat(row.orderDate),
      sortable: true,
    },
    {
      name: t("amount"),
      selector: (row) => settings.settingsData.currency.symbol + row.payAmount,
    },
    {
      name: t("delivery_status"),
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: t("payment_status"),
      selector: (row) => row.paymentStatus,
      sortable: true,
    },
    {
      name: t("action"),
      selector: (row) => (
        <div className={classes.button}>
          <Eye
            width={20}
            height={20}
            title="view"
            onClick={() => showPurchaseDetails(row.orderId)}
          />
        </div>
      ),
    },
  ];

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

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <>
          {/* <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            customStyles={customStyles}
          /> */}
          {showDetails && detailsData ? (
            <PurchaseDetails
              data={detailsData}
              hide={hidePurchaseDetails}
              update={mutate}
            />
          ) : (
            <div className="">
              <h3
                style={{
                  fontWeight: "600",
                  fontSize: "28px",
                  marginBottom: "40px",
                }}
              >
                나의 주문
              </h3>
              <div className={c.tabs}>
                <ul>
                  <li
                    className={tab === "Pending" ? c.active : ""}
                    onClick={() => setTab("Pending")}
                  >
                    주문완료
                  </li>
                  <li
                    className={tab === "Cancelled" ? c.active : ""}
                    onClick={() => setTab("Cancelled")}
                  >
                    취소
                  </li>
                  <li
                    className={tab === "Delivered" ? c.active : ""}
                    onClick={() => setTab("Delivered")}
                  >
                    배송완료
                  </li>
                </ul>
              </div>
              <div className={c.orderContainer}>
                {filteredItems.map((item, idx) => (
                  <div className={c.orderItem} key={item?.orderId}>
                    <div className={c.orderInfo}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <p className={c.orderNo}>주문 번호: #{item?.orderId}</p>
                        <button
                          className="button_primary"
                          onClick={() => {
                            window.scrollTo({
                              top: 0,
                              behavior: "instant",
                            });
                            showPurchaseDetails(item.orderId);
                          }}
                        >
                          상세보기
                        </button>
                      </div>
                      <div className={c.flex} style={{ alignItems: "start" }}>
                        <div>
                          <p>
                            주문 날짜 :{" "}
                            <span>
                              {dayjs(item?.orderDate).format(
                                "YYYY년 MM월 DD일 A hh:mm"
                              )}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            주문 상태 :{" "}
                            <span>{translateStatus(item?.status)}</span>
                          </p>
                          <p>
                            결제 방법 : <span>{item?.paymentMethod}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {item?.products?.map((product, idx) => (
                      <div key={"product" + idx} className={c.orderProduct}>
                        <div className={c.left}>
                          <div className={c.productImage}>
                            <ImageLoader
                              src={product?.image[0]?.url}
                              alt={product?.name}
                              width={96}
                              height={96}
                            />
                          </div>
                          <div className={c.productDetails}>
                            <h5>{product?.name}</h5>
                            <p>컬러 : 핑크</p>
                            <p>수량 : {product?.qty}</p>
                            <p>총합계 : {formatNumber(product?.price)}원</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PurchaseHistory;
