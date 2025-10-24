import { getToken } from "next-auth/jwt";
const mongoose = require("mongoose");
import pointHistoryModel from "../../../../models/pointHistory";
import dbConnect from "../../../../utils/dbConnect";

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
        const pointHistoryList = await pointHistoryModel
          .find({ user: session.user.id })
          .sort({ createAt: -1 })
          .select("createAt point pointType pointUsage status");

        res.status(200).json({ success: true, data: pointHistoryList });
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
