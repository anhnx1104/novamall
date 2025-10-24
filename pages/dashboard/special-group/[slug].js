import { ArrowLeft } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import classes from "~/components/tableFilter/table.module.css";
import SpecialGroupInfo from "./_components/SpecialGroupInfo";
import ProductManagement from "./_components/ProductManagement";
import MemberManagement from "./_components/MemberManagement";
import RefundUsers from "./_components/RefundUsers";
import { PencilSquare } from "@styled-icons/bootstrap";
import useSWR from "swr";
import { deleteData, postData, fetchData } from "~/lib/clientFunctions";

const SpecialGroupDetail = () => {
  const router = useRouter();

  const { slug } = router.query;
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("그룹 정보");

  const { data, error, mutate } = useSWR(`/api/group?id=${slug}`, fetchData);

  // Mock data - in a real application this would come from an API
  useEffect(() => {
    if (data && data.data) {
      setGroup(data.data);
    }
  }, [slug, data]);

  if (!group) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const tabs = [
    { id: "그룹 정보", label: "그룹 정보" },
    { id: "상품 관리", label: "상품 관리" },
    { id: "순위 관리", label: "순위 관리" },
    { id: "유저 진행상황", label: "유저 진행상황" },
  ];

  return (
    <div className="container-fluid px-3 px-md-4">
      {/* Header with back button and group name */}
      <div className="d-flex flex-wrap justify-content-between align-items-center my-3 gap-2">
        <div className="d-flex align-items-center">
          <Link href="/dashboard/special-group">
            <button className="btn bg-transparent border-0 p-0 me-2">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h4 className="mb-0 text-break">{group.name}</h4>
        </div>
        <Link href={`/dashboard/special-group/edit/${slug}`}>
          <button className="btn btn-outline-dark px-3">
            <PencilSquare size={16} className="me-1" />
            그룹 수정
          </button>
        </Link>
      </div>

      {/* Top navigation bar */}
      <div
        className="d-flex flex-nowrap overflow-auto"
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          scrollbarWidth: "thin",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="text-center py-3 px-2 px-md-3"
            style={{
              flex: "1 0 auto",
              minWidth: "90px",
              cursor: "pointer",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              color: activeTab === tab.id ? "var(--primary)" : "#666",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid var(--primary)"
                  : "1px solid #dee2e6",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tab content in container */}
      <div
        className={`${classes.container} rounded`}
        style={{
          padding: "15px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        {/* Group detail information */}
        {activeTab === "그룹 정보" && <SpecialGroupInfo group={group} />}

        {/* Product management tab */}
        {activeTab === "상품 관리" && <ProductManagement />}

        {/* Member management tab */}
        {activeTab === "순위 관리" && <MemberManagement />}

        {/* Refund users tab */}
        {activeTab === "유저 진행상황" && <RefundUsers />}
      </div>
    </div>
  );
};

SpecialGroupDetail.requireAuthAdmin = true;
SpecialGroupDetail.dashboard = true;

export default SpecialGroupDetail;
