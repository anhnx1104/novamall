"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import GroupManagement from "./ProductTabCreate/GroupManagement";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RankingManagement from "./ProductTabCreate/RankingManagement";
export default function ProductFormCreate() {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const groupData = [
    { label: "그룹명", value: "1번 그룹" },
    { label: "그룹 가격", value: "200,000원" },
    { label: "상위 유지 수", value: "10명" },
    { label: "최대 적립한도", value: "100,000원" },
    { label: "포인트 배분 비율", value: "출금 : 50% │ 쇼핑 : 50%" },
    { label: "등록된 상품 수", value: "7개" },
    { label: "현재 상태", value: "노출" },
  ]
  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ArrowBackIcon sx={{ cursor: "pointer" }} />
          <Typography variant="h6" fontWeight={700}>

            {tabValue === 0 && "1번 그룹"}
            {tabValue === 1 && " 20만원"}
            {tabValue === 2 && " 20만원"}
            {tabValue === 3 && " 20만원"}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          sx={{
            borderColor: "#bdbdbd",
            color: "#333",
            backgroundColor: "#f5f5f5",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          {tabValue === 0 && "수정하기"}
          {tabValue === 1 && "+ 새 상품 등록"}
          {tabValue === 2 && "수정하기"}
          {tabValue === 3 && "수정하기"}
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        sx={{
          backgroundColor: "#e0e0e0",
          "& .MuiTab-root": {
            minHeight: "auto",
            textTransform: "none",
            fontWeight: 500,
            color: "#333",
            flex: 1,
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .Mui-selected": {
            backgroundColor: "#bdbdbd",
            fontWeight: 600,
          },
        }}
      >
        <Tab label="그룹 정보" />
        <Tab label="그룹 관리" />
        <Tab label="순위 관리" />
        <Tab label="리워드 관리" />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "#e8e8e8",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              그룹 상세 정보
            </Typography>
            <TableContainer>
              <Table
                sx={{
                  borderCollapse: "collapse",
                  "& td, & th": {
                    borderBottom: "2x solid #ddd",
                    paddingY: "24px",
                    paddingX: "16px",
                  },
                }}
              >
                <TableBody>
                  {groupData.map((row, index) => (
                    <TableCell
                      key={index}
                      component="tr"
                      sx={{
                        display: "table-row",

                      }}
                    >
                      <TableCell
                        sx={{

                          fontWeight: 600,
                          width: 180,
                        }}
                      >
                        {row.label}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "2px solid #ddd" }}>{row.value}</TableCell>
                    </TableCell>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </Paper>
        )}

        {tabValue === 1 && (
          <GroupManagement />
        )}
        {tabValue === 2 && (
          <RankingManagement />
        )}
        {tabValue === 3 && (
          <Typography sx={{ mt: 3 }}>리워드 관리 탭 내용 (sẽ bổ sung sau)</Typography>
        )}
      </Box>
    </Box>
  );
}
