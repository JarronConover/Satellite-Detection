from flask import Flask, jsonify, Blueprint, g, request, Response
from flaskr.db import get_db
import threading
import json
import websockets
import time
from datetime import datetime, timezone
from .aisstream import connect_ais_stream, ais_ships
from multiprocessing import process



bp = Blueprint('main', __name__)


#starts up the thread that keeps track of AIS ships
AISShips = ais_ships()
p = threading.Thread(target=connect_ais_stream, args=[AISShips])
p.start()


@bp.route('/api/ships', methods=['get'])        #This is where the frontend requests ship data
def get_ships():
    db = get_db()
    ships = [dict(ship) for ship in db.execute('SELECT * FROM ship').fetchall()]

    print(ships)
    
    ids = AISShips.get_all()
    for id in ids:
        temp =  AISShips.id_get(id)
        ships.append({"id": -1, "classification": "AIS ship", "latitude": temp[0], "longitude": temp[1], "img":"none", "width":-1, "height":-1, "confidence":100, "time": temp[2], "danger": 0})


    return jsonify(ships), 200

@bp.route('/api/ships/<int:id>')
def get_ships_id(id):
    db = get_db()
    ships = [dict(ship) for ship in db.execute('SELECT * FROM ship WHERE id = ?', (id)).fetchall()]

    if (ships is None):
        abort(404, f"ship {id} does not exist")

    return jsonify(ships), 200


@bp.route('/satdump', methods=['POST'])
def sat_dump():
    db = get_db()
    payload = request.get_json()  # this is your dict or list
    
    # If you're sending a list of boxes:
    for entry in payload:
        classification = entry["Classification"]
        timestamp      = entry["timestamp"]
        latitude       = entry["latitude"]
        longitude      = entry["longitude"]
        width          = entry["width"]
        height         = entry["height"]
        image      = entry["image"]
        confidence     = entry["confidence"]

        danger = 0
        matching = AISShips.get(entry["latitude"], entry["longitude"])
        if len(matching) == 0:
            danger = 1

        try:
            db.execute(
                "INSERT INTO ship (classification, latitude, longitude, img, width, height, confidence, time, danger) VALUES (?,?,?,?,?,?,?,?,?)",
                (classification,  latitude, longitude, image, width, height, confidence, timestamp, danger))
            db.commit()
        except:
            pass

    return Response(status=200)
