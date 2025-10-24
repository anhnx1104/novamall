import sessionChecker from "~/lib/sessionPermission";
import userModel from "~/models/user";
import pointHistoryModel from "~/models/pointHistory";
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
        // 유저의 포인트를 조회하는 api
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await userModel
          .findById(id)
          .select(["-hash", "-salt", "-isAdmin"]);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 유저의 총 적립된 출금 포인트, 총 적립된 쇼핑몰 포인트, 출금 잔여 포인트, 쇼핑몰 잔여 포인트를 조회
        res.status(200).json({ success: true, data: user });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
