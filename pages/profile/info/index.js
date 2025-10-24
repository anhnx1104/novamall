import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BreadcrumbsCustom from "~/components/Breadcrumbs";
import classes from "~/styles/profile.module.css";
import { MenuApp } from "@styled-icons/bootstrap";
import HeadData from "~/components/Head";
import ManageMyProfile from "~/components/Profile/myProfile";
import LayoutProfile from "../layout";

const ProfilePage = () => {
  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <LayoutProfile backgroundChildren="transparent">
      <HeadData title="나의 쇼핑" />
      <ManageMyProfile id={session?.user?.id} />
    </LayoutProfile>
  );
};

ProfilePage.requireAuth = true;

export default ProfilePage;
ProfilePage.headerBack = true;
ProfilePage.headerBackText = "나의 쇼핑";
ProfilePage.footer = true;
