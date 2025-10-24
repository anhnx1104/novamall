import sessionChecker from "~/lib/sessionPermission";
import dbConnect from "../../../../utils/dbConnect";
import ProductModel from "../../../../models/product";
import groupRankingModel from "../../../../models/groupRanking";
import { convertToSlug } from "~/middleware/functions";
import customIdNew from "custom-id-new";
import { Types } from "mongoose";
import s3DeleteFiles from "~/lib/s3Delete";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        const { id } = req.body; // 복사할 상품의 ID

        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "Product ID is required" });
        }

        // 원본 상품 조회
        const originalDocument = await ProductModel.findOne({
          _id: id,
          isSpecial: true,
        });
        if (!originalDocument) {
          return res.status(404).json({
            success: false,
            message: "Original special product not found.",
          });
        }

        // 상품 복사
        const clonedDocument = new ProductModel(originalDocument.toObject());
        clonedDocument._id = new Types.ObjectId(); // 새로운 ObjectId 생성
        clonedDocument.name = `Clone ${clonedDocument.name}`; // 이름에 "Clone" 추가
        clonedDocument.slug = convertToSlug(
          `${clonedDocument.name} clone`,
          true
        ); // 새로운 슬러그 생성
        clonedDocument.date = Date.now(); // 생성 날짜 갱신
        clonedDocument.productId =
          "P" + customIdNew({ randomLength: 4, upperCase: true }); // 새로운 상품 ID 생성
        await clonedDocument.save(); // 복제된 상품 저장

        res.status(200).json({
          success: true,
          message: "Special product successfully cloned",
          product: clonedDocument,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
      }
      break;

    case "GET":
      try {
        const { id } = req.query;

        if (id) {
          // 단일 상품 조회
          const product = await ProductModel.findOne({
            _id: id,
            isSpecial: true,
          });
          if (!product) {
            return res.status(404).json({
              success: false,
              message: "Product not found or not special",
            });
          }
          return res.status(200).json({ success: true, product });
        } else {
          // 전체 스페셜 상품 조회
          const products = await ProductModel.find({ isSpecial: true })
            .sort("-date")
            .exec();
          return res.status(200).json({ success: true, products });
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;

        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "Product ID is required" });
        }

        const product = await ProductModel.findById(id);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
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

        return res
          .status(200)
          .json({ success: true, message: "Product deleted successfully" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
