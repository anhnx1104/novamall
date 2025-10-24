import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { dateFormat } from "~/lib/clientFunctions";
import { useTranslation } from "react-i18next";
import PageLoader from "../Ui/pageLoader";
import GlobalModal from "../Ui/Modal/modal";
import { Eye, Search } from "@styled-icons/bootstrap";

import c from "./refund.module.css";

const Refund = ({ id }) => {
  const settings = useSelector((state) => state.settings);
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({});
  const [showReason, setShowReason] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const updateRef = useRef();

  return (
    <PageLoader
      url={`/api/profile?id=${id}&scope=refund`}
      setData={setData}
      ref={updateRef}
    >
      <div className="row">
        <h3
          style={{
            fontWeight: "600",
            fontSize: "28px",
            marginBottom: "40px",
          }}
        >
          환불 요청
        </h3>
        <div className={c.filter}>
          <div className={c.flex}>
            <div className={c.searchBar}>
              <span className={c.search_icon_def}>
                <Search width={15} height={15} />
              </span>
              <input
                type="text"
                className={c.searchInput_def}
                placeholder={t("주문 번호로 검색")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button
              className={c.btnSearch}
              onClick={() => setAppliedSearch(searchValue)}
            >
              검색
            </button>
          </div>
          <select className={c.select + " form-select"} value={""}>
            <option value="" disabled>
              {t("날짜순으로 정렬")}
            </option>
          </select>
        </div>
      </div>
      <div className={c.tableContent}>
        <table>
          <thead>
            <tr>
              <th>{t("주문 번호")}</th>
              <th>{t("날짜")}</th>
              <th>{t("상품명")}</th>
              <th className="text-center">{t("가격")}</th>
              <th className="text-center">{t("상태")}</th>
            </tr>
          </thead>
          <tbody>
            {(data.user?.refundRequest || [])
              .filter(
                (row) =>
                  !appliedSearch ||
                  row.orderId
                    .toString()
                    .toLowerCase()
                    .includes(appliedSearch.toLowerCase())
              )
              .map((row, index) => (
                <tr key={index}>
                  <td>{row.orderId}</td>
                  <td>{dateFormat(row.date)}</td>
                  <td>{row.product.name}</td>
                  <td className="text-center">{`${row.refundAmount}원`}</td>
                  <td className="text-center">
                    <button
                      className={`badge rounded-pill ${
                        row.status === "Pending"
                          ? "bg-primary"
                          : row.status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {row.status}
                    </button>
                    {row.status !== "Pending" && row.refundReason && (
                      <div
                        className="btn btn-sm m-2 btn-info rounded-pill"
                        title="Note"
                        onClick={() => setShowReason(row.refundReason)}
                      >
                        <Eye width={20} height={20} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <GlobalModal
        isOpen={showReason ? true : false}
        small
        handleCloseModal={() => setShowReason(null)}
      >
        <div className="p-2">
          <p>{showReason}</p>
        </div>
      </GlobalModal>
    </PageLoader>
  );
};

export default Refund;
