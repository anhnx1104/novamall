import sessionChecker from "~/lib/sessionPermission";
import shippingModel from "~/models/shippingCharge";
import dbConnect from "~/utils/dbConnect";

/**
 * @swagger
 * /api/shipping:
 *   get:
 *     tags:
 *       - Shipping
 *     summary: Get shipping charges (배송비 조회)
 *     description: Retrieve all shipping charge information (모든 배송비 정보 조회)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Shipping charges retrieved successfully (배송비 조회 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 거부)
 *   post:
 *     tags:
 *       - Shipping
 *     summary: Add or update shipping charges (배송비 추가 또는 업데이트)
 *     description: Add area-specific or international shipping charges (지역별 또는 국제 배송비 추가)
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *           enum: [area, international]
 *         description: Shipping scope - area or international (배송 범위 - 지역 또는 국제)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Shipping charges updated successfully (배송비 업데이트 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 거부)
 *   put:
 *     tags:
 *       - Shipping
 *     summary: Update area shipping charge (지역 배송비 업데이트)
 *     description: Update specific area shipping information (특정 지역 배송 정보 업데이트)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Shipping charge updated successfully (배송비 업데이트 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 거부)
 *   delete:
 *     tags:
 *       - Shipping
 *     summary: Delete area shipping charge (지역 배송비 삭제)
 *     description: Remove a specific area from shipping charges (배송비에서 특정 지역 제거)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shipping charge deleted successfully (배송비 삭제 성공)
 *       400:
 *         description: Bad request (잘못된 요청)
 *       403:
 *         description: Access forbidden (접근 거부)
 */
export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  if (!(await sessionChecker(req, "shippingCharges")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  switch (method) {
    case "GET":
      try {
        const shipping = await shippingModel.findOne({});
        res.status(200).json({ success: true, shippingCharge: shipping });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { query, body } = req;
        let shippingData = await shippingModel.findOne({});
        if (shippingData === null) {
          shippingData = new shippingModel({ area: [] });
        }
        //Check Data Scope
        switch (query.scope) {
          case "area":
            const areaData = {
              name: body.areaName,
              price: body.areaCost,
            };
            shippingData.area.push(areaData);
            await shippingData.save();
            break;

          case "international":
            shippingData.internationalCost = body.amount;
            await shippingData.save();
            break;

          default:
            return res.status(400).json({ success: false });
            break;
        }

        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        await shippingModel.updateOne(
          {},
          { $pull: { area: { _id: req.body.id } } },
          { safe: true },
        );
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const bodyData = req.body;
        await shippingModel.updateOne(
          { "area._id": bodyData.id },
          {
            $set: {
              "area.$.name": bodyData.name,
              "area.$.price": bodyData.cost,
            },
          },
        );
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
