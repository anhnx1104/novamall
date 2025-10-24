import {
  BagCheck,
  BoxSeam,
  CardText,
  Palette,
  Star,
  UiChecksGrid,
  Display,
  Envelope,
  Truck,
  Gear,
  HouseGear,
  Tag,
  People,
  ChatDots,
  ChevronDown,
} from "@styled-icons/bootstrap";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { filterPermission } from "~/lib/clientFunctions";
import classes from "./menu.module.css";
import { useTranslation } from "react-i18next";
import {
  Box,
  ListItem,
  ListItemButton,
  Collapse,
  List,
  ListItemText,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { Iconify } from "~/components/iconify";

const DashboardMenu = (props) => {
  const { session } = useSelector((state) => state.localSession);
  const { t } = useTranslation();
  const pathname = usePathname();
  const isOpen = props.menuState;

  // const menuData = [
  //   {
  //     name: t("Dashboard"),
  //     icon: <Iconify icon="solar:chart-square-bold" width={20} height={20} />,
  //     target: "dashboard",
  //     url: "/dashboard", // adding url for main Dashboard item
  //   },
  //   {
  //     name: t("products"),
  //     icon: <BoxSeam width={20} height={20} />,
  //     target: "product",
  //     subMenu: [
  //       {
  //         name: t("All General Products"),
  //         url: "/dashboard/product",
  //       },
  //       {
  //         name: t("All Special Products"),
  //         url: "/dashboard/special-product",
  //       },
  //       {
  //         name: t("Special Group List"),
  //         url: "/dashboard/special-group",
  //       },
  //       {
  //         name: t("add_new_product"),
  //         url: "/dashboard/product/create",
  //         create: true,
  //       },
  //     ],
  //   },
  //   {
  //     name: t("orders"),
  //     icon: <BagCheck width={20} height={20} />,
  //     target: "order",
  //     subMenu: [
  //       {
  //         name: t("all_orders"),
  //         url: "/dashboard/orders",
  //       },
  //       {
  //         name: t("Refund request"),
  //         url: "/dashboard/orders/refund",
  //       },
  //     ],
  //   },
  //   // {
  //   //   name: t("categories"),
  //   //   icon: <UiChecksGrid width={20} height={20} />,
  //   //   target: "category",
  //   //   subMenu: [
  //   //     {
  //   //       name: t("category_list"),
  //   //       url: "/dashboard/categories",
  //   //     },
  //   //     {
  //   //       name: t("Add New Category"),
  //   //       url: "/dashboard/categories/create",
  //   //       create: true,
  //   //     },
  //   //     {
  //   //       name: t("Subcategory List"),
  //   //       url: "/dashboard/categories/subcategories",
  //   //     },
  //   //     {
  //   //       name: t("Add New Subcategory"),
  //   //       url: "/dashboard/categories/subcategories/create",
  //   //       create: true,
  //   //     },
  //   //     {
  //   //       name: t("Child category List"),
  //   //       url: "/dashboard/categories/childcategories",
  //   //     },
  //   //     {
  //   //       name: t("Add New Child category"),
  //   //       url: "/dashboard/categories/childcategories/create",
  //   //       create: true,
  //   //     },
  //   //   ],
  //   // },
  //   // {
  //   //   name: t("Coupons"),
  //   //   icon: <CardText width={20} height={20} />,
  //   //   target: "coupon",
  //   //   subMenu: [
  //   //     {
  //   //       name: t("All Coupons"),
  //   //       url: "/dashboard/coupons",
  //   //     },
  //   //     {
  //   //       name: t("Add New Coupon"),
  //   //       url: "/dashboard/coupons/create",
  //   //       create: true,
  //   //     },
  //   //   ],
  //   // },
  //   // {
  //   //   name: t("Colors"),
  //   //   icon: <Palette width={20} height={20} />,
  //   //   target: "color",
  //   //   subMenu: [
  //   //     {
  //   //       name: t("All Colors"),
  //   //       url: "/dashboard/colors",
  //   //     },
  //   //     {
  //   //       name: t("Add New Color"),
  //   //       url: "/dashboard/colors/create",
  //   //       create: true,
  //   //     },
  //   //   ],
  //   // },
  //   // {
  //   //   name: t("Attributes"),
  //   //   icon: <Tag width={20} height={20} />,
  //   //   target: "attribute",
  //   //   subMenu: [
  //   //     {
  //   //       name: t("All Attributes"),
  //   //       url: "/dashboard/attributes",
  //   //     },
  //   //     {
  //   //       name: t("Add New Attribute"),
  //   //       url: "/dashboard/attributes/create",
  //   //       create: true,
  //   //     },
  //   //   ],
  //   // },
  //   // {
  //   //   name: t("Brands"),
  //   //   icon: <Star width={20} height={20} />,
  //   //   target: "brand",
  //   //   subMenu: [
  //   //     {
  //   //       name: t("All Brands"),
  //   //       url: "/dashboard/brand",
  //   //     },
  //   //     {
  //   //       name: t("Add New Brand"),
  //   //       url: "/dashboard/brand/create",
  //   //       create: true,
  //   //     },
  //   //   ],
  //   // },
  //   {
  //     name: t("Shipping Charges"),
  //     icon: <Truck width={20} height={20} />,
  //     target: "shippingCharges",
  //     subMenu: [
  //       {
  //         name: t("Modify Shipping Charges"),
  //         url: "/dashboard/shipping",
  //       },
  //     ],
  //   },
  //   {
  //     name: t("Contacts"),
  //     icon: <Envelope width={20} height={20} />,
  //     target: "subscriber",
  //     subMenu: [
  //       {
  //         name: t("Contacts List"),
  //         url: "/dashboard/contacts",
  //       },
  //     ],
  //   },
  //   {
  //     name: t("Customers"),
  //     icon: <People width={20} height={20} />,
  //     target: "customers",
  //     subMenu: [
  //       {
  //         name: t("Customer List"),
  //         url: "/dashboard/users",
  //       },
  //     ],
  //   },
  //   {
  //     name: t("Manager"),
  //     icon: <People width={20} height={20} />,
  //     target: "no",
  //     subMenu: [
  //       {
  //         name: t("Staff List"),
  //         url: "/dashboard/staffs",
  //       },
  //       {
  //         name: t("Create New Staff"),
  //         url: "/dashboard/staffs/create",
  //       },
  //     ],
  //   },
  //   {
  //     name: t("Settings"),
  //     icon: <Gear width={20} height={20} />,
  //     target: "settings",
  //     subMenu: [
  //       {
  //         name: t("General Settings"),
  //         url: "/dashboard/settings",
  //       },
  //       {
  //         name: t("Layout Settings"),
  //         url: "/dashboard/settings/layout",
  //       },
  //       {
  //         name: t("Graphics Content"),
  //         url: "/dashboard/settings/graphics",
  //       },
  //       {
  //         name: t("Seo"),
  //         url: "/dashboard/settings/seo",
  //       },
  //       {
  //         name: t("Script"),
  //         url: "/dashboard/settings/script",
  //       },
  //       // {
  //       //   name: t("Payment Gateway"),
  //       //   url: "/dashboard/settings/gateway",
  //       // },
  //       // {
  //       //   name: t("Social Media Login"),
  //       //   url: "/dashboard/settings/login",
  //       // },
  //     ],
  //   },
  //   {
  //     name: t("Page Settings"),
  //     icon: <HouseGear width={20} height={20} />,
  //     target: "pageSettings",
  //     subMenu: [
  //       // {
  //       //   name: t("Home Page"),
  //       //   url: "/dashboard/page/home",
  //       // },
  //       // {
  //       //   name: t("about_us"),
  //       //   url: "/dashboard/page/about",
  //       // },
  //       {
  //         name: t("privacy_policy"),
  //         url: "/dashboard/page/privacy",
  //       },
  //       {
  //         name: t("terms_and_conditions"),
  //         url: "/dashboard/page/terms",
  //       },
  //       {
  //         name: t("return_policy"),
  //         url: "/dashboard/page/return",
  //       },
  //     ],
  //   },
  //   {
  //     name: t("CS Center"),
  //     icon: <ChatDots width={20} height={20} />,
  //     target: "csCenter",
  //     subMenu: [
  //       {
  //         name: "공지사항",
  //         url: "/dashboard/notice",
  //       },
  //       {
  //         name: "이벤트",
  //         url: "/dashboard/event",
  //       },
  //       {
  //         name: t("faq"),
  //         url: "/dashboard/page/faq",
  //       },
  //     ],
  //   },
  // ];

  const menuData = [
    {
      name: t("대시보드"),
      icon: <Iconify icon="solar:chart-square-bold" width={20} height={20} />,
      target: "dashboard",
      url: "/dashboard",
    },
    {
      name: t("상품"),
      icon: <Iconify icon="solar:box-bold" width={20} height={20} />,
      target: "product",
      subMenu: [
        { name: t("모든 일반상품"), url: "/dashboard/product" },
        { name: t("모든 특별상품"), url: "/dashboard/special-product" },
        { name: t("특별 그룹 목록"), url: "/dashboard/special-group" },
        {
          name: t("새 상품 추가"),
          url: "/dashboard/product/create",
          create: true,
        },
      ],
    },
    {
      name: t("주문"),
      icon: <Iconify icon="solar:bill-list-bold" width={20} height={20} />,
      target: "order",
      subMenu: [
        { name: t("모든 주문"), url: "/dashboard/orders" },
        { name: t("취소/교환/반품"), url: "/dashboard/orders/refund" },
        { name: t("B몰 정산"), url: "/dashboard/orders/bmall" },
        { name: t("매출통계"), url: "/dashboard/orders/statistics" },
        { name: t("리뷰"), url: "/dashboard/orders/reviews" },
      ],
    },
    {
      name: t("배송 요금"),
      icon: <Iconify icon="solar:delivery-bold" width={20} height={20} />,
      target: "shipping",
      subMenu: [{ name: t("배송 요금 설정"), url: "/dashboard/shipping" }],
    },
    {
      name: t("문의"),
      icon: <Iconify icon="solar:chat-square-bold" width={20} height={20} />,
      target: "inquiry",
      subMenu: [
        { name: t("상품 문의"), url: "/dashboard/inquiry/product" },
        { name: t("Q&A"), url: "/dashboard/inquiry/qna" },
        { name: t("1대1 문의"), url: "/dashboard/inquiry/one-to-one" },
      ],
    },
    {
      name: t("유지"),
      icon: <Iconify icon="solar:settings-bold" width={20} height={20} />,
      target: "maintenance",
      subMenu: [{ name: t("유지 설정"), url: "/dashboard/maintenance" }],
    },
    {
      name: t("관리자"),
      icon: <Iconify icon="solar:user-bold" width={20} height={20} />,
      target: "admin",
      subMenu: [
        { name: t("관리자 목록"), url: "/dashboard/admin/list" },
        {
          name: t("새 관리자 생성"),
          url: "/dashboard/admin/create",
          create: true,
        },
      ],
    },
    {
      name: t("설정"),
      icon: <Iconify icon="solar:settings-bold" width={20} height={20} />,
      target: "settings",
      subMenu: [
        { name: t("일반 설정"), url: "/dashboard/settings" },
        { name: t("레이아웃 설정"), url: "/dashboard/settings/layout" },
        { name: t("그래픽 콘텐츠"), url: "/dashboard/settings/graphics" },
        { name: t("SEO"), url: "/dashboard/settings/seo" },
        { name: t("스크립트"), url: "/dashboard/settings/script" },
      ],
    },
    {
      name: t("페이지 설정"),
      icon: <Iconify icon="solar:document-bold" width={20} height={20} />,
      target: "page-settings",
      subMenu: [
        { name: t("배너 설정"), url: "/dashboard/page/banner" },
        { name: t("추천 상품 설정"), url: "/dashboard/page/recommended" },
        { name: t("개인정보 처리방침"), url: "/dashboard/page/privacy" },
        { name: t("이용약관"), url: "/dashboard/page/terms" },
        { name: t("반품 및 교환 정책"), url: "/dashboard/page/return" },
        { name: t("거래 조건 정보"), url: "/dashboard/page/transaction" },
        { name: t("구매 주의 사항"), url: "/dashboard/page/purchase-warning" },
      ],
    },
    {
      name: t("CS center"),
      icon: (
        <Iconify icon="solar:headphones-square-bold" width={20} height={20} />
      ),
      target: "cs-center",
      subMenu: [
        { name: t("공지사항"), url: "/dashboard/notice" },
        { name: t("이벤트"), url: "/dashboard/event" },
        { name: t("FAQ"), url: "/dashboard/page/faq" },
      ],
    },
  ];

  const [expandedMenu, setExpandedMenu] = useState({});

  const toggleMenu = (index) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Check if current path matches the menu item
  const isActiveMenu = (item) => {
    if (item.url && pathname === item.url) return true;
    if (item.subMenu) {
      return item.subMenu.some((subItem) => pathname === subItem.url);
    }
    return false;
  };

  return (
    <div className={`${classes.menu} ${isOpen ? classes.show : classes.hide}`}>
      <div className={classes.sidebar_inner}>
        <div
          className="flex-shrink-0"
          style={{
            maxHeight: "80vh",
            overflowY: "hidden scroll",
          }}
        >
          <Box
            component="nav"
            sx={[
              {
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                margin: "0 16px",
              },
            ]}
          >
            <Box
              sx={{
                gap: 0.5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {menuData.map((item, index) => {
                const isActived = isActiveMenu(item);
                const hasSubMenu = item.subMenu && item.subMenu.length > 0;
                const isExpanded = expandedMenu[index];

                return (
                  <React.Fragment key={index}>
                    <ListItem disableGutters disablePadding>
                      {hasSubMenu ? (
                        <ListItemButton
                          disableGutters
                          onClick={() => toggleMenu(index)}
                          sx={{
                            pl: 2,
                            py: 1,
                            gap: 2,
                            pr: 1.5,
                            borderRadius: "10px",
                            fontWeight: "500",
                            color: "var(--text-secondary)",
                            minHeight: 44,
                            ...(isActived && {
                              fontWeight: "500",
                              color: "var(--primary)",
                              bgcolor: "rgba(0, 0, 0, 0.04)",
                              "&:hover": {
                                bgcolor: "rgba(0, 0, 0, 0.04)",
                              },
                            }),
                          }}
                        >
                          <Box component="span" sx={{ width: 24, height: 24 }}>
                            {item.icon}
                          </Box>

                          <Box component="span" sx={{ flexGrow: 1 }}>
                            {item.name}
                          </Box>

                          <Box
                            component="span"
                            sx={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s",
                            }}
                          >
                            <ChevronDown width={16} height={16} />
                          </Box>
                        </ListItemButton>
                      ) : (
                        <Link href={item.url || "#"} passHref legacyBehavior>
                          <ListItemButton
                            disableGutters
                            sx={{
                              pl: 2,
                              py: 1,
                              gap: 2,
                              pr: 1.5,
                              borderRadius: "10px",
                              fontWeight: "500",
                              color: "var(--text-secondary)",

                              minHeight: 44,
                              ...(isActived && {
                                fontWeight: "500",
                                color: "var(--primary)",
                                bgcolor: "rgba(0, 0, 0, 0.04)",
                                "&:hover": {
                                  bgcolor: "rgba(0, 0, 0, 0.04)",
                                },
                              }),
                            }}
                          >
                            <Box
                              component="span"
                              sx={{ width: 24, height: 24 }}
                            >
                              {item.icon}
                            </Box>

                            <Box component="span" sx={{ flexGrow: 1 }}>
                              {item.name}
                            </Box>
                          </ListItemButton>
                        </Link>
                      )}
                    </ListItem>

                    {hasSubMenu && (
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subMenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.url || "#"}
                              passHref
                              legacyBehavior
                            >
                              <ListItemButton
                                sx={{
                                  pl: 7,
                                  py: 1,
                                  color:
                                    pathname === subItem.url
                                      ? "var(--primary)"
                                      : "var(--text-secondary)",
                                  fontWeight:
                                    pathname === subItem.url ? "500" : "400",
                                  minHeight: 36,
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                    color: "var(--primary)",
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={subItem.name}
                                  sx={{ margin: 0 }}
                                />
                              </ListItemButton>
                            </Link>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardMenu);
