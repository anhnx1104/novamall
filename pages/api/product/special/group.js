import sessionChecker from "~/lib/sessionPermission";
import dbConnect from "../../../../utils/dbConnect";
import ProductModel from "../../../../models/product";
import { convertToSlug } from "~/middleware/functions";
import customIdNew from "custom-id-new";
import { Types } from "mongoose";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ success: false, message: "Group ID is required" });
        }

        // 그룹 아이디로 상품 리스트 조회
        const specialProductList = await ProductModel.find({ group: id, isSpecial: true }).sort("-date").exec();
        res.status(200).json({ success: true, data: specialProductList });
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
