export type Asset = {
  id: string;
  name: string;
  assetType: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  description: string;
  isReviewItem: boolean;
  referenceId: string;
  fileKey: string;
  wasDeleted: boolean;
  wasUpdated: boolean;
  isNewAsset: boolean;
}