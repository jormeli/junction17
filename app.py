from facedata import FaceData
from flask import Flask
import flask
app = Flask(__name__)

face_data = FaceData()
face_data.build()


@app.route('/api/uniques')
def index():
    uniques = face_data.count_uniques()
    return flask.json.jsonify({
        'uniques': int(uniques)
    })

@app.route('/api/spottings')
def spottings():
    all_items = [i.tojson() for i in face_data.getall()]
    return flask.json.jsonify(all_items)

@app.route('/api/people')
def people():
    grouped = face_data.by_people()
    json = {}
    for key in grouped.keys():
        json[str(key)] = [i.tojson() for i in grouped[key]]
    return flask.json.jsonify(json)
