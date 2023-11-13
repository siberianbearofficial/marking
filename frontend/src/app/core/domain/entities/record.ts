import {Quadrilateral} from "./quadrilateral";

export interface Record {
  uuid: string;
  barcodeQuadrilateral?: Quadrilateral;
  logoQuadrilateral?: Quadrilateral;
  approved?: boolean;
  barcodeScore?: number;
  logoScore?: number;
}
