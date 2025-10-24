import { model, models, Schema } from "mongoose";
import { faq } from "~/utils/modelData.mjs";

const faqSchema = new Schema(faq);

export default models.faq || model("faq", faqSchema);
