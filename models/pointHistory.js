import { model, models, Schema } from "mongoose";
import { pointHistory } from "~/utils/modelData.mjs";

const pointHistorySchema = new Schema(pointHistory);

export default models.pointHistory || model("pointHistory", pointHistorySchema);
