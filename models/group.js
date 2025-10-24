import { model, models, Schema } from "mongoose";
import { group } from "~/utils/modelData.mjs";

const groupSchema = new Schema(group, { versionKey: false, timestamps: true });

export default models.group || model("group", groupSchema);
