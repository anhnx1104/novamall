import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeadData from "~/components/Head";
import LayoutProfile from "../layout";

const PointHistory = dynamic(() => import("~/components/Profile/pointHistory"));

const PointsHistoryPage = () => {
  const breadcrumbs = [
    { title: "홈페이지", href: "/" },
    { title: "내 계정", href: "/profile" },
    { title: "내 포인트 내역", href: "/profile/points-history" },
  ];

  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <LayoutProfile backgroundChildren="transparent">
      <HeadData title="My Points" />
      <PointHistory id={session?.user?.id} />
    </LayoutProfile>
  );
};

PointsHistoryPage.requireAuth = true;

export default PointsHistoryPage;
PointsHistoryPage.headerBack = true;
PointsHistoryPage.headerBackText = "나의 포인트 사용내역";
