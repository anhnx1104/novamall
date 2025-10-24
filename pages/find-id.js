import dynamic from "next/dynamic";
const FindId = dynamic(() => import("~/components/Auth/findid"));

export default function FindIdPage() {
  return <FindId />;
}
FindIdPage.footer = false;
FindIdPage.header = false;
