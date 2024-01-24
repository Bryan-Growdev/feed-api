import { Schema } from "mongoose";
import { AssetSchema } from "./asset.schema";


export const EvaluativeItem = new Schema({
  id: { type: String, require: true },
  itemId: { type: String, require: true },
  name: { type: String, require: true },
  hasInput: { type: Boolean, require: true },
  subtypeId: { type: String, require: true },
  subtypeName: { type: String, require: true },
  tolerance: { type: String, require: true },
  isCritical: { type: Boolean, require: true },
  documents: { type: [AssetSchema], require: true },
  images: { type: [AssetSchema], require: true },
  annotations: { type: [AssetSchema], require: true },
  reviewerValue: { type: String, require: false },
  statusIsApproved: { type: Boolean, require: false },
  catalogValue: { type: String, require: false },
  supplierValue: { type: String, require: false },
  labValue: { type: String, require: false },
  isEditable: { type: Boolean, require: true },
});