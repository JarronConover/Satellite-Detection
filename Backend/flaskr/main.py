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
    db = get_db()
    db.execute("INSERT INTO ship (classification, latitude, longitude, img, width, height, confidence, time, danger) VALUES (test, 1.222, 1.222, asdfasda, 1, 1, 1, ?, 1)", (time.time()))
    ships = db.execute('SELECT * FROM ship').fetchall()
    return jsonify(ships, status=200, mimetype='application/json')

@bp.route('/api/ships/<int:id>')
def get_ships_id(id):
    db = get_db()
    ship = db.execute('SELECT * FROM ship WHERE id = ?', (id,)).fetchone()

    if (ship is None):
        abort(404, f"ship {id} does not exist")

    return jsonify(ship, status=200, mimetype='application/json')



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

        danger = 1

        # todo: insert into your DB here
        # e.g. db.execute(..., (classification, timestamp, ...))
    
    db.commit()
    

    try:
        db.execute(
            "INSERT INTO ship (classification, latitude, longitude, img, width, height, confidence, time, danger) VALUES (?,?,?,?,?,?,?,?,?)",
            (classification,  latitude, longitude, image, width, height, confidence, timestamp, danger))
        db.commit()
    except:
        pass

    return Response(status=200)
