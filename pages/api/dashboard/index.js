import sessionChecker from "~/lib/sessionPermission";
import attributeModel from "~/models/attributes";
import categoryModel from "~/models/category";
import colorModel from "~/models/colors";
import couponModel from "~/models/coupon";
import orderModel from "~/models/order";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard statistics (대시보드 통계 조회)
 *     description: Retrieve comprehensive dashboard data including orders, sales, and counts (주문, 매출 및 통계를 포함한 종합 대시보드 데이터 조회)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully (대시보드 데이터 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   type: array
 *                   description: Monthly order counts (월별 주문 수)
 *                 salesByMonth:
 *                   type: array
 *                   description: Monthly sales data (월별 매출 데이터)
 *                 totalOrder:
 *                   type: number
 *                   description: Total number of orders (총 주문 수)
 *                 totalUser:
 *                   type: number
 *                   description: Total number of users (총 사용자 수)
 *                 totalCategory:
 *                   type: number
 *                   description: Total number of categories (총 카테고리 수)
 *                 totalColor:
 *                   type: number
 *                   description: Total number of colors (총 색상 수)
 *                 totalCoupon:
 *                   type: number
 *                   description: Total number of coupons (총 쿠폰 수)
 *                 totalAttribute:
 *                   type: number
 *                   description: Total number of attributes (총 속성 수)
 *                 orderCountByStatus:
 *                   type: object
 *                   description: Order counts by status (상태별 주문 수)
 *       403:
 *         description: Access forbidden (접근 거부)
 *       500:
 *         description: Server error (서버 오류)
 */
export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "general")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const year = new Date().getFullYear();
        const date = new Date(`${year}-01-01`);
        const order = await orderModel.aggregate([
          {
            $match: {
              $and: [
                {
                  orderDate: {
                    $gte: date,
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$orderDate" },
                month: { $month: "$orderDate" },
              },
              results: { $count: {} },
            },
          },
        ]);

        const salesByMonth = await orderModel.aggregate([
          {
            $match: {
              orderDate: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`),
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$orderDate" },
                month: { $month: "$orderDate" },
              },
              total: { $sum: "$payAmount" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              monthlySales: {
                $push: {
                  month: "$_id.month",
                  total: "$total",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              year: "$_id",
              monthlySales: 1,
            },
          },
        ]);

        const orderCountByStatus = await orderModel.aggregate([
          {
            $match: {
              orderDate: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`),
              },
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]);

        const countByStatus = {
          year: year,
          orderCounts: {
            Pending: 0,
            "In Progress": 0,
            Packaged: 0,
            Shipped: 0,
            Delivered: 0,
            Canceled: 0,
          },
        };

        // Populate the result object with the counts
        orderCountByStatus.forEach((statusCount) => {
          const status = statusCount._id;
          const count = statusCount.count;
          countByStatus.orderCounts[status] = count;
        });

        const totalOrder = await orderModel.estimatedDocumentCount();
        const totalUser = await userModel.estimatedDocumentCount();
        const totalCategory = await categoryModel.estimatedDocumentCount();
        const totalColor = await colorModel.estimatedDocumentCount();
        const totalCoupon = await couponModel.estimatedDocumentCount();
        const totalAttribute = await attributeModel.estimatedDocumentCount();
        res.status(200).json({
          success: true,
          order,
          salesByMonth,
          totalOrder,
          totalUser,
          totalCategory,
          totalColor,
          totalCoupon,
          totalAttribute,
          orderCountByStatus: countByStatus,
        });
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
