import shutil
from os import makedirs


class ImagesService:

    def save_photo(self, uuid: str, image: bytes):
        try:
            makedirs(f'/static/images/{uuid}')
        except FileExistsError:
            pass
        with open(f'/static/images/{uuid}/photo.png', 'wb') as file:
            file.write(image)

    def save_ideal(self, uuid: str, image: bytes):
        try:
            makedirs(f'/static/images/{uuid}')
        except FileExistsError:
            pass
        with open(f'/static/images/{uuid}/ideal.png', 'wb') as file:
            file.write(image)

    def remove_images(self, uuid: str):
        shutil.rmtree(f'/static/images/{uuid}', ignore_errors=True)
