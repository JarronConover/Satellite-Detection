from flask import Flask, jsonify, Blueprint, g, request, Response
from flaskr.db import get_db
import asyncio
import json
import websockets
from datetime import datetime, timezone

 # Enable CORS to allow cross-origin requests from React frontend

bp = Blueprint('main', __name__)
#Sample Ship data that will get removed once we have a database to draw on

@bp.route('/api/ships', methods=['get'])        #This is where the frontend requests ship data
def get_ships():
    ships = db.execute('SELECT * FROM ship').fetchall()
    return jsonify(ships, status=200, mimetype='application/json')

@bp.route('/api/ships/<int:id>')
def get_ships_id(id):
    ship = db.execute('SELECT * FROM ship WHERE id = ?', (id,)).fetchone()

    if (ship is None):
        abort(404, f"ship {id} does not exist")

    return jsonify(ship, status=200, mimetype='application/json')

@bp.route('/satdump', methods=['post'])
def sat_dump():

    db = get_db()
    data = json.loads(request.json)

    classification = data.get('Classification')
    timestamp = data.get('timestamp')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    width = data.get('width')
    height = data.get('height')
    image = data.get('image')
    confidence = data.get('confidence')

    danger = 1
    

    try:
        db.execute(
            "INSERT INTO ship (classification, latitude, longitude, img, width, height, confidence, time, danger) VALUES (?,?,?,?,?,?,?,?,?)",
            (classification, timestamp, latitude, longitude, width, height, image, confidence, danger))
        db.commit()
    except:
        pass

    return Response(status=200)