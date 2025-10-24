import { useState } from "react";
import { useTranslation } from "react-i18next";
import SalesAreaChart from "~/components/Dashboard/monthlySale";
import OrderStatusChart from "~/components/Dashboard/orderStatus";
import OrderSummary from "~/components/Dashboard/orderSummary";
import PageLoader from "~/components/Ui/pageLoader";
import classes from "~/styles/dashboard.module.css";
import { Card, Typography } from "@mui/material";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Divider,
} from "@mui/material";
import { Iconify } from "~/components/iconify";
const Dashboard = () => {
  const [data, setData] = useState({});
  const { t } = useTranslation();

  const statCards = [
    {
      title: "오늘의 주문 건수",
      value: "1,200",
      icon: <Iconify icon="mdi:invoice-add" width={32} height={32} />,
      background: `linear-gradient(135deg, #d0ecfe7a, #73bafb7a)`,
    },
    {
      title: "오늘의 매출 금액",
      value: "800",
      icon: <Iconify icon="mdi:currency-usd" width={32} height={32} />,
      background: `linear-gradient(135deg, #efd6ff7a, #c684ff7a)`,
    },
    {
      title: "신규 가입 회원 수",
      value: "350",
      icon: <Iconify icon="mdi:account-plus" width={32} height={32} />,
      background: `linear-gradient(135deg, #fff5cc7a, #ffd6667a)`,
    },
    {
      title: "신규 주문 N건 / 미답변 Q&A N건",
      sub: "교환요청 N건 / 취소요청 N건 / 반품요청 N건",
      background: `linear-gradient(135deg, #ffe9d57a, #ffac827a)`,
    },
  ];

  const generalProducts = Array(5).fill({
    code: "k2139ds123",
    name: "상품 이름",
    category: "의류",
    price: "10,000원",
  });

  const specialProducts = Array(5).fill({
    code: "k2139ds123",
    name: "상품 이름",
    group: "100,000원",
    buyers: "1,000명",
  });

  return (
    <PageLoader url={`/api/dashboard`} setData={setData} ref={null}>
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={4} align="left">
          대시보드
        </Typography>

        {/* --- Top Stat Cards --- */}
        <Grid container spacing={2}>
          {statCards.map((card, idx) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "left",
                  height: "110%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  background: card.background,
                }}
              >
                {card.value && (
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {card.icon}
                    {card.value}
                  </Typography>
                )}
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {card.title}
                </Typography>
                {card.sub && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {card.sub}
                  </Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* --- Charts Area --- */}
        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item size={{ xs: 12, sm: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                현재 주문 상태 요약
              </Typography>
              <OrderSummary data={data} />
            </Paper>
          </Grid>
          <Grid item size={{ xs: 12, sm: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {" "}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  주간 주문건수
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "right", mb: 1 }}>
                  총 주문 : 50건
                </Typography>
              </Box>

              <OrderSummary data={data} />
            </Paper>
          </Grid>
        </Grid>

        {/* --- Top Products --- */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            인기 판매 상품 TOP 5 (최근 7일 기준)
          </Typography>

          {/* 일반 상품 */}
          <Paper sx={{ p: 2, mb: 3, overflowX: "auto" }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              일반 상품
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>상품 코드</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>대표 이미지</TableCell>
                  <TableCell>상품군</TableCell>
                  <TableCell>가격</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {generalProducts.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>이미지</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* 특별 상품 */}
          <Paper sx={{ p: 2, overflowX: "auto" }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              특별 상품
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>상품 코드</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>대표 이미지</TableCell>
                  <TableCell>특별 그룹 명</TableCell>
                  <TableCell>구매자 수</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {specialProducts.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>이미지</TableCell>
                    <TableCell>{row.group}</TableCell>
                    <TableCell>{row.buyers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </PageLoader>
  );
};

Dashboard.requireAuthAdmin = true;
Dashboard.dashboard = true;

export default Dashboard;
