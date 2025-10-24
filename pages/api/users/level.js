import sessionChecker from "~/lib/sessionPermission";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  if (!(await sessionChecker(req, "customers")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "PUT":
        // 유저 레벨 수정
      try {
        const body = req.body;
        const userId = req.query.id;

        const updatedUser = await userModel.findByIdAndUpdate(userId, body, { new: true });

        if (!updatedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.status(200).json({ success: true, user: updatedUser });
      } catch (err) {
        res.status(500).json({ success: false });
      } 
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
