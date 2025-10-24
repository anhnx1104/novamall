import { model, models, Schema } from "mongoose";
import { groupRanking } from "~/utils/modelData.mjs";

const groupRankingSchema = new Schema(groupRanking, { versionKey: false, timestamps: true });

export default models.groupRanking || model("groupRanking", groupRankingSchema);
