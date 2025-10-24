import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeadData from "~/components/Head";
import LayoutProfile from "../../layout";

const ManageReviewsWrite = dynamic(() =>
  import("~/components/Profile/reviewsWrite")
);

const ReviewsWritePage = () => {
  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <LayoutProfile>
      <HeadData title="My Reviews" />
      <ManageReviewsWrite id={session?.user?.id} />
    </LayoutProfile>
  );
};

ReviewsWritePage.requireAuth = true;

export default ReviewsWritePage;
ReviewsWritePage.headerBack = true;
ReviewsWritePage.headerBackText = "나의 리뷰";
