import dbConnect from "../../../utils/dbConnect";
import groupModel from "../../../models/group";
import groupRankingModel from "../../../models/groupRanking";
import productModel from "../../../models/product";
import mongoose from "mongoose";
import sessionChecker from "~/lib/sessionPermission";

export default async function apiHandler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // 인증 및 권한 확인
  if (!(await sessionChecker(req, "group"))) {
      return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });
  }
  
  await dbConnect();

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Group ID is required" });
    }

    const deletedGroup = await groupModel.findByIdAndDelete(id);

    if (!deletedGroup) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    
    await productModel.deleteMany({ group: new mongoose.Types.ObjectId(id) });
    await groupRankingModel.deleteMany({ group: new mongoose.Types.ObjectId(id) });

    res.status(200).json({ success: true, message: "Group deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete group" });
  }
}