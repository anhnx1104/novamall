import Event from "~/models/event";
import dbConnect from "~/utils/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const event = await Event.findById(id);
        if (!event) {
          return res.status(404).json({ success: false, message: "이벤트를 찾을 수 없습니다." });
        }
        
        // 조회수 증가
        event.viewCount += 1;
        await event.save();
        
        res.status(200).json({ success: true, event });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user.s.status) {
          return res.status(401).json({ success: false, message: "인증되지 않은 사용자입니다." });
        }

        const { title, content, startDate, endDate, isActive, thumbnail } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { title, content, startDate, endDate, isActive, thumbnail },
          { new: true, runValidators: true }
        );

        if (!updatedEvent) {
          return res.status(404).json({ success: false, message: "이벤트를 찾을 수 없습니다." });
        }

        res.status(200).json({ success: true, event: updatedEvent });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
