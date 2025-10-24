import sessionChecker from "~/lib/sessionPermission";
import attrModel from "../../../models/attributes";
import brandModel from "../../../models/brand";
import colorModel from "../../../models/colors";
import groupModel from "../../../models/group";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";
import categoryModel from "../../../models/category";
import { parseFormMultiple } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { slug } = req.query;
        const product = await ProductModel.findOne({ slug: slug });
        const category = await categoryModel.find({});
        const attribute = await attrModel.find({});
        const color = await colorModel.find({});

        if (!product) {
          return res.status(400).json({ success: false, message: "Product not found" });
        }

        res
          .status(200)
          .json({ success: true, product, category, attribute, color });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const data = await parseFormMultiple(req);
        const {
          pid, // 수정할 상품 ID
          name,
          unit,
          unit_val,
          sale_price,
          description,
          short_description,
          type,
          category,
          brand,
          qty,
          trending,
          new_product,
          best_selling,
          sku,
          color,
          main_price,
          attribute,
          selectedAttribute,
          variant,
          displayImage,
          galleryImages,
          seo,
          vat,
          tax,
          // 새롭게 추가
          isSpecial,
          group,
          withdrawablePointRate,
          shoppingPointRate,
          rebateRate,
          pointLimitRate,
          option,
          noticeInfo,
        } = data.field;

        const image = JSON.parse(displayImage);
        const gallery = JSON.parse(galleryImages);
        const colors = JSON.parse(color);
        const attributes = JSON.parse(attribute);
        const variants = JSON.parse(variant);
        const seoData = JSON.parse(seo);
        const noticeInfos = JSON.parse(noticeInfo);
        const discount = (main_price - (sale_price / 100) * main_price).toFixed(
          1
        );

        // 카테고리 조회
        const categoryData = await categoryModel.findById(category);
        if (!categoryData) {
          return res.status(400).json({ success: false, message: "Category not found" });
        }

        // 그룹 조회 (스페셜 상품일 경우)
        let groupData = null;
        if (isSpecial === "true") {
          groupData = await groupModel.findById(group);
          if (!groupData) {
            return res.status(400).json({ success: false, message: "Group not found" });
          }
        }

        let productData = {
          name: name.trim(),
          unit: unit.trim(),
          unitValue: unit_val.trim(),
          price: main_price,
          discount,
          shortDescription: short_description.trim(),
          description,
          type,
          image,
          gallery,
          categories : categoryData.slug,
          brand: brand.trim(),
          trending: trending ? true : false,
          new: new_product ? true : false,
          bestSelling: best_selling ? true : false,
          seo: seoData,
          tax,
          vat,
          option: JSON.parse(option),
          noticeInfo: noticeInfos,
        };

        // 상품이 스페셜 상품인지 확인
        if (isSpecial === "true") {
          productData.isSpecial = true;
          productData.group = groupData._id;
          productData.withdrawablePointRate = withdrawablePointRate;
          productData.shoppingPointRate = shoppingPointRate;
          productData.rebateRate = rebateRate;
          productData.pointLimitRate = pointLimitRate;
          productData.pointLimit = Math.floor((groupData.price * pointLimitRate) / 100);
        } else {
          // 일반 상품일 경우 스페셜 관련 필드 초기화
          productData.isSpecial = false;
          productData.group = null;
          productData.withdrawablePointRate = null;
          productData.shoppingPointRate = null;
          productData.rebateRate = null;
          productData.pointLimit = null;
          productData.pointLimitRate = null;
        }

        if (type === "simple") {
          productData.quantity = qty;
          productData.sku = sku;
        } else {
          productData.colors = colors;
          productData.attributes = attributes;
          productData.variants = variants;
          productData.attributeIndex = selectedAttribute;
        }

        await ProductModel.findByIdAndUpdate(pid, productData);

        res.status(200).json({ success: true });
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
