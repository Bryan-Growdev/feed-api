import { Schema } from "mongoose";

export const AssetSchema = new Schema({
  id: { type: String, require: true },
  name: { type: String, require: true },
  assetType: { type: String, require: true },
  ownerId: { type: String, require: true },
  ownerName: { type: String, require: true },
  createdAt: { type: Date, require: true },
  description: { type: String, require: true },
  isReviewItem: { type: Boolean, require: true },
  referenceId: { type: String, require: true },
  fileKey: { type: String, require: false },
  wasDeleted: { type: Boolean, require: true },
  wasUpdated: { type: Boolean, require: true },
  isNewAsset: { type: Boolean, require: true },
});
