import s3DeleteFiles from "~/lib/s3Delete";
import sessionChecker from "~/lib/sessionPermission";
import groupRankingModel from "../../../../models/groupRanking";
import ProductModel from "../../../../models/product";
import dbConnect from "../../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const { id } = req.query;
        const product = await ProductModel.findById(id);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
        const fileList = [
          ...product.image,
          ...product.gallery,
          ...product.seo.image,
        ];
        const fileNameList = [];
        await fileList.map((item) => fileNameList.push({ Key: item.name }));
        await s3DeleteFiles(fileNameList);
        
        // 관련 groupRanking 삭제
        await groupRankingModel.deleteMany({ product: product._id });

        await product.remove();
        res.json({ success: true });
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
