import mongoose, { Schema } from "mongoose";
import { AssetSchema } from "./asset.schema";
import { EvaluativeItem } from "./evaluative-item.schema";

const product = new Schema({
  id: { type: String, require: true },
  name: { type: String, require: true },
  projectSampleNumber: { type: String, require: true },
  reference: { type: String, require: true },
  manufacturerName: { type: String, require: true },
  orderNumber: { type: String, require: true },
  productLine: { type: String, require: true },
  partiallyFinished: { type: Boolean, require: true },
  isDevelopment: { type: String, require: true },
  documents: { type: [AssetSchema], require: true },
  images: { type: [AssetSchema], require: true },
  annotations: { type: [AssetSchema], require: true },
  items: { type: [EvaluativeItem], require: true },
  inspectedQuantity: { type: String, require: false },
  defectiveQuantity: { type: String, require: false },
  mainAnnotation: { type: String, require: false },
  lotNumber: { type: String, require: false },
  orderQuantity: { type: String, require: false },
  finishedAt: { type: Date, require: false },
  finisher: { type: String, require: false },
})

export const ProductSchema = mongoose.model('product', product);
