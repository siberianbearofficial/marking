export interface RecordModel {
  uuid: string;
  quadrilateral_barcode?: {
    p1: {
      x: number,
      y: number
    },
    p2: {
      x: number,
      y: number
    },
    p3: {
      x: number,
      y: number
    },
    p4: {
      x: number,
      y: number
    }
  };
  quadrilateral_logo?: {
    p1: {
      x: number,
      y: number
    },
    p2: {
      x: number,
      y: number
    },
    p3: {
      x: number,
      y: number
    },
    p4: {
      x: number,
      y: number
    }
  };
  approved?: boolean;
  barcode_score?: number;
  logo_score?: number;
}
