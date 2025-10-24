import { useState } from "react";

import {
    Box,
    InputAdornment,
    Button,
    TextField,
    Chip,
    Typography
} from "@mui/material"
import { SearchOutlined } from "@mui/icons-material";
import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("react-data-table-component"));
const DeleteGroupDialog = dynamic(() => import("~/components/Dialog"));

const RankingManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const filters = ["전체", "상품 1", "상품 2", "상품 3", "상품 4", "상품 5", "상품 6", "상품 7"];
    const [active, setActive] = useState("전체");
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };
    const openModal = () => {

        setIsOpen(true);
    };
    const handleSearch = () => {
        console.log("Search:", searchQuery);
    };

    const columns1 = [
        {
            name: "순위",
            selector: (row) => row.rank,
            width: "70px",
            center: true,
        },
        {
            name: "유저 ID",
            selector: (row) => row.userId,
            sortable: true,
            center: true,
        },
        {
            name: "이름",
            selector: (row) => row.name,
            center: true,
        },
        {
            name: "구매확정일",
            selector: (row) => row.purchaseDate,
            center: true,
        },
        {
            name: "최대 적립 한도",
            selector: (row) => row.maxPoint,
            right: true,
        },
        {
            name: "지급된 포인트",
            selector: (row) => row.givenPoint,
            right: true,
        },
        {
            name: "대기 포인트",
            selector: (row) => row.pendingPoint,
            right: true,
        },
        {
            name: "리워드 진행률",
            selector: (row) => row.rewardRate,
            center: true,
        },
        {
            name: "상태",
            selector: (row) => row.status,
            center: true,
            cell: (row) => (
                <Button onClick={() => openModal()}>진행중 </Button>
            ),
        },
    ];

    const productList1 = [
        {
            _id: 1,
            rank: 1,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
        {
            _id: 2,
            rank: 2,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
        {
            _id: 3,
            rank: 3,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
        {
            _id: 4,
            rank: 4,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
        {
            _id: 5,
            rank: 5,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
    ];

    const columns2 = [
        {
            name: "순위",
            selector: (row) => row.rank,
            width: "70px",
            center: true,
        },
        {
            name: "유저 ID",
            selector: (row) => row.userId,
            sortable: true,
            center: true,
            cell: (row) => (
                'user123'
            ),
        },
        {
            name: "이름",
            selector: (row) => row.name,
            center: true,
            cell: (row) => (
                '홍길동'
            ),
        },
        {
            name: "구매확정일",
            selector: (row) => row.purchaseDate,
            center: true,
            cell: (row) => (
                '2024.12.15'
            ),
        },
        {
            name: "최대 적립 한도",
            selector: (row) => row.maxPoint,
            right: true,
            cell: (row) => (
                '120,000원'
            ),
        },
        {
            name: "지급된 포인트",
            selector: (row) => row.givenPoint,
            right: true,
            cell: (row) => (
                '0원'
            ),
        },
        {
            name: "리워드 진행률",
            selector: (row) => row.pendingPoint,
            right: true,
            cell: (row) => (
                '85%'
            ),
        },
        {
            name: "상태",
            selector: (row) => row.status,
            center: true,
            cell: (row) => (
                <Button onClick={() => openModal()}>대기 </Button>
            ),
        },
    ];

    const productList2 = [
        {
            _id: 5,
            rank: 5,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
        {
            _id: 6,
            rank: 6,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
        {
            _id: 7,
            rank: 7,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },
        {
            _id: 8,
            rank: 8,
            userId: "user123",
            name: "홍길동",
            purchaseDate: "2024.12.15",
            maxPoint: "120,000원",
            givenPoint: "115,000원",
            pendingPoint: "2,000원",
            rewardRate: "85%",
            status: "진행중",
        },

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
        <Box>
            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                <TextField
                    placeholder="상품명 or 코드 입력"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    sx={{ flex: 18 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        flex: 1,
                        backgroundColor: "#666",
                        "&:hover": {
                            backgroundColor: "#555",
                        },
                    }}
                >
                    초기화
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 2,
                }}
            >
                {filters.map((label) => (
                    <Chip
                        key={label}
                        label={label}
                        onClick={() => setActive(label)}
                        sx={{
                            borderRadius: "16px",
                            fontWeight: 600,
                            px: 2,
                            backgroundColor: active === label ? "#000" : "#ccc",
                            color: active === label ? "#fff" : "#000",
                            "&:hover": {
                                backgroundColor: active === label ? "#000" : "#bdbdbd",
                            },
                        }}
                    />
                ))}
            </Box>
            <Typography sx={{
                fontSize: "20px",
                fontWeight: 600,
                mt: 2,
                mb: 2
            }}>
                상위 그룹 유저  5명
            </Typography>
            {/* Table 1 */}
            <DataTable
                columns={columns1}
                data={productList1}
                keyField="_id"
                persistTableHead
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
            />
            <Typography sx={{
                fontSize: "20px",
                fontWeight: 600,
                mt: 2,
                mb: 2
            }}>
                대기 그룹 유저 5명
            </Typography>
            <DataTable
                columns={columns2}
                data={productList2}
                keyField="_id"
                persistTableHead
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
            />

            <DeleteGroupDialog
                open={isOpen}
                onClose={() => closeModal()}
                onConfirm={() => { console.log("onCLick") }}
                title=""
                subs="홍길동 유저의 상태를 정지(완료, 진행중, 대기중)상태로 변경하시겠습니까?"
            />
        </Box >
    );
};

export default RankingManagement;