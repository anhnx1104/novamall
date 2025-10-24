import React from "react";
import { useSelector } from "react-redux";
import classes from "~/components/Checkout/checkout.module.css";
import { checkPercentage, decimalBalance } from "~/lib/clientFunctions";
import ImageLoader from "../Image";
import { useTranslation } from "react-i18next";

const Invoice = ({ data }) => {
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const { t } = useTranslation();

  const translateDeliveryType = (type) => {
    if (!type) return "N/A";

    const typeMap = {
      "Local Delivery": "지역 배송",
      "International Delivery": "국제 배송",
    };

    return typeMap[type] || type;
  };

  return (
    <div className={classes.confirmation}>
      <div className={classes.confirmation_heading}>
        {settings.settingsData.logo[0] && (
          <ImageLoader
            src={settings.settingsData.logo[0]?.url}
            width={166}
            height={60}
            alt={settings.settingsData.name}
            quality={100}
          />
        )}
        <h2>{t("we_have_received_your_order")}</h2>
        <h6>
          {t("order_no")}# {data.orderId}
        </h6>
        {/* <p>A copy of your receipt has been send to {data.billingInfo.email}</p> */}
        <br />
      </div>
      <div className={classes.confirmation_body}>
        <h5>{t("delivery_information")}</h5>
        <div className="row">
          <div className="col-md-6">
            <h6>{t("full_name")}</h6>
            <p>{data.shippingInfo?.fullName}</p>
            <p>
              {t("phone")}: {data.shippingInfo?.phone}
            </p>
            <br />
            <h6>{t("address")}</h6>
            <p>{`${data.shippingInfo?.city} ${data.shippingInfo?.state} ${data.shippingInfo?.house} ${data.shippingInfo?.zipCode}`}</p>
          </div>
          <div className="col-md-6">
            <h6>{t("delivery_type")}</h6>
            <p>{translateDeliveryType(data.deliveryInfo?.type)}</p>
            <br />
            <h6>{t("payment_method")}</h6>
            <p>{data.paymentMethod}</p>
          </div>
        </div>
        <h5>{t("order_summary")}</h5>
        <div className={classes.cart_item_list}>
          {data.products.map((item, index) => (
            <div className={classes.cart_item} key={index}>
              <div className={classes.cart_container}>
                <span className={classes.cart_disc}>
                  <b>{item.name}</b>
                  {item.color.name && (
                    <span>
                      {t("color")}: {item.color.name}
                    </span>
                  )}
                  {item.attribute.name && (
                    <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                  )}
                  <span>
                    {t("quantity")}: {item.qty}
                  </span>
                  <span>
                    {t("price")}: {currencySymbol}
                    {item.price}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className={classes.confirmation_pay}>
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

export default Invoice;
