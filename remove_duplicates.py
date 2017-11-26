import sys
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_distances
from facedata import FaceData, Spotting

face_data = FaceData()
items = face_data.find_by_location('entrance')
embs = np.stack([item.vector for item in items])
print('faces found: %d ' % embs.shape[0])

db = DBSCAN(0.45, metric='precomputed')
dist = cosine_distances(embs)

clusters=db.fit_predict(dist)
print('clustered: %d' % (len(set(clusters)) - 1))
groups = [[] for i in range(len(set(clusters)) - 1)]
for i, label in enumerate(clusters):
    if label == -1:
        continue
    groups[label].append(i)

def triage(group):
    keyed_by_hour = {}
    for item in group:
        key = item.spotted_at.split(' ')[1].split(':')[0]
        if keyed_by_hour.get(key, None) is None:
            keyed_by_hour[key] = []
        keyed_by_hour[key].append(item)
    keep = []
    dont_keep = []
    for key in keyed_by_hour.keys():
        group_items = keyed_by_hour[key]
        ids = [i.dbid for i in group_items]
        middle_item_index = np.argsort(ids)[len(ids)//2]
        item_to_keep = group_items[middle_item_index]
        keep.append(item_to_keep)
        dont_keep.extend([dbid for dbid in ids if dbid != item_to_keep.dbid])
    return keep, dont_keep

remove = []
keep = []
for i, group in enumerate(groups):
    group = [items[index] for index in group]
    to_keep, dont_keep = triage(group)
    keep.extend(to_keep)
    remove.extend(dont_keep)

for dbid in remove:
    face_data.delete_id(dbid)

print(len(face_data.find_by_location('entrance')))
face_data.connection.commit()
face_data.connection.close()
