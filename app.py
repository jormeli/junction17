from facedata import FaceData
from flask import Flask
import flask
app = Flask(__name__)

face_data = FaceData()
face_data.build()

def jsonify_grouped(grouped):
    json = {}
    for key in grouped.keys():
        json[str(key)] = [i.tojson() for i in grouped[key]]
    return json

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
    return flask.json.jsonify(jsonify_grouped(grouped))

@app.route('/api/location/<location>')
def by_location(location):
    grouped = face_data.find_by_location_grouped(location)
    return flask.json.jsonify(jsonify_grouped(grouped))

@app.route('/api/image/<dbid>')
def get_image(dbid):
    spotting = face_data.get_by_id(dbid)
    return flask.Response(response=spotting.encode_picture(), status=200, content_type='text/ascii')

@app.route('/api/video-urls')
def get_video_urls():
    return flask.json.jsonify({
        'test': 'https://www.youtube.com/embed/CDMN1aQ6I6c'
    })

@app.route('/api/locations')
def get_locations():
    locations_and_count = face_data.locations_and_count()
    json = {}
    for count, location in locations_and_count:
        json[location] = count
    return flask.json.jsonify(json)

