import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HeadData from "~/components/Head";
import LayoutProfile from "../layout";

const ManageOrderDelivery = dynamic(() =>
  import("~/components/Profile/orderDelivery")
);

const OrderDeliveryPage = () => {
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
      <HeadData title="주문/배송내역" />
      <ManageOrderDelivery id={session?.user?.id} />
    </LayoutProfile>
  );
};

OrderDeliveryPage.requireAuth = true;

export default OrderDeliveryPage;
OrderDeliveryPage.headerBack = true;
OrderDeliveryPage.headerBackText = "주문/배송내역";
