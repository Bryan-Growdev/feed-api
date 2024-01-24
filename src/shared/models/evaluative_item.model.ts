import { Asset } from ".";

export type EvaluativeItem = {
  id: string,
  itemId: string,
  name: string,
  hasInput: boolean,
  subtypeId: string,
  subtypeName: string,
  tolerance: string,
  isCritical: boolean,
  documents: Asset[],
  images: Asset[],
  annotations: Asset[],
  reviewerValue: string,
  statusIsApproved: boolean,
  catalogValue: string,
  supplierValue: string,
  labValue: string,
  isEditable: boolean,
}