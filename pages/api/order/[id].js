import sessionChecker from "~/lib/sessionPermission";
import notificationModel from "~/models/notification";
import orderModel from "~/models/order";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "order")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const id = req.query.id;
        const order = await orderModel.findById(id);
        if (order.new) {
          order.new = false;
          await order.save();
        }
        res.status(200).json({ success: true, order });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const id = req.query.id;
        const _or = await orderModel.findByIdAndUpdate(id, {
          status: req.query.order_status,
          paymentStatus: req.query.payment_status,
        });
        let _msg = "";
        req.query.action === "payment"
          ? (_msg = `<p>주문 (<a href="/dashboard/orders/${_or._id}" target="_blank">${_or.orderId}</a>)의 결제 상태가 변경되었습니다. (${req.query.payment_status})</p>`)
          : (_msg = `<p>주문 (<a href="/dashboard/orders/${_or._id}" target="_blank">${_or.orderId}</a>)의 상태가 변경되었습니다. (${req.query.order_status})</p>`);
        await notificationModel.create({ message: _msg });
        res.status(200).json({ success: true });
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
