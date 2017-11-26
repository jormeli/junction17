import sys
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_distances
from facedata import FaceData, Spotting

face_data = FaceData()
items = face_data.find_by_location('entrance')
embs = np.stack([item.vector for item in items])
print('faces found: %d ' % embs.shape[0])

db = DBSCAN(0.101, metric='precomputed')
dist = cosine_distances(embs)

clusters=db.fit_predict(dist)
print('clustered: %d' % (len(set(clusters)) - 1))
groups = [[] for i in range(len(set(clusters)) - 1)]
for i, label in enumerate(clusters):
    groups[label].append(i)

for g in range(len(groups)):
    groups[g] = groups[g][1:]

remove = [a for b in groups for a in b]

for i,d in enumerate(items):
    if i in remove:
        face_data.delete_id(d.dbid)

print(len(face_data.find_by_location('entrance')))
face_data.connection.commit()
face_data.connection.close()
