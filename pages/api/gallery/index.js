import CategoryModel from "../../../models/category";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";

const productItemField = {
  name: 1,
  slug: 1,
  image: 1,
  unit: 1,
  unitValue: 1,
  price: 1,
  discount: 1,
  type: 1,
  variants: 1,
  quantity: 1,
  date: 1,
  review: 1,
  isSpecial: 1,
};

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const {
          category,
          subcategory,
          childcategory,
          brands,
          price_min,
          price_max,
          colors,
          isSpecial,
          ratingStart,
          ratingEnd,
          trending,
          newProduct,
          bestSelling,
        } = req.query;
        const categoryItems = await CategoryModel.find({});

        // Build the query conditions
        const conditions = [];

        // 인기 상품 필터
        if (trending) {
          conditions.push({ trending: trending === "true" });
        }
        // 신상품 필터
        if (newProduct) {
          conditions.push({ new: newProduct === "true" });
        }
        // 베스트셀러 필터
        if (bestSelling) {
          conditions.push({ bestSelling: bestSelling === "true" });
        }

        // Category conditions
        if (category) conditions.push({ categories: category });
        if (subcategory) conditions.push({ subcategories: subcategory });
        if (childcategory) conditions.push({ childCategories: childcategory });

        // Brand conditions
        if (brands) {
          const brandArray = Array.isArray(brands) ? brands : [brands];
          conditions.push({ brand: { $in: brandArray } });
        }

        // Price range conditions
        if (price_min && price_max) {
          conditions.push({
            $or: [
              { discount: { $gte: +price_min, $lte: +price_max } },
              { price: { $gte: +price_min, $lte: +price_max } },
            ],
          });
        }

        // Color conditions
        if (colors) {
          const colorArray = Array.isArray(colors) ? colors : [colors];
          conditions.push({
            $or: [
              // For variable products, check variants
              {
                type: "variable",
                "variants.color": { $in: colorArray },
              },
              // For simple products, check colors array
              {
                type: "simple",
                colors: { $in: colorArray },
              },
            ],
          });
        }

        // Special product condition
        if (isSpecial) {
          conditions.push({ isSpecial: isSpecial === "true" });
        }

        const pipeline = [
          {
            $match: conditions.length > 0 ? { $and: conditions } : {},
          },
          { $sort: { date: -1 } },
          {
            $project: {
              ...productItemField,
              averageRating: {
                $cond: [
                  { $gt: [{ $size: { $ifNull: ["$review", []] } }, 0] },
                  { $avg: "$review.rating" },
                  0,
                ],
              },
            },
          },
        ];

        // ratingStart, ratingEnd가 있을 때 averageRating으로 필터
        if (ratingStart && ratingEnd) {
          pipeline.push({
            $match: {
              averageRating: {
                $gte: +ratingStart,
                $lte: +ratingEnd,
              },
            },
          });
        }

        const product = await ProductModel.aggregate(pipeline);

        // // Execute the query
        // const product = await ProductModel.find(
        //   conditions.length > 0 ? { $and: conditions } : {}
        // )
        //   .sort("-date")
        //   .select(productItemField)
        //   .exec();

        res.status(200).json({
          product: product,
          product_length: product.length,
          category: categoryItems,
        });
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
