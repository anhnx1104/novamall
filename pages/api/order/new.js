import { eachSeries } from "async";
import customId from "custom-id-new";
import { getToken } from "next-auth/jwt";
import notificationModel from "~/models/notification";
import orderModel from "~/models/order";
import productModel from "~/models/product";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";
import { parseForm } from "~/utils/parseForm";
import {
  distributeRebatePoints,
  registerGroupRanking,
} from "~/lib/rebateFunctions";
import { levelUpUser } from "~/lib/levelUpFunctions";
import { checkCanPurchase } from "~/lib/checkCanPurchase";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });

  await dbConnect();

  const decrementQty = async (products) => {
    eachSeries(
      products,
      async (item, done) => {
        if (item.color.name || item.attribute.name) {
          const product = await productModel.findById(item._id);
          if (product) {
            const colorName = item.color.name;
            const attrName = item.attribute.name;
            const variant = product.variants.find(
              (item) => item.color === colorName && item.attr === attrName
            );
            if (variant.qty != -1) {
              variant.qty = variant.qty - item.qty;
              product.markModified("variants");
              await product.save(done);
            }
          }
        } else {
          const product = await productModel.findById(item._id);
          if (product && product.quantity != -1) {
            product.quantity = product.quantity - item.qty;
            await product.save(done);
          }
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  };

  function checkPercentage(number, percentage) {
    return (number * percentage) / 100;
  }

  const getTotalPrice = async (products) => {
    const price = await products.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    );
    return Math.round(price * 10) / 10;
  };

  const getTotalVat = async (products) => {
    const vat = await products.reduce(
      (accumulator, item) =>
        accumulator + checkPercentage(item.qty * item.price, item.vat),
      0
    );
    return +vat;
  };

  const getTotalTax = async (products) => {
    const tax = await products.reduce(
      (accumulator, item) =>
        accumulator + checkPercentage(item.qty * item.price, item.tax),
      0
    );
    return +tax;
  };

  const discountPrice = (discount, total) => {
    const price = (discount / 100) * total;
    return Math.round(price * 10) / 10;
  };

  switch (method) {
    case "POST":
      try {
        const data = await parseForm(req);
        const { checkoutData } = data.field;
        const jsonData = JSON.parse(checkoutData);
        const {
          coupon,
          products,
          billingInfo,
          shippingInfo,
          deliveryInfo,
          paymentData,
        } = jsonData;
        if (!(await checkCanPurchase(products, session.user.id))) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "일반 상품은 특별 상품을 한 번이라도 구매하신 고객님께만 제공되는 전용 상품입니다.",
            });
        }
        await decrementQty(products);
        const price = await getTotalPrice(products);
        const vat = await getTotalVat(products);
        const tax = await getTotalTax(products);
        const deliveryCost = deliveryInfo.cost || 0;

        // 공급가액
        const supplyPrice = Math.round((price / 1.1) * 10) / 10;
        // 부가세
        const vatPrice = Math.round(supplyPrice * 0.1 * 10) / 10;

        const discount = discountPrice(coupon.discount, price);
        // 총결제금액
        const payAmount =
          Math.round((supplyPrice + vatPrice + deliveryCost - discount) * 10) /
          10;
        // const payAmount =
        //   Math.round(
        //     (price + vat + tax + (deliveryInfo.cost || 0) - discount) * 10
        //   ) / 10;
        const orderId = `R${customId({ randomLength: 4, upperCase: true })}`;
        const paymentStatus =
          paymentData.method === "Cash On Delivery" ? "Paid" : "Paid";
        const userArray =
          session && session.user && session.user.id ? [session.user.id] : [];
        const orderData = {
          orderId,
          products,
          status:
            paymentData.method === "Cash On Delivery"
              ? "In Progress"
              : "Pending",
          billingInfo,
          shippingInfo,
          deliveryInfo,
          paymentMethod: paymentData.method,
          paymentStatus,
          paymentId: paymentData.id,
          totalPrice: price,
          payAmount,
          coupon,
          vat: vatPrice,
          tax,
          user: userArray,
        };
        const createdOrder = await orderModel.create(orderData);

        await distributeRebatePoints(products);

        if (session && session.user.id) {
          await levelUpUser(products, createdOrder, session.user.id);
          await registerGroupRanking(products, createdOrder, session.user.id);

          await userModel.findByIdAndUpdate(session.user.id, {
            $push: { orders: createdOrder._id },
          });
        }
        const message = `<p>새 주문이 접수되었습니다. 주문번호: <a href="/dashboard/orders/${createdOrder._id}" target="_blank">${createdOrder.orderId}</a></p>`;
        await notificationModel.create({ message });
        res.status(200).json({ success: true, createdOrder });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
