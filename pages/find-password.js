import dynamic from "next/dynamic";
const FindPassword = dynamic(() => import("~/components/Auth/findpassword"));

export default function FindPasswordPage() {
  return <FindPassword />;
}
FindPasswordPage.footer = false;
FindPasswordPage.header = false;
