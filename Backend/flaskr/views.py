from flask import Blueprint, jsonify, g, request, abort
from flaskr.db import get_db

bp = Blueprint('main', __name__)

@bp.route('/api/ships')
def get_ships():
    # DB-sourced ships
    db = get_db()
    db_ships = [dict(r) for r in db.execute('SELECT * FROM ship').fetchall()]

    # AIS-sourced ships
    ais_ids = g.ais.get_all()
    ais_ships = [
        {
            'id': -1,
            'classification': 'AIS ship',
            'latitude': lat,
            'longitude': lon,
            'img': None,
            'width': -1,
            'height': -1,
            'confidence': 100,
            'time': ts,
            'danger': 0
        }
        for sid in ais_ids
        for lat, lon, ts in [g.ais._data[sid]]
    ]

    return jsonify(db_ships + ais_ships), 200

@bp.route('/api/ships/<int:id>')
def get_ship_by_id(id):
    db = get_db()
    row = db.execute('SELECT * FROM ship WHERE id = ?', (id,)).fetchone()
    if row is None:
        abort(404, f"ship {id} does not exist")
    return jsonify(dict(row)), 200

@bp.route('/satdump', methods=['POST'])
def sat_dump():
    db = get_db()
    payload = request.get_json() or []
    
    print(f"Received {len(payload)} entries from satdump")

    inserted = 0
    for entry in payload:
        try:
            classification = entry.get("Classification")
            timestamp      = entry.get("timestamp")
            lat            = entry.get("latitude")
            lon            = entry.get("longitude")
            width          = entry.get("width")
            height         = entry.get("height")
            image          = entry.get("image")
            confidence     = entry.get("confidence")
            danger         = 1

            try:
                db.execute(
                    "INSERT INTO ship "
                    "(classification, latitude, longitude, img, width, height, confidence, time, danger) "
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (classification, lat, lon, image, width, height, confidence, timestamp, danger)
                )
                inserted += 1
            except Exception as e:
                print(f"Error inserting entry {entry}: {e}")
                continue

        except KeyError as e:
            return jsonify({"error": f"Missing key: {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # commit once after all inserts
    db.commit()
    print(f"Inserted {inserted}/{len(payload)} records into ship table.")
    return ("Success", 200)

