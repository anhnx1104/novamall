import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { dateFormat } from "~/lib/clientFunctions";
import PageLoader from "../Ui/pageLoader";
import { Search } from "@styled-icons/bootstrap";
import c from "./pointHistory.module.css";
import PaginationCustom from "../PaginationCustom";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  POINT_STATUS_TEXT,
  POINT_TYPE_TEXT,
  POINT_TYPE_USE_TEXT,
  POINT_USAGE_TEXT,
} from "~/constants/points.enum";
import { formatNumberWithCommaAndFloor } from "~/utils/number";
import { IconArrowBack } from "../Ui/Icons/icons";
import { useTranslation } from "react-i18next";

const PointHistory = ({ id }) => {
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const updateRef = useRef();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!data?.data) return;

    const query = searchQuery.toLowerCase();
    const filtered = data.data.filter(
      (item) =>
        item.pointUsage.toLowerCase().includes(query) ||
        item.pointType.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      setFilteredData([]);
    }
  };

  return (
    <PageLoader
      url={`/api/profile/mypoints/history`}
      setData={setData}
      ref={updateRef}
    >
      <div className={c.pointContainer}>
        <div className={c.header}>
          <div className={c.headerLeft} onClick={() => router.back()}>
            <IconArrowBack />
            <div className={c.icon}>P</div>
            <span>내 포인트 사용내역</span>
          </div>
          <div className={c.searchBox}>
            <input
              type="text"
              placeholder={t("검색어를 입력하세요")}
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button
              onClick={() => {
                handleSearch();
              }}
            >
              {t("검색하기")}
            </button>
          </div>
        </div>
        <div className={c.tableContent}>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingLeft: "24px" }}>날짜</th>
                <th style={{ textAlign: "center", width: "30%" }}>내용</th>
                <th style={{ textAlign: "center" }}>용도</th>
                <th style={{ textAlign: "center" }}>사용 종류</th>
                <th style={{ textAlign: "center" }}>사용 포인트</th>
                <th style={{ textAlign: "center" }}>남은 포인트</th>
                <th style={{ textAlign: "center" }}>현황</th>
              </tr>
            </thead>
            <tbody>
              {(filteredData.length > 0
                ? filteredData
                : data?.data?.slice(0, 10)
              )?.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "left" }}>
                    {row.createAt
                      ? dayjs(row.createAt).format("YYYY.MM.DD")
                      : "-"}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {POINT_USAGE_TEXT[row.pointUsage]}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {POINT_TYPE_USE_TEXT[row.pointUsage]}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {POINT_TYPE_TEXT[row.pointType]}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      color: row.point < 0 ? "#FF0000" : "#44A779",
                      fontWeight: "500",
                    }}
                  >
                    {formatNumberWithCommaAndFloor(row.point)}P
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      color: "var(--purple-dark)",
                      fontWeight: "500",
                    }}
                  >
                    {formatNumberWithCommaAndFloor(row.point)}P
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span>{POINT_STATUS_TEXT[row.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={c.tableMobile}>
          {(filteredData.length > 0
            ? filteredData
            : data?.data?.slice(0, 10)
          )?.map((row, index) => (
            <div className={c.pointItem} key={row.id}>
              <div className={c.pointItemLeft}>
                <p className={c.pointUsage}>
                  <span>{POINT_USAGE_TEXT[row.pointUsage]}</span>
                  {POINT_TYPE_USE_TEXT[row.pointUsage]}
                </p>
              </div>
              <div className={c.pointItemRight}>
                <p className={c.pointValue}>{row.point}P</p>
                <p className={c.pointType}>
                  {POINT_TYPE_TEXT[row.pointType]} <span>+{row.point}P</span>
                </p>
              </div>
              <p className={c.pointStatus}>
                {POINT_STATUS_TEXT[row.status]} <span>aksd****</span>
                <span className={c.pointDate}>
                  {row.createAt
                    ? dayjs(row.createAt).format("YYYY.MM.DD")
                    : "-"}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className={c.paginationMobile}>10개 더보기</div>

        <div className={c.pagination}>
          <PaginationCustom />
        </div>
      </div>
    </PageLoader>
  );
};

export default PointHistory;
