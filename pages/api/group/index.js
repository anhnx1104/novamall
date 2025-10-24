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
    case "GET":
      try {
        const { id } = req.query;

        if (id) {
          // 특정 그룹 조회
          const group = await groupModel.findById(id);
          if (!group) {
            return res
              .status(404)
              .json({ success: false, message: "Group not found" });
          }

          const productCount = await productModel.countDocuments({
            group: id,
          });
          return res.status(200).json({ success: true, data: {
            ...group._doc,
            productCount,
          } 
        });
        }

        // 모든 그룹 조회
        const groups = await groupModel.find();

        const groupsWithProductCounts = await Promise.all(
          groups.map(async (group) => {
            const productCount = await productModel.countDocuments({
              group: group._id,
            });
            return {
              ...group._doc,
              productCount,
            };
          })
        );

        res.status(200).json({ success: true, data: groupsWithProductCounts });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch groups" });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid request method" });
      break;
  }
}