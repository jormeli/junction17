import sqlite3
import io
from datetime import datetime
import numpy as np
from PIL import Image

IMAGE_SIZE = (128, 128)

class Spotting(object):
    def __init__(self, id, # int
            vector, # np.array
            created_at, # datetime
            spotted_at, # datetime
            picture, # PIL image object
            location): # string
        self.id = id
        self.vector = vector
        self.created_at = created_at
        self.spotted_at = spotted_at
        self.picture = picture
        self.location = location

    def binary_vector(self):
        out = io.BytesIO()
        np.save(out, self.vector)
        out.seek(0)
        return out.read()

    def vector_hash(self):
        return hash(str(self.vector))

    def image_data(self):
        return self.picture.tobytes()

    @classmethod
    def fromdata(cls, data):
        vector = np.load(data[2])
        image = Image.frombytes('RGB', IMAGE_SIZE, data[6])
        return cls(data[0], vector, data[3], data[4], image, data[5])

class FaceData(object):
    def __init__(self):
        self.connection = sqlite3.connect('example.db')

    def insert(self, spotting):
        c = self.connection.cursor()
        vector_data = sqlite3.Binary(spotting.binary_vector()),
        created_at = datetime.utcnow() if spotting.created_at is None else spotting.created_at
        image_blob = sqlite3.Binary(spotting.image_data())
        c.execute("""
            INSERT INTO spotting VALUES (?, ?, ?, ?, ?, ?, ?);
        """, spotting.id, spotting.vector_hash(),
            vector_data,
            created_at,
            spotting.spotted_at,
            image_blob,
            spotting.location
        )

    def fetch(self, vector_hash):
        cursor = self.connection.cursor()
        data = cursor.execute("SELECT * FROM spotting WHERE vector_hash=?;", vector_hash)
        return Spotting.fromdata(data)


