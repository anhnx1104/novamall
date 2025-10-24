import Notice from "~/models/notice";
import dbConnect from "~/utils/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const notices = await Notice.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notices });
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

        const { title, content, isImportant } = req.body;
        const notice = await Notice.create({
          title,
          content,
          isImportant: isImportant || false,
        });
        res.status(201).json({ success: true, notice });
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
        const deletedNotice = await Notice.findByIdAndDelete(id);
        if (!deletedNotice) {
          return res.status(404).json({ success: false, message: "공지사항을 찾을 수 없습니다." });
        }
        res.status(200).json({ success: true, message: "공지사항이 삭제되었습니다." });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
