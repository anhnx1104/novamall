import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeadData from "~/components/Head";
import LayoutProfile from "../layout";

const ManageSettings = dynamic(() => import("~/components/Profile/settings"));

const SettingsPage = () => {
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
      <HeadData title="My Settings" />
      <ManageSettings id={session?.user?.id} />
    </LayoutProfile>
  );
};

SettingsPage.requireAuth = true;

export default SettingsPage;
SettingsPage.headerBack = true;
SettingsPage.headerBackText = "알림 설정";
