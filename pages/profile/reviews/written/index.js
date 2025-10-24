import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeadData from "~/components/Head";
import LayoutProfile from "../../layout";

const ManageReviewsWritten = dynamic(() =>
  import("~/components/Profile/reviewsWritten")
);

const ReviewsWrittenPage = () => {
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
      <ManageReviewsWritten id={session?.user?.id} />
    </LayoutProfile>
  );
};

ReviewsWrittenPage.requireAuth = true;

export default ReviewsWrittenPage;
ReviewsWrittenPage.headerBack = true;
ReviewsWrittenPage.headerBackText = "나의 리뷰";
