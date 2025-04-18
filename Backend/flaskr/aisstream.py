import threading
import time
import os
from websockets.sync.client import connect
import json
import websockets
from datetime import datetime, timezone

ERROR = 0.001
MAX_AIS_SHIPS = 100

class ais_ships:

    def __init__(self):
        self.data = dict()
        self.dataQueue = list()
        self.l = threading.Lock()

        

    def add(self, id: int, latitude, longitude):
        with self.l:
            self.data.update({id: (latitude, longitude, time.time())})
            try:
                self.dataQueue.remove(id)
            except:
                pass
            self.dataQueue.append(id)

            if len(self.dataQueue) > MAX_AIS_SHIPS:
                self.data.pop(dataQueue[0])
                self.dataQueue.pop(0)

    def id_get(self, id: int):
        with self.l:
            out = self.data[id]
        return out

    def get_all(self):
        with self.l:
            out = list(self.dataQueue)
        return out
    
    def get(self, latitude, longitude):
        with self.l:
            temp = dict(self.data)


        out = {}
        for ship in temp:
            if (latitude - ERROR < temp[ship][0] < latitude + ERROR) and (longitude - ERROR < temp[ship][1] < longitude + ERROR):
                out.append({ship: temp[ship]})
                    
        
        return out
                    







def connect_ais_stream(data: ais_ships):

    with connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {"APIKey": os.getenv("AISSTREAM_API_KEY"),  # Required !
                             "BoundingBoxes": [[[37.80376186032549, -122.40499702549884], [37.586018392312226, -122.12453445534551]]], # Required!
                             "FilterMessageTypes": ["PositionReport"]} # Optional!

        subscribe_message_json = json.dumps(subscribe_message)
        websocket.send(subscribe_message_json)

        
        for message_json in websocket:
            message = json.loads(message_json)
            message_type = message["MessageType"]

            if message_type == "PositionReport":
                # the message parameter contains a key of the message type which contains the message itself
                ais_message = message['Message']['PositionReport']
                data.add(id=ais_message['UserID'], latitude=ais_message['Latitude'], longitude=ais_message['Longitude'])


        

