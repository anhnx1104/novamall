import { useState } from "react";

import {
    Box,
    InputAdornment,
    Button,
    TextField,

    Tabs,
    Tab,
} from "@mui/material"
import { SearchOutlined } from "@mui/icons-material";
import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("react-data-table-component"));

const RewardManagement = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };
    const [searchQuery, setSearchQuery] = useState("");

    // 통화 포맷팅 헬퍼 함수 (필요한 경우)
    const formatCurrency = (amount) => {
        return amount.toLocaleString('ko-KR') + '원';
    };

    // 총합계 데이터 예시
    const totalData = {
        purchaseAmount: 1200000,
        maxPoints: 1200000,
        withdrawablePoints: 70000,
        shoppingPoints: 1120000,
    };

    // 총합계 행 전체 스타일
    const totalRowStyle = {
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid #000', // 상단 경계선 (데이터 테이블과의 분리)
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#fff', // 배경색
        height: '48px', // 행 높이 (테이블 행과 유사하게)
    };

    // '합계' 텍스트가 들어갈 셀 스타일 (첫 3개 컬럼의 너비를 합친 영역)
    // 이 너비는 실제 DataTable의 '유저 ID', '이름', '상품명' 컬럼의 너비 합과 일치해야 합니다.
    const totalLabelStyle = {
        flex: '0 0 30%', // 예시: 전체 너비의 약 30% (이 값은 실제 컬럼 너비에 따라 조정해야 합니다.)
        padding: '0 10px',
        textAlign: 'left',
        // 좌측 경계선이 필요하다면 추가
    };

    // 합계 금액 값이 들어갈 셀 스타일 (나머지 4개 컬럼 영역)
    // 컬럼 너비가 균등하다고 가정하고, 전체 탭 너비의 나머지 70%를 4등분합니다.
    const totalValueStyle = (columnIndex) => ({
        flex: 1, // 남은 공간을 균등하게 분배
        padding: '0 10px',
        textAlign: 'right', // 텍스트를 오른쪽 정렬
        // 추가적인 경계선 스타일 (필요하다면)
    });
    const handleSearch = () => {
        console.log("Search:", searchQuery);
    };

    const columns1 = [
        {
            name: "유저 ID",
            selector: (row) => row.userId,
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.userId}</div>
            ),
        },
        {
            name: "이름",
            selector: (row) => row.name,
            center: true,
            cell: (row) => (
                row.name
            ),
        },
        {
            name: "상품명",
            selector: (row) => row.productName,
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.productName}</div>
            ),
        },
        {
            name: "구매확정일",
            selector: (row) => row.purchaseConfirmDate,
            center: true,
            cell: (row) => (
                row.purchaseConfirmDate
            ),
        },
        {
            name: "구매 금액",
            selector: (row) => row.purchaseAmount,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.purchaseAmount}</div>
            ),
        },
        {
            name: "포인트 적립 한도",
            selector: (row) => row.maxPointLimit,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.maxPointLimit}</div>
            ),
        },
        {
            name: "출금 가능 포인트",
            selector: (row) => row.withdrawablePoint,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.withdrawablePoint}</div>
            ),
        },
        {
            name: "쇼핑몰 포인트",
            selector: (row) => row.shoppingPoint,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.shoppingPoint}</div>
            ),
        },
    ];

    const productList1 = [
        {
            _id: 1,
            userId: "user123",
            name: "홍길동",
            productName: "특별 제품 A",
            purchaseConfirmDate: "2024.12.15",
            purchaseAmount: "120,000원",
            maxPointLimit: "115,000원",
            withdrawablePoint: "115,000원",
            shoppingPoint: "115,000원",
        },
        {
            _id: 2,
            userId: "user124",
            name: "홍길동",
            productName: "프리미엄 제품 B",
            purchaseConfirmDate: "2024.12.20",
            purchaseAmount: "120,000원",
            maxPointLimit: "140,000원",
            withdrawablePoint: "135,000원",
            shoppingPoint: "130,000원",
        },
        {
            _id: 3,
            userId: "user125",
            name: "홍길동",
            productName: "일반 제품 C",
            purchaseConfirmDate: "2024.12.22",
            purchaseAmount: "120,000원",
            maxPointLimit: "75,000원",
            withdrawablePoint: "70,000원",
            shoppingPoint: "65,000원",
        },
        {
            _id: 4,
            userId: "user126",
            name: "홍길동",
            productName: "한정판 제품 D",
            purchaseConfirmDate: "2024.12.25",
            purchaseAmount: "120,000원",
            maxPointLimit: "190,000원",
            withdrawablePoint: "185,000원",
            shoppingPoint: "180,000원",
        },
        {
            _id: 5,
            userId: "user127",
            name: "홍길동",
            productName: "신제품 E",
            purchaseConfirmDate: "2024.12.30",
            purchaseAmount: "120,000원",
            maxPointLimit: "290,000원",
            withdrawablePoint: "280,000원",
            shoppingPoint: "275,000원",
        },
        {
            _id: 6,
            userId: "user128",
            name: "홍길동",
            productName: "할인 제품 F",
            purchaseConfirmDate: "2024.12.31",
            purchaseAmount: "120,000원",
            maxPointLimit: "45,000원",
            withdrawablePoint: "40,000원",
            shoppingPoint: "35,000원",
        },
    ];
    const columns2 = [
        {
            name: "유저 ID",
            selector: (row) => row.userId,
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.userId}</div>
            ),
        },
        {
            name: "이름",
            selector: (row) => row.name,
            center: true,
            cell: (row) => (
                row.name
            ),
        },
        {
            name: "상품명",
            selector: (row) => row.productName,
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.productName}</div>
            ),
        },
        {
            name: "구매확정일",
            selector: (row) => row.purchaseConfirmDate,
            center: true,
            cell: (row) => (
                row.purchaseConfirmDate
            ),
        },
        {
            name: "구매 금액",
            selector: (row) => row.purchaseAmount,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.purchaseAmount}</div>
            ),
        },
        {
            name: "전체 순위",
            selector: (row) => row.totalRank,
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.totalRank}</div>
            ),
        },
        {
            name: "대기 순위",
            selector: (row) => row.waitingRank,
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.waitingRank}</div>
            ),
        },
        {
            name: "포인트 적립 한도",
            selector: (row) => row.maxPointLimit,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.maxPointLimit}</div>
            ),
        },
    ];
    const productList2 = [
        {
            _id: 1,
            userId: "user123",
            name: "홍길동",
            productName: "특별 제품 A",
            purchaseConfirmDate: "2024.12.15",
            purchaseAmount: "120,000원",
            totalRank: "13/30",
            waitingRank: "3",
            maxPointLimit: "115,000원",
        },
        {
            _id: 2,
            userId: "user124",
            name: "홍길동",
            productName: "프리미엄 제품 B",
            purchaseConfirmDate: "2024.12.20",
            purchaseAmount: "120,000원",
            totalRank: "14/30",
            waitingRank: "4",
            maxPointLimit: "130,000원",
        },
        {
            _id: 3,
            userId: "user125",
            name: "홍길동",
            productName: "일반 제품 C",
            purchaseConfirmDate: "2024.12.22",
            purchaseAmount: "120,000원",
            totalRank: "15/30",
            waitingRank: "5",
            maxPointLimit: "65,000원",
        },
        {
            _id: 4,
            userId: "user126",
            name: "홍길동",
            productName: "한정판 제품 D",
            purchaseConfirmDate: "2024.12.25",
            purchaseAmount: "120,000원",
            totalRank: "16/30",
            waitingRank: "6",
            maxPointLimit: "180,000원",
        },
        {
            _id: 5,
            userId: "user127",
            name: "홍길동",
            productName: "신제품 E",
            purchaseConfirmDate: "2024.12.30",
            purchaseAmount: "120,000원",
            totalRank: "17/30",
            waitingRank: "7",
            maxPointLimit: "275,000원",
        },
        {
            _id: 6,
            userId: "user128",
            name: "홍길동",
            productName: "할인 제품 F",
            purchaseConfirmDate: "2024.12.31",
            purchaseAmount: "120,000원",
            totalRank: "18/30",
            waitingRank: "8",
            maxPointLimit: "35,000원",
        },
    ];
    const columns3 = [
        {
            name: "유저 ID",
            selector: (row) => row.userId,
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.userId}</div> // 유저 ID를 굵게
            ),
        },
        {
            name: "이름",
            selector: (row) => row.name,
            center: true,
            cell: (row) => (
                row.name
            ),
        },
        {
            name: "상품명",
            selector: (row) => row.productName, // 새로운 필드 이름
            center: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.productName}</div> // 상품명을 굵게
            ),
        },
        {
            name: "구매확정일",
            selector: (row) => row.purchaseConfirmDate, // 필드 이름 수정
            center: true,
            cell: (row) => (
                row.purchaseConfirmDate
            ),
        },
        // 이미지에는 없는 '완료일' 컬럼 추가 (데이터에 기반하여)
        {
            name: "완료일",
            selector: (row) => row.completionDate,
            center: true,
            cell: (row) => (
                row.completionDate
            ),
        },
        {
            name: "구매 금액",
            selector: (row) => row.purchaseAmount,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.purchaseAmount}</div>
            ),
        },
        {
            name: "포인트 적립 한도",
            selector: (row) => row.maxPointLimit,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.maxPointLimit}</div>
            ),
        },
        {
            name: "출금 가능 포인트",
            selector: (row) => row.withdrawablePoint,
            right: true,
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.withdrawablePoint}</div>
            ),
        },
        {
            name: "쇼핑몰 포인트",
            selector: (row) => row.shoppingPoint,
            right: true, // 오른쪽 정렬로 수정
            cell: (row) => (
                <div style={{ fontWeight: 'bold' }}>{row.shoppingPoint}</div>
            ),
        },
    ];
    const productList3 = [
        {
            _id: 1,
            userId: "user123",
            name: "홍길동",
            productName: "특별 제품 A",
            purchaseConfirmDate: "2024.12.15",
            completionDate: "2024.12.15",
            purchaseAmount: "200,000원",
            maxPointLimit: "115,000원",
            withdrawablePoint: "115,000원",
            shoppingPoint: "115,000원",
        },
        {
            _id: 2,
            userId: "user124",
            name: "홍길동",
            productName: "프리미엄 제품 B",
            purchaseConfirmDate: "2024.12.20",
            completionDate: "2024.12.15",
            purchaseAmount: "200,000원",
            maxPointLimit: "140,000원",
            withdrawablePoint: "135,000원",
            shoppingPoint: "130,000원",
        },
        {
            _id: 3,
            userId: "user125",
            name: "홍길동",
            productName: "일반 제품 C",
            purchaseConfirmDate: "2024.12.22",
            completionDate: "2024.12.15",
            purchaseAmount: "200,000원",
            maxPointLimit: "75,000원",
            withdrawablePoint: "70,000원",
            shoppingPoint: "65,000원",
        },
        {
            _id: 4,
            userId: "user126",
            name: "홍길동",
            productName: "한정판 제품 D",
            purchaseConfirmDate: "2024.12.25",
            completionDate: "2024.12.15",
            purchaseAmount: "200,000원",
            maxPointLimit: "190,000원",
            withdrawablePoint: "185,000원",
            shoppingPoint: "180,000원",
        },
        {
            _id: 5,
            userId: "user127",
            name: "홍길동",
            productName: "신제품 E",
            purchaseConfirmDate: "2024.12.30",
            completionDate: "2024.12.15",
            purchaseAmount: "200,000원",
            maxPointLimit: "290,000원",
            withdrawablePoint: "280,000원",
            shoppingPoint: "275,000원",
        },
        {
            _id: 6,
            userId: "user128",
            name: "홍길동",
            productName: "할인 제품 F",
            purchaseConfirmDate: "2024.12.31",
            completionDate: "2024.12.15",
            purchaseAmount: "200,000원",
            maxPointLimit: "45,000원",
            withdrawablePoint: "40,000원",
            shoppingPoint: "35,000원",
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
            <Box sx={{ display: "flex", gap: 1, width: "100%", mt: 2, mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleChangeTab}
                    sx={{
                        backgroundColor: "#D9D9D9",
                        minHeight: '40px', // Tabs 컨테이너의 최소 높이를 줄여 전체 여백을 최소화
                        width: "30%",
                        "& .MuiTab-root": {
                            minHeight: "40px", // Tab 요소 자체의 최소 높이를 컨테이너와 맞춥니다.
                            padding: '0 16px', // 필요하다면 내부 패딩을 조정하여 텍스트 위치를 최적화
                            textTransform: "none",
                            fontWeight: 500,
                            color: "#333",
                            flex: 1, // 탭을 균등하게 분배
                        },

                        "& .MuiTabs-indicator": {
                            display: "none", // 하단 인디케이터 제거
                        },

                        "& .Mui-selected": {
                            backgroundColor: "#bdbdbd",
                            fontWeight: 600,
                            color: '#333',
                        },
                    }}
                >
                    <Tab label="진행중인 내역" />
                    <Tab label="대기중인 내역" />
                    <Tab label="완료된 내역" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <div style={{ paddingBottom: '20px' }}>
                    <DataTable
                        columns={columns1}
                        data={productList1}
                        keyField="_id"
                        persistTableHead
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover
                    />

                    {/* 👇 이 부분이 추가될 총합계 행입니다. */}
                    <div style={totalRowStyle}>
                        {/* '합계' 텍스트를 표시하는 영역 */}
                        <div style={totalLabelStyle}>
                            합계
                        </div>

                        {/* 합계 금액이 들어갈 영역들 (헤더 컬럼 너비에 맞춰 조정 필요) */}
                        {/* 실제 데이터의 '구매 금액' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(4)}>
                            {formatCurrency(totalData.purchaseAmount)} {/* 예: 1,200,000원 */}
                        </div>

                        {/* '포인트 적립 한도' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(5)}>
                            {formatCurrency(totalData.maxPoints)} {/* 예: 1,200,000원 */}
                        </div>

                        {/* '출금 가능 포인트' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(6)}>
                            {formatCurrency(totalData.withdrawablePoints)} {/* 예: 70,000원 */}
                        </div>

                        {/* '쇼핑 포인트' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(7)}>
                            {formatCurrency(totalData.shoppingPoints)} {/* 예: 1,120,000원 */}
                        </div>

                        {/* 나머지 3개의 빈 셀을 위한 더미 영역 (유저ID, 이름, 상품명) */}
                        {/* 이미지 상에서 '합계' 텍스트는 3개의 셀 영역을 병합한 너비를 차지하고 있습니다. */}
                    </div>
                </div>
            )}



            {tabValue === 1 && (
                <div style={{ paddingBottom: '20px' }}>
                    <DataTable
                        columns={columns2}
                        data={productList2}
                        keyField="_id"
                        persistTableHead
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover
                    />

                </div>
            )}

            {tabValue === 2 && (
                <div style={{ paddingBottom: '20px' }}>
                    <DataTable
                        columns={columns3}
                        data={productList3}
                        keyField="_id"
                        persistTableHead
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover
                    />

                    {/* 👇 이 부분이 추가될 총합계 행입니다. */}
                    <div style={totalRowStyle}>
                        {/* '합계' 텍스트를 표시하는 영역 */}
                        <div style={totalLabelStyle}>
                            합계
                        </div>

                        {/* 합계 금액이 들어갈 영역들 (헤더 컬럼 너비에 맞춰 조정 필요) */}
                        {/* 실제 데이터의 '구매 금액' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(4)}>
                            {formatCurrency(totalData.purchaseAmount)} {/* 예: 1,200,000원 */}
                        </div>

                        {/* '포인트 적립 한도' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(5)}>
                            {formatCurrency(totalData.maxPoints)} {/* 예: 1,200,000원 */}
                        </div>

                        {/* '출금 가능 포인트' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(6)}>
                            {formatCurrency(totalData.withdrawablePoints)} {/* 예: 70,000원 */}
                        </div>

                        {/* '쇼핑 포인트' 컬럼에 해당하는 부분 */}
                        <div style={totalValueStyle(7)}>
                            {formatCurrency(totalData.shoppingPoints)} {/* 예: 1,120,000원 */}
                        </div>

                        {/* 나머지 3개의 빈 셀을 위한 더미 영역 (유저ID, 이름, 상품명) */}
                        {/* 이미지 상에서 '합계' 텍스트는 3개의 셀 영역을 병합한 너비를 차지하고 있습니다. */}
                    </div>
                </div>
            )}
        </Box >
    );
};

export default RewardManagement;