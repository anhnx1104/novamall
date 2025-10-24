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
        const { page = 1, pageSize = 10 } = req.query; 

        const pageNumber = parseInt(page, 10);
        const pageSizeNumber = parseInt(pageSize, 10);

        const totalFaqs = await faqModel.countDocuments();
        const faqs = await faqModel
          .find({})
          .skip((pageNumber - 1) * pageSizeNumber)
          .limit(pageSizeNumber);

        res.status(200).json({
          success: true,
          data: faqs,
          total: totalFaqs,
          page: pageNumber,
          pageSize: pageSizeNumber,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;
    
    case "POST":
        // FAQ 생성 API
        try {
            const data = req.body;
            const newData = await faqModel.create(data);

            res.status(201).json({ success: true, data: newData });
        } catch(err) {
          console.log(err);
          res.status(500).json({ success: false });
        }
        break;

    case "PUT":
        // FAQ 수정 API
        try {
            const { _id, question, answer } = req.body;

            const updatedData = await faqModel.findByIdAndUpdate(
                _id,
                {question, answer},
                { new: true, runValidators: true }
            );
            if (!updatedData) {
                return res.status(404).json({ success: false, message: "FAQ not found" });
            }
            res.status(200).json({ success: true, data: updatedData });
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false });
        }
        break;
    
    case "DELETE":
        // FAQ 삭제 API
        try {
            const { faqId } = req.query;
            const deletedData = await faqModel.findByIdAndDelete(faqId);
            if (!deletedData) {
                return res.status(404).json({ success: false, message: "FAQ not found" });
            }
            res.status(200).json({ success: true, data: deletedData });
        } catch (err) {
            res.status(500).json({ success: false });
        }
        break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
