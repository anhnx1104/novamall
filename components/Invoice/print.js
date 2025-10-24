import React from "react";
import { useSelector } from "react-redux";
import {
  checkPercentage,
  dateFormat,
  decimalBalance,
} from "~/lib/clientFunctions";
import ImageLoader from "../Image";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

const InvoicePrint = ({ data }) => {
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  return (
    <div className="confirmation" id="su-inv">
      <div className="confirmation_heading">
        {settings.settingsData.logo[0] && (
          <ImageLoader
            src={settings.settingsData.logo[0]?.url}
            width={166}
            height={60}
            alt={settings.settingsData.name}
            quality={100}
          />
        )}
        <br />
      </div>
      <div className="confirmation_body">
        <div className="row mb-3">
          <div className="col-6">
            <h6>
              {t("order_no")} #{data.orderId}
            </h6>
          </div>
          <div className="col-6">
            <h6>
              {t("order_date")} :{" "}
              {dayjs(data.orderDate).format("YYYY년 MM월 DD일 A hh:mm")}
            </h6>
          </div>
        </div>
        <h5>{t("delivery_details")}</h5>
        <div className="row">
          <div className="col-6">
            <h6 style={{ fontWeight: "bold" }}>{t("delivery_for")}</h6>
            <p>
              {t("name")} : {data?.shippingInfo?.fullName || ""}
            </p>
            <p>
              {t("email")} : {data?.shippingInfo?.email || ""}
            </p>
            <p>
              {t("phone")} : {data?.shippingInfo?.phone || ""}
            </p>
            <p>
              {t("address")} :{" "}
              {`${data?.shippingInfo?.city || ""}, ${
                data?.shippingInfo?.state || ""
              }, ${data?.shippingInfo?.house || ""}, ${
                data?.shippingInfo?.zipCode || ""
              }`}
            </p>
          </div>
          <div className="col-6">
            <h6 style={{ fontWeight: "bold" }}>{t("delivery_type")}</h6>
            <p>{data.deliveryInfo?.description}</p>
            <br />
            <h6>{t("payment")}</h6>
            <p>
              {t("payment_method")} : {data.paymentMethod}
            </p>
            <p>
              {t("payment_status")} :{" "}
              {data.paymentStatus === "Paid"
                ? "지불완료"
                : data.paymentStatus === "Unpaid"
                ? "미지불"
                : data.paymentStatus}
            </p>
          </div>
        </div>
        <h5>{t("order_summary")}</h5>
        <div className="cart_item_list">
          <table className="table">
            <thead className="cart_item_header">
              <tr>
                <th>{t("products")}</th>
                <th className="text-end">{t("total")}</th>
              </tr>
            </thead>
            <tbody>
              {data.products?.map((item, index) => (
                <tr className="cart_item" key={index}>
                  <td>
                    <div className="cart_container">
                      <span className="cart_image">
                        <ImageLoader
                          src={item.image[0]?.url}
                          height={50}
                          width={50}
                          alt={item.name}
                        />
                      </span>
                      <span className="cart_disc">
                        <b>{item.name}</b>
                        {item.color.name && (
                          <span>Color: {item.color.name}</span>
                        )}
                        {item.attribute.name && (
                          <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                        )}
                        <span>Qty: {item.qty}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    {currencySymbol}
                    {decimalBalance(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="confirmation_pay">
          <div>
            <span>{t("inv_total_price")}</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.totalPrice)}
            </span>
          </div>
          <div>
            <span>{t("inv_discount")}</span>
            <span>
              {data.coupon?.discount ? "-" : ""}
              {currencySymbol}
              {decimalBalance(
                checkPercentage(data.totalPrice, data.coupon?.discount || 0)
              )}
            </span>
          </div>
          <div>
            <span>{t("inv_ship_cost")}</span>
            <span>
              {currencySymbol}
              {data.deliveryInfo.cost}
            </span>
          </div>
          <div>
            <span>{t("inv_supply_price")}</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.totalPrice / 1.1)}
            </span>
          </div>
          <div>
            <span>{t("inv_vat")}</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.vat)}
            </span>
          </div>

          <div>
            <span>{t("inv_payment_amount")}</span>
            <span>
              {currencySymbol}
              {decimalBalance(data.payAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
