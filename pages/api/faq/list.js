import sessionChecker from "~/lib/sessionPermission";
import faqModel from "~/models/faq";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
        // FAQ 리스트 조회 API (유저)
      try {
        const data = await faqModel.find({}).select({ question: 1, answer: 1 });
        
        res.status(200).json({ success: true, data: data });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
