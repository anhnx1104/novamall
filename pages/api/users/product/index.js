import sessionChecker from "~/lib/sessionPermission";
import orderModel from "~/models/order";
import userModel from "~/models/user";
import productModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  if (!(await sessionChecker(req, "customers")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // 유저의 일반 주문 내역을 조회하는 api
        const { userId } = req.query;

        if (!userId) {
          return res
            .status(400)
            .json({ success: false, message: "User ID is required" });
        }

        const user = await userModel
          .findById(userId)
          .select(["-hash", "-salt", "-isAdmin"]);

        // orders 조회
        const orders = await orderModel
          .find({ _id: { $in: user.orders } })
          .sort({ orderDate: -1 });

        // 주문 + 일반 상품만 뽑아서 새로운 배열 생성
        const normalOrderItems = [];
        for (const order of orders) {
          for (const item of order.products) {
            // 상품 정보 조회
            const productDoc = await productModel
              .findById(item._id)
              .select("name price isSpecial")
              .lean();

            if (!productDoc) {
              continue;
            }

            if (productDoc.isSpecial === false) {
              normalOrderItems.push({
                ...order.toObject(),
                product: productDoc,
              });
            }
          }
        }

        res.status(200).json({ success: true, data: normalOrderItems });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
