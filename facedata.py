import sqlite3
import io
from datetime import datetime
import numpy as np
from PIL import Image
from annoy import AnnoyIndex
from scipy.spatial.distance import cosine
from sklearn import cluster
from sklearn import metrics

IMAGE_SIZE = (128, 128)
GET_N = 1000
SIMILARITY_CUTOFF = 0.1

class Spotting(object):
    def __init__(self, dbid, # int
            vector, # np.array
            created_at, # datetime
            spotted_at, # datetime
            picture, # PIL image object
            location): # string
        self.dbid = dbid
        self.vector = vector
        self.created_at = created_at
        self.spotted_at = spotted_at
        self.picture = picture
        self.location = location

    def binary_vector(self):
        out = io.BytesIO()
        np.save(out, self.vector)
        out.seek(0)
        return sqlite3.Binary(out.read())

    def vector_hash(self):
        return hash(str(self.vector))

    def image_data(self):
        return sqlite3.Binary(self.picture.tobytes())

    def todata(self):
        vector_data = self.binary_vector()
        created_at = datetime.utcnow() if self.created_at is None else self.created_at
        image_blob = self.image_data()
        dbid = self.annoy_index.get_n_items() if self.dbid is None else self.dbid
        return (dbid,
            self.vector_hash(),
            vector_data,
            created_at,
            self.spotted_at,
            image_blob,
            self.location)

    @classmethod
    def fromdata(cls, data):
        vector = np.load(io.BytesIO(data[2]))
        image = Image.frombytes('RGB', IMAGE_SIZE, data[5])
        return cls(data[0], vector, data[3], data[4], image, data[5])

class FaceData(object):
    def __init__(self):
        self.connection = sqlite3.connect('junction17.db')
        self.annoy_index = AnnoyIndex(128, metric='angular')
        self._populate_index()

    def _populate_index(self):
        cursor = self.connection.cursor()
        items = map(Spotting.fromdata, cursor.execute("SELECT * FROM spotting;"))
        for item in items:
            self.annoy_index.add_item(item.dbid, list(item.vector))

    def insert(self, spotting):
        cursor = self.connection.cursor()
        self.annoy_index.add_item(self.annoy_index.get_n_items(), list(spotting.vector))
        cursor.execute("""
            INSERT INTO spotting VALUES (?, ?, ?, ?, ?, ?, ?);
        """, spotting.todata())
        self.connection.commit()

    def fetch(self, vector_hash):
        cursor = self.connection.cursor()
        data = cursor.execute("SELECT * FROM spotting WHERE vector_hash=?;", vector_hash)
        return Spotting.fromdata(data)

    def get_nearest(self, vector):
        ids, nearest_vectors = self.annoy_index.get_nns_by_vector(vector, GET_N, include_distances=True)
        cursor = self.connection.cursor()
        ids = ",".join([str(dbid) for dbid in ids])
        spottings = cursor.execute('SELECT * FROM spotting WHERE id in ({seq});'.format(seq=ids))
        spottings = [Spotting.fromdata(data) for data in spottings]
        return spottings

    def getall(self):
        cursor = self.connection.cursor()
        items = cursor.execute("SELECT * FROM spotting;")
        return [Spotting.fromdata(data) for data in items]

    def build(self):
        # builds the annoy index. After building searches can be made, no more items can be added.
        self.annoy_index.build(10)

    def count_uniques(self):
        vectors = np.stack([f.vector for f in self.getall()])
        dbscan = cluster.DBSCAN(eps=SIMILARITY_CUTOFF, metric='precomputed')
        dima = metrics.pairwise.cosine_distances(vectors)
        labels = dbscan.fit_predict(dima)
        return max(labels)

def create_dummy(i):
    vector = np.random.randn(128)
    image = Image.fromarray(np.random.randn(*IMAGE_SIZE))
    return Spotting(i, vector, datetime.now(), datetime.now(), image, 'test')

if __name__ == '__main__':
    face_data = FaceData()

    all_items = face_data.getall()
    try:
        largest_id = max([item.dbid for item in all_items])
    except ValueError:
        largest_id = 0
    dummy_items = [create_dummy(i) for i in range(largest_id + 1, largest_id + 10)]
    for item in dummy_items:
        face_data.insert(item)

    face_data.build()
    for i in range(5):
        random_item = np.random.choice(dummy_items)
        nearest = face_data.get_nearest(random_item.vector)
        nearest_item_ids = [n.dbid for n in nearest]
        print('nearest items: ', nearest_item_ids)

    face_data.count_uniques()

    # cursor = face_data.connection.cursor()
    # cursor.execute("DELETE FROM spotting WHERE location='test';")





