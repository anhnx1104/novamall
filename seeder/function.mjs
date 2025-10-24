import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  attribute,
  category,
  color,
  product,
  settings,
  shippingCharge,
  user,
  webpage,
  brand,
  order,
  group,
  groupRanking,
  faq,
  address,
  coupon,
  newsletter,
  pointHistory,
  refundRequest,
} from "../utils/modelData.mjs";

dotenv.config({ path: process.cwd() + "/.env.local" });

export async function _dbConnect() {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    })
    .then(() => console.log("DB Connected"))
    .catch((error) => {
      console.log("DB Connection Failed", error.message);
    });
}

export async function _dbDisconnect() {
  await mongoose.connection
    .close()
    .then(() => console.log("DB Disconnected"))
    .catch((error) => {
      console.log("DB Disconnection Failed", error.message);
    });
}

//settings data
const SettingSchema = new mongoose.Schema(settings);
export const settingModel = mongoose.model("setting", SettingSchema);
//products data
const productSchema = new mongoose.Schema(product);
export const productModel = mongoose.model("product", productSchema);
//category data
const categorySchema = new mongoose.Schema(category);
export const categoryModel = mongoose.model("category", categorySchema);
//attribute data
const attributeSchema = new mongoose.Schema(attribute);
export const attributeModel = mongoose.model("attribute", attributeSchema);
//color data
const colorSchema = new mongoose.Schema(color);
export const colorModel = mongoose.model("color", colorSchema);
//shippingCharge data
const shippingChargeSchema = new mongoose.Schema(shippingCharge);
export const shippingChargeModel = mongoose.model(
  "shippingCharge",
  shippingChargeSchema
);
//newsletter data
const newsletterSchema = new mongoose.Schema(newsletter);
export const newsletterModel = mongoose.model("newsletter", newsletterSchema);
//coupon data
const couponSchema = new mongoose.Schema(coupon);
export const couponModel = mongoose.model("coupon", couponSchema);
//address data
const addressSchema = new mongoose.Schema(address);
export const addressModel = mongoose.model("address", addressSchema);
//faq data
const faqSchema = new mongoose.Schema(faq);
export const faqModel = mongoose.model("faq", faqSchema);
//group data
const groupSchema = new mongoose.Schema(group);
export const groupModel = mongoose.model("group", groupSchema);
const groupRankingSchema = new mongoose.Schema(groupRanking);
export const groupRankingModel = mongoose.model(
  "groupRanking",
  groupRankingSchema
);
//accounts data (for google login)
const accountSchema = new mongoose.Schema({
  provider: { type: String, required: true },
  type: { type: String, required: true },
  providerAccountId: { type: String, required: true, unique: true },
  access_token: { type: String },
  expires_at: { type: Number },
  scope: { type: String },
  token_type: { type: String },
  id_token: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
export const accountModel = mongoose.model("account", accountSchema);
//point history data
const pointHistorySchema = new mongoose.Schema(pointHistory);
export const pointHistoryModel = mongoose.model(
  "pointHistory",
  pointHistorySchema
);
//refund request data
const refundRequestSchema = new mongoose.Schema(refundRequest);
export const refundRequestModel = mongoose.model(
  "refundRequest",
  refundRequestSchema
);
//user data
const userSchema = new mongoose.Schema(user);
export const userModel = mongoose.model("user", userSchema);
//webpage data
const webpageSchema = new mongoose.Schema(webpage);
export const webpageModel = mongoose.model("webpage", webpageSchema);
//category data
const brandSchema = new mongoose.Schema(brand);
export const brandModel = mongoose.model("brand", brandSchema);
//category data
const orderSchema = new mongoose.Schema(order);
export const orderModel = mongoose.model("order", orderSchema);

const exp = {
  _dbConnect,
  settingModel,
  productModel,
  categoryModel,
  attributeModel,
  colorModel,
  shippingChargeModel,
  userModel,
  webpageModel,
  brandModel,
  orderModel,
};

export default exp;
