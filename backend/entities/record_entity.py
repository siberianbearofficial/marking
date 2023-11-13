from json import loads, dumps


class RecordEntity:

    def __init__(self, uuid: str, quadrilateral_barcode: str | dict, barcode_score: float, quadrilateral_logo: str | dict, logo_score: float, approved: bool, user_id: str):
        self.uuid = uuid
        self.quadrilateral_barcode = self.set_quadrilaterals(
            quadrilateral_barcode)
        self.barcode_score = barcode_score
        self.quadrilateral_logo = self.set_quadrilaterals(quadrilateral_logo)
        self.logo_score = logo_score
        self.approved = approved
        self.user_id = user_id

    def set_quadrilaterals(self, quadrilateral: str | dict):
        if isinstance(quadrilateral, str):
            return loads(quadrilateral)
        elif isinstance(quadrilateral, dict):
            return self.qudrilateral_dict_to_list(quadrilateral)
        else:
            return quadrilateral

    def qudrilateral_dict_to_list(self, quadrilateral: dict):
        if quadrilateral:
            return [[quadrilateral['p1']['x'], quadrilateral['p1']['y']],
                    [quadrilateral['p2']['x'],
                     quadrilateral['p2']['y']],
                    [quadrilateral['p3']['x'],
                     quadrilateral['p3']['y']],
                    [quadrilateral['p4']['x'], quadrilateral['p4']['y']]]

    def quadrilateral_list_to_dict(self, quadrilateral: list):
        if quadrilateral:
            return {
                'p1': {
                    'x': quadrilateral[0][0],
                    'y': quadrilateral[0][1]
                },
                'p2': {
                    'x': quadrilateral[1][0],
                    'y': quadrilateral[1][1]
                },
                'p3': {
                    'x': quadrilateral[2][0],
                    'y': quadrilateral[2][1]
                },
                'p4': {
                    'x': quadrilateral[3][0],
                    'y': quadrilateral[3][1]
                }
            }

    def to_dict(self):
        if isinstance(self.quadrilateral_barcode, list):
            self.quadrilateral_barcode = self.quadrilateral_list_to_dict(
                self.quadrilateral_barcode)
        if isinstance(self.quadrilateral_logo, list):
            self.quadrilateral_logo = self.quadrilateral_list_to_dict(
                self.quadrilateral_logo)
        return {'uuid': self.uuid, 'quadrilateral_barcode': self.quadrilateral_barcode,
                'barcode_score': self.barcode_score, 'quadrilateral_logo': self.quadrilateral_logo,
                'logo_score': self.logo_score, 'approved': self.approved, 'user_id': self.user_id}
