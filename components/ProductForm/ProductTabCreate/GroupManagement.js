"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Checkbox, Button } from "@mui/material";

const DataTable = dynamic(() => import("react-data-table-component"));

const GroupManagement = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const productList = Array.from({ length: 12 }, (_, i) => ({
        _id: i + 1,
        image: "이미지",
        name: `상품${i + 1}`,
        price: "200,000원",
        rewardRate: "20%",
        salesCount: "30(25)",
        topRetention: 7,
        inProgress: 17,
        completed: 3,
        waiting: 12,
    }));

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? productList.map((p) => p._id) : []);
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const allChecked =
        selectedRows.length > 0 && selectedRows.length === productList.length;
    const someChecked =
        selectedRows.length > 0 && selectedRows.length < productList.length;

    const columns = [
        {
            name: "이미지",
            cell: (row) => "이미지 ",
            width: "70px",
            sortable: false,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true
        },
        { name: "상품명", selector: (row) => '상품1', center: true },
        { name: "가격", selector: (row) => row.price, center: true },

        { name: "리워드 비율", selector: (row) => '20%', center: true },

        { name: "판매 수량(구매자 수)", selector: (row) => '30(25)', center: true },

        { name: "상위 유저수", selector: (row) => '7', center: true },

        { name: "진행 중인수", selector: (row) => '17', center: true },
        { name: "진행 완료수", selector: (row) => '3', center: true },
        { name: "진행 대기수", selector: (row) => '12' },
        { name: "관리", selector: (row) => '상세' },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontWeight: 700,
                fontSize: "14px",
                borderBottom: "1px solid #ddd",
            },
        },
        cells: {
            style: {
                borderBottom: "1px solid #eee",
                fontSize: "14px",
            },
        },
        table: {
            style: {
                border: "1px solid #e0e0e0",
            },
        },
    };

    return (
        <DataTable
            columns={columns}
            data={productList}
            keyField="_id"
            pagination
            persistTableHead
            customStyles={customStyles}
            highlightOnHover
            pointerOnHover
        />
    );
};

export default GroupManagement;
