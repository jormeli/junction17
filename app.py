from facedata import FaceData
from flask import Flask
import flask
app = Flask(__name__)

face_data = FaceData()
face_data.build()

@app.route('/api/index')
def index():
    uniques = face_data.count_uniques()
    return flask.json.jsonify({
        'uniques': int(uniques)
    })
