from pydantic import BaseModel


class RecordModel(BaseModel):
    uuid: str
    quadrilateral_barcode: dict | None = None
    barcode_score: float | str | None = None
    quadrilateral_logo: dict | None = None
    logo_score: float | str |None = None
    approved: bool | None = False
    user_id: str | None = None

    def set_quadrilaterals(self, quadrilateral_struct: list):
        if quadrilateral_struct:
            print(quadrilateral_struct)
            quadrilateral = {
                'p1': {
                    'x': quadrilateral_struct[0][0],
                    'y': quadrilateral_struct[0][1]
                },
                'p2': {
                    'x': quadrilateral_struct[1][0],
                    'y': quadrilateral_struct[1][1]
                },
                'p3': {
                    'x': quadrilateral_struct[2][0],
                    'y': quadrilateral_struct[2][1]
                },
                'p4': {
                    'x': quadrilateral_struct[3][0],
                    'y': quadrilateral_struct[3][1]
                }
            }
            print(quadrilateral)
            return quadrilateral