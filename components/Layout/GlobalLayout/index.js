import dynamic from "next/dynamic";

const ClientLayout = dynamic(() => import("../Client/layout"));
const DashboardLayout = dynamic(() => import("../Dashboard/layout"));

const GlobalLayout = (props) => {
  if (props.error) {
    return <>{props.children}</>;
  }

  if (props.dashboard) {
    return <DashboardLayout>{props.children}</DashboardLayout>;
  }

  return (
    <ClientLayout
      footer={props.footer}
      header={props.header}
      headerBack={props.headerBack}
      headerBackText={props.headerBackText}
      navbarMode={props.navbarMode}
    >
      {props.children}
    </ClientLayout>
  );
};

export default GlobalLayout;
