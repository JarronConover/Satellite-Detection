import threading
import time
from dotenv import load_dotenv
import os
import asyncio
import json
import websockets
from datetime import datetime, timezone

ERROR = 0.001

class ais_ships:
    data: dict
    l = threading.Lock()

    def add(id: int, latitude, longitude):
        with l:
            data.update({id: (latitude, longitude, time.time())})

    def id_get(id: int):
        with l:
            out = data[id]
        return out
    
    def get(latitude, longitude):
        with l:
            temp = dict(data)


        out = {}
        for ship in temp:
            if (latitude - ERROR < temp[ship][0] < latitude + ERROR) and (longitude - ERROR < temp[ship][1] < longitude + ERROR):
                if time.time() - data[ship][2] > 60:
                    data.pop(ship)
                else:
                    out.append({ship: data[ship]})
        
        return out
                    







async def connect_ais_stream(latitude, longitude):

    load_dotenv()    

    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {"APIKey": os.getenv("AISSTREAM_API_KEY"),  # Required !
                             "BoundingBoxes": [[[latitude - ERROR, longitude - ERROR], [latitude + ERROR, longitude + ERROR]]], # Required!
                             "FilterMessageTypes": ["PositionReport"]} # Optional!

        subscribe_message_json = json.dumps(subscribe_message)
        await websocket.send(subscribe_message_json)

        async for message_json in websocket:
            message = json.loads(message_json)
            print(message)
            message_type = message["MessageType"]


            if message_type == "PositionReport":
                # the message parameter contains a key of the message type which contains the message itselfc
                ais_message = message['Message']['PositionReport']
                print(f"[{datetime.now(timezone.utc)}] ShipId: {ais_message['UserID']} Latitude: {ais_message['Latitude']} Latitude: {ais_message['Longitude']}")

asyncio.run(asyncio.run(connect_ais_stream(37.79463, -122.39112833333334)))