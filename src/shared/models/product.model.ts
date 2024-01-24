import { Asset, EvaluativeItem } from ".";

export type Product = {
  id: string;
  name: string;
  projectSampleNumber: string;
  reference: string;
  manufacturerName: string;
  orderNumber: string;
  productLine: string;
  partiallyFinished: Boolean;
  isDevelopment: string;
  documents: Asset[];
  images: Asset[];
  annotations: Asset[];
  items: EvaluativeItem[];
  inspectedQuantity: string;
  defectiveQuantity: string;
  mainAnnotation: string;
  lotNumber: string;
  orderQuantity: string;
  finishedAt: Date;
  finisher: string;
}