import sessionChecker from "~/lib/sessionPermission";
import faqModel from "~/models/faq";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "faq")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
        // FAQ 리스트 조회 API
      try {
        const { faqId } = req.query;
        if (!faqId) {
          return res.status(400).json({ success: false, message: "FAQ ID is required" });
        }
        const data = await faqModel.findById(faqId);

        res.status(200).json({ success: true, data: data });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
