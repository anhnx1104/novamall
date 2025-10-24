import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeadData from "~/components/Head";
import LayoutProfile from "../layout";

const ManageMyPoints = dynamic(() => import("~/components/Profile/myPoints"));

const PointsPage = () => {
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
      <ManageMyPoints id={session?.user?.id} />
    </LayoutProfile>
  );
};

PointsPage.requireAuth = true;

export default PointsPage;
PointsPage.headerBack = true;
PointsPage.headerBackText = "나의 쇼핑";
