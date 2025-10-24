import dbConnect from "../../../utils/dbConnect";
import groupModel from "../../../models/group";
import sessionChecker from "~/lib/sessionPermission";

export default async function apiHandler(req, res) {
  if (req.method !== "POST") {
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
    const { name, price, user_limit } = req.body;

    if (!name || !price || !user_limit) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newGroup = await groupModel.create({
      name,
      price,
      user_limit,
    });

    res.status(200).json({ success: true, data: newGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create group" });
  }
}