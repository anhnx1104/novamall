import Notice from "~/models/notice";
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
        const notice = await Notice.findById(id);
        if (!notice) {
          return res.status(404).json({ success: false, message: "공지사항을 찾을 수 없습니다." });
        }
        
        // 조회수 증가
        notice.viewCount += 1;
        await notice.save();
        
        res.status(200).json({ success: true, notice });
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

        const { title, content, isImportant } = req.body;
        const updatedNotice = await Notice.findByIdAndUpdate(
          id,
          { title, content, isImportant },
          { new: true, runValidators: true }
        );

        if (!updatedNotice) {
          return res.status(404).json({ success: false, message: "공지사항을 찾을 수 없습니다." });
        }

        res.status(200).json({ success: true, notice: updatedNotice });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
