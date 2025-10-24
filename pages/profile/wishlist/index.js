import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeadData from "~/components/Head";
import LayoutProfile from "../layout";

const ManageWishList = dynamic(() => import("~/components/Profile/wishlist"));

const WishlistPage = () => {
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
      <HeadData title="My Wishlist" />
      <ManageWishList id={session?.user?.id} />
    </LayoutProfile>
  );
};

WishlistPage.requireAuth = true;

export default WishlistPage;
WishlistPage.headerBack = true;
WishlistPage.headerBackText = "찜한 상품";
