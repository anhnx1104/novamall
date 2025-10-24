import ProductModel from "~/models/product";
import settingsModel from "~/models/setting";
import orderModel from "~/models/order";
import dbConnect from "~/utils/dbConnect";

const pif = {
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
};

export default async function productDetailsData(slug) {
  try {
    await dbConnect();
    const settings = await settingsModel.findOne({});
    const product = await ProductModel.findOne({ slug: slug });

    if(product) {
      const totalReviews = product.review.length;
      const averageRating = totalReviews > 0 ? product.review.reduce((acc, review) => acc + review.rating, 0) / totalReviews : 0;

      // Calculate total sales for the specific product
      const orderData = await orderModel.find({
        "products._id": product._id.toString(),
        paymentStatus: "Paid",
      });

      const totalSold = orderData.reduce((acc, order) => {
        const productInOrder = order.products.find(
          (p) => p._id.toString() === product._id.toString()
        );
        return acc + (productInOrder ? productInOrder.qty : 0);
      }, 0);

      product._doc.totalSold = totalSold;
      product._doc.averageRating = averageRating;
    }

    // const related = product
    //   ? await ProductModel.find({
    //       categories: product.categories,
    //     }).limit(8)
    //   : [];

    const related = product
      ? await ProductModel.aggregate([
        { $match: { categories: product.categories } },
        { $limit: 8 },
        {
          $project: {
            ...pif,
            averageRating: {
              $cond: [
                { $gt: [{ $size: "$review" }, 0] },
                { $avg: "$review.rating" },
                null,
              ],
            },
          },
        }
      ]): [];
    return {
      success: true,
      product,
      related,
      settings,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      product: {},
      related: [],
      settings: {},
    };
  }
}
