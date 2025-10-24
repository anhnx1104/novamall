import sessionChecker from "~/lib/sessionPermission";
import orderModel from "../../../models/order";
import groupRankingModel from "../../../models/groupRanking";
import dbConnect from "../../../utils/dbConnect";

/**
 * @swagger
 * /api/order:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders with pagination (페이지네이션으로 모든 주문 조회)
 *     description: Retrieve orders with pagination and optional search (Admin only) (페이지네이션 및 선택적 검색으로 주문 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (페이지네이션을 위한 페이지 번호)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page (페이지당 항목 수)
 *       - in: query
 *         name: queryText
 *         schema:
 *           type: string
 *         description: Search text for order ID (주문 ID 검색 텍스트)
 *     responses:
 *       200:
 *         description: Orders retrieved successfully (주문 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 total:
 *                   type: number
 *                   description: Total number of orders (총 주문 수)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Delete an order (주문 삭제)
 *     description: Delete an order by ID (Admin only) (ID로 주문 삭제 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to delete (삭제할 주문 ID)
 *     responses:
 *       200:
 *         description: Order deleted successfully (주문 삭제 성공)
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 */
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
        const { pageNumber = 1, pageSize = 10, queryText } = req.query;
        let order = [];
        let total = 0;
        if (queryText && queryText.length > 0) {
          // Use a regular expression to perform a case-insensitive search
          const regex = new RegExp(queryText, "i");
          order = await orderModel.find({ orderId: regex });
          total = order.length;
        } else {
          total = await orderModel.countDocuments();
          const skip = (pageNumber - 1) * pageSize;
          order = await orderModel
            .find()
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(Number(pageSize));
        }
        res.status(200).json({ success: true, order, total });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const id = req.query.id;
        await groupRankingModel.deleteMany({ order: id });
        await orderModel.findByIdAndDelete(id);
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
