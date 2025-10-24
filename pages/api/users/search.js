import { getToken } from "next-auth/jwt";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });
    if (!session)
      return res
        .status(403)
        .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { input } = req.query;

        if (!input) {
          return res
            .status(400)
            .json({ success: false, message: "Email query parameter is required" });
        }

        const users = await userModel.find({
          email: { $regex: input, $options: "i" },
          isAdmin: false,
        }).select("name email");

        res.status(200).json({ success: true, data: users });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
