import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Card from "../Ui/Card";
import { useTranslation } from "react-i18next";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OrderStatusChart = ({ statusData }) => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const { t } = useTranslation();

  // 주문 상태를 한국어로 변환하는 함수
  const translateStatus = (status) => {
    const statusMap = {
      Pending: "대기 중",
      "In Progress": "진행 중",
      Packaged: "포장 완료",
      Shipped: "배송 중",
      Delivered: "배송 완료",
      Canceled: "취소됨",
      Cancelled: "취소됨", // 혹시 다른 형태로 사용될 경우
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    setChartData({
      options: {
        labels: data.map((status) => translateStatus(status[0])), // 여기서 번역 함수 적용
      },
      series: data.map((status) => status[1]),
    });
  }, [data]);

  useEffect(() => {
    if (statusData?.orderCounts) {
      const __d = Object.entries(statusData?.orderCounts).map((x) => x);
      setData(__d);
    }
  }, [statusData]);

  return (
    <Card title={t("Yearly order status summary")}>
      {chartData && (
        <ApexChart
          options={chartData.options}
          series={chartData.series}
          type="polarArea"
          height={320}
        />
      )}
    </Card>
  );
};

export default OrderStatusChart;
