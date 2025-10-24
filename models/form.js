import { model, models, Schema } from "mongoose";
import { form } from "~/utils/modelData.mjs";

const formSchema = new Schema(form);

export default models.form || model("form", formSchema);
