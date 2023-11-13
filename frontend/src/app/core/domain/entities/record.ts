import {Quadrilateral} from "./quadrilateral";
import {Rectangle} from "./rectangle";

export interface Record {
  uuid: string;
  barcodeQuadrilateral?: Quadrilateral;
  logoQuadrilateral?: Quadrilateral;
  approved?: boolean;
  barcodeScore?: number;
  logoScore?: number;
}
