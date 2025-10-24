import customId from "custom-id-new";
import sessionChecker from "~/lib/sessionPermission";
import { convertToSlug } from "../../../middleware/functions";
import attrModel from "../../../models/attributes";
import brandModel from "../../../models/brand";
import categoryModel from "../../../models/category";
import colorModel from "../../../models/colors";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";
import groupModel from "../../../models/group";
import { parseFormMultiple } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/product/create:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product creation metadata (상품 생성 메타데이터 조회)
 *     description: Retrieve categories, attributes, colors, and brands for product creation form (Admin only) (상품 생성 폼을 위한 카테고리, 속성, 색상, 브랜드 조회 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Metadata retrieved successfully (메타데이터 조회 성공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 category:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 attribute:
 *                   type: array
 *                   items:
 *                     type: object
 *                 color:
 *                   type: array
 *                   items:
 *                     type: object
 *                 brand:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Access forbidden (접근 금지)
 *       500:
 *         description: Server error (서버 오류)
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product (새 상품 생성)
 *     description: Create a new product with details (Admin only) (상세 정보와 함께 새 상품 생성 - 관리자 전용)
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - main_price
 *               - category
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               unit:
 *                 type: string
 *               unit_val:
 *                 type: string
 *               main_price:
 *                 type: number
 *               sale_price:
 *                 type: number
 *               description:
 *                 type: string
 *               short_description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [simple, variable]
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               qty:
 *                 type: number
 *               trending:
 *                 type: boolean
 *               new_product:
 *                 type: boolean
 *               best_selling:
 *                 type: boolean
 *               sku:
 *                 type: string
 *               color:
 *                 type: string
 *                 description: JSON string of color array (색상 배열 JSON 문자열)
 *               attribute:
 *                 type: string
 *                 description: JSON string of attributes (속성 JSON 문자열)
 *               variant:
 *                 type: string
 *                 description: JSON string of variants (변형 JSON 문자열)
 *               displayImage:
 *                 type: string
 *                 description: JSON string of image data (이미지 데이터 JSON 문자열)
 *               galleryImages:
 *                 type: string
 *                 description: JSON string of gallery images (갤러리 이미지 JSON 문자열)
 *               isSpecial:
 *                 type: string
 *               group:
 *                 type: string
 *               withdrawablePointRate:
 *                 type: number
 *               shoppingPointRate:
 *                 type: number
 *               rebateRate:
 *                 type: number
 *               pointLimitRate:
 *                 type: number
 *               option:
 *                 type: string
 *                 description: JSON string of options (옵션 JSON 문자열)
 *               noticeInfo:
 *                 type: string
 *                 description: JSON string of notice information (공지 정보 JSON 문자열)
 *     responses:
 *       200:
 *         description: Product created successfully (상품 생성 성공)
 *       400:
 *         description: Bad request or validation error (잘못된 요청 또는 유효성 검사 오류)
 *       403:
 *         description: Access forbidden (접근 금지)
 */
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
        const category = await categoryModel.find({});
        const attribute = await attrModel.find({});
        const color = await colorModel.find({});
        const brand = await brandModel.find({});
        res
          .status(200)
          .json({ success: true, category, attribute, color, brand });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;
    case "POST":
      try {
        const data = await parseFormMultiple(req);
        const {
          name,
          unit,
          unit_val,
          main_price,
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
        const random = "P" + customId({ randomLength: 4, upperCase: true });
        const image = JSON.parse(displayImage);
        const gallery = JSON.parse(galleryImages);
        const colors = JSON.parse(color);
        const attributes = JSON.parse(attribute);
        const variants = JSON.parse(variant);
        const seoData = JSON.parse(seo);
        const options = JSON.parse(option);
        const noticeInfos = JSON.parse(noticeInfo);

        const discount = (main_price - (sale_price / 100) * main_price).toFixed(
          1
        );

        //카테고리 조회
        const categoryData = await categoryModel.findById(category);
        if (!categoryData) {
          return res
            .status(400)
            .json({ success: false, message: "Category not found" });
        }

        let productData = {
          name: name.trim(),
          slug: convertToSlug(name, true),
          productId: random,
          unit: unit.trim(),
          unitValue: unit_val.trim(),
          price: main_price,
          discount,
          shortDescription: short_description.trim(),
          description,
          type,
          image,
          gallery,
          categories: categoryData.slug,
          brand: brand.trim(),
          trending: trending ? true : false,
          new: new_product ? true : false,
          bestSelling: best_selling ? true : false,
          seo: seoData,
          tax,
          vat,
          option: options,
          noticeInfo: noticeInfos,
        };
        if (isSpecial == "true") {
          productData.isSpecial = true;
          productData.withdrawablePointRate = withdrawablePointRate;
          productData.shoppingPointRate = shoppingPointRate;
          productData.rebateRate = rebateRate;

          const groupData = await groupModel.findById(group);
          if (!groupData) {
            return res
              .status(400)
              .json({ success: false, message: "Group not found" });
          }
          productData.group = groupData._id;
          productData.pointLimitRate = pointLimitRate;
          productData.pointLimit = Math.floor((groupData.price * pointLimitRate) / 100);
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
        await ProductModel.create(productData);
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
