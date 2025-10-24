import dbConnect from "../../../utils/dbConnect";
import sessionChecker from "~/lib/sessionPermission";
import groupModel from "../../../models/group";
import productModel from "../../../models/product";

export default async function apiHandler(req, res) {
  const { method } = req;

  // 인증 및 권한 확인
  if (!(await sessionChecker(req, "group"))) {
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });
  }

  await dbConnect();

  switch (method) {
    // 그룹 조회
    case "PUT": {
      try {
        const { id } = req.query;
        const { name, price, user_limit } = req.body;

        if (!id) {
          return res.status(400).json({ success: false, message: "Group id is required" });
        }

        const group = await groupModel.findById(id);
        if (!group) {
          return res.status(404).json({ success: false, message: "Group not found" });
        }

        if (name !== undefined) group.name = name;
        if (price !== undefined) group.price = price;
        if (user_limit !== undefined) group.user_limit = user_limit;

        await group.save();

        res.status(200).json({ success: true, data: group });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update group" });
      }
      break;
    }

    default:
      res.status(400).json({ success: false, message: "Invalid request method" });
      break;
  }
}