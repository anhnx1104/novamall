import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "@styled-icons/bootstrap";
import { fetchData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const MemberManagement = () => {
  // Mock data for upper/top tier members based on the image
  const router = useRouter();
  const { slug } = router.query;
  const [topMembers, setTopMembers] = useState([]);
  const [waitingMembers, setWaitingMembers] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData(`/api/product/special/group?id=${slug}`)
      .then((res) => {
        if (res.data) {
          setProductList(res.data);
        } else {
          toast.error("특별 제품 목록 조회 실패");
        }
      })
      .catch(() => toast.error("특별 제품 목록 조회 실패"));
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    try {
      fetchData(`/api/group/product?productId=${activeTab}`)
        .then((res) => {
          if (res.data) {
            const rankingList = res.data.rankingList || [];
            let filteredList = rankingList;
            // activeTab이 있으면 해당 product만 필터링
            if (activeTab) {
              filteredList = rankingList.filter(
                (item) => item.product._id === activeTab
              );
            }
            const userLimit = filteredList[0]?.group?.user_limit || 0;
            setTopMembers(
              filteredList.filter((item) => item.rank <= userLimit)
            );
            setWaitingMembers(
              filteredList.filter((item) => item.rank > userLimit)
            );
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("상품별 정보 조회를 실패했습니다.");
        });
    } catch (err) {
      console.log(err);
      toast.error("상품별 정보 조회를 실패했습니다.");
    }
  }, [activeTab]);

  useEffect(() => {
    if (productList.length > 0) {
      setActiveTab(productList[0]._id); // Set the first product as the default active tab
    }
  }, [productList]);

  // 검색 필터링
  const filterMembers = (members) => {
    if (!search.trim()) return members;
    return members.filter(
      (member) =>
        member.user.email?.toLowerCase().includes(search.toLowerCase()) ||
        member.user.name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  // 초기화 버튼
  const handleReset = () => {
    setSearch("");
  };

  return (
    <div>
      {/* Search and filter section */}
      <div className="mb-4">
        <div className="mb-3">
          <h3 className="mb-3 fw-bold" style={{ fontSize: "20px" }}>
            순위 및 리베이트 관리
          </h3>
          <div className="d-flex flex-column flex-md-row gap-2 gap-md-0">
            <div
              className="position-relative w-100"
              style={{ maxWidth: "600px" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="유저 ID 또는 이름으로 검색..."
                value={search}
                style={{
                  paddingLeft: "40px",
                  height: "38px",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span
                className="position-absolute"
                style={{
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                }}
              >
                <Search size={16} />
              </span>
            </div>
            <button
              className="btn btn-outline-dark btn-sm px-3 ms-md-3"
              style={{
                height: "38px",
                fontSize: "14px",
                alignSelf: "flex-start",
              }}
              onClick={handleReset}
            >
              초기화
            </button>
          </div>
        </div>

        {/* Tabs for group filtering */}
        <div className="mb-4 overflow-auto">
          <ul
            className="nav nav-pills flex-nowrap"
            style={{ fontSize: "14px" }}
          >
            {productList.map((product) => (
              <li className="nav-item me-2" key={product._id}>
                <button
                  className={`nav-link px-3 py-2 ${
                    activeTab === product._id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(product._id)}
                  style={{
                    borderRadius: "4px",
                    backgroundColor: "#f8f9fa",
                    color: "#495057",
                    border: "none",
                    fontWeight: activeTab === product._id ? "bold" : "normal",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upper/Top Tier Members Section */}
      <div className="mb-5">
        <h5 className="mb-3 fw-bold" style={{ fontSize: "16px" }}>
          상위 그룹 유저
        </h5>
        <div className="table-responsive">
          <table
            className="table"
            style={{ fontSize: "14px", minWidth: "900px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "600" }}>
                <th
                  className="ps-3 py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  순위
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  유저 ID
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  이름
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매일
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매 금액
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  포인트 적립 한도
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  지급된 포인트
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  리베이트 진행률
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {filterMembers(topMembers).map((member) => (
                <tr
                  key={member.id}
                  className="align-middle"
                  style={{ height: "56px", borderBottom: "1px solid #dee2e6" }}
                >
                  <td className="ps-3">{member.rank}</td>
                  <td>{member.user.email}</td>
                  <td>{member.user.name}</td>
                  <td>
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{formatNumberWithCommaAndFloor(member.group.price)}</td>
                  <td>
                    {formatNumberWithCommaAndFloor(member.product.pointLimit)}
                  </td>
                  <td>
                    {formatNumberWithCommaAndFloor(
                      member.totalShopping + member.totalWithdrawable
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "100px",
                          height: "8px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: `${
                              ((member.totalShopping +
                                member.totalWithdrawable) /
                                member.product.pointLimit) *
                              100
                            }%`,
                            height: "100%",
                            backgroundColor: "#212529",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                      <span>
                        {(
                          ((member.totalShopping + member.totalWithdrawable) /
                            member.product.pointLimit) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{ backgroundColor: "#e7f1ff", color: "#0d6efd" }}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Waiting Members Section */}
      <div>
        <h5 className="mb-3 fw-bold" style={{ fontSize: "16px" }}>
          대기 상태 유저
        </h5>
        <div className="table-responsive">
          <table
            className="table"
            style={{ fontSize: "14px", minWidth: "900px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "600" }}>
                <th
                  className="ps-3 py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  순위
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  유저 ID
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  이름
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매일
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  구매 금액
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  포인트 적립 한도
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  지급된 포인트
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  리베이트 진행률
                </th>
                <th
                  className="py-3"
                  style={{
                    borderTop: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    whiteSpace: "nowrap",
                  }}
                >
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {filterMembers(waitingMembers).map((member) => (
                <tr
                  key={member.id}
                  className="align-middle"
                  style={{ height: "56px", borderBottom: "1px solid #dee2e6" }}
                >
                  <td className="ps-3">{member.rank}</td>
                  <td>{member.user.email}</td>
                  <td>{member.user.name}</td>
                  <td>
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{formatNumberWithCommaAndFloor(member.group.price)}</td>
                  <td>
                    {formatNumberWithCommaAndFloor(member.product.pointLimit)}
                  </td>
                  <td>
                    {formatNumberWithCommaAndFloor(
                      member.totalShopping + member.totalWithdrawable
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "100px",
                          height: "8px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: `${
                              ((member.totalShopping +
                                member.totalWithdrawable) /
                                member.product.pointLimit) *
                              100
                            }%`,
                            height: "100%",
                            backgroundColor: "#212529",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                      <span>
                        {(
                          ((member.totalShopping + member.totalWithdrawable) /
                            member.product.pointLimit) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{ backgroundColor: "#fff8dd", color: "#ffc107" }}
                    >
                      wait
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
