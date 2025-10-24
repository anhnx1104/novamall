import Event from "~/models/event";
import dbConnect from "~/utils/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const events = await Event.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, events });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user.s.status) {
          return res.status(401).json({ success: false, message: "인증되지 않은 사용자입니다." });
        }

        const { title, content, startDate, endDate, isActive, thumbnail } = req.body;
        const event = await Event.create({
          title,
          content,
          startDate,
          endDate,
          isActive: isActive || true,
          thumbnail: thumbnail || "",
        });
        res.status(201).json({ success: true, event });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user.s.status) {
          return res.status(401).json({ success: false, message: "인증되지 않은 사용자입니다." });
        }

        const { id } = req.query;
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
          return res.status(404).json({ success: false, message: "이벤트를 찾을 수 없습니다." });
        }
        res.status(200).json({ success: true, message: "이벤트가 삭제되었습니다." });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
