import threading
import time

ERROR = 0.001

class ais_ships:
    data: dict
    l = threading.lock()

    def add(id: int, latitude, longitude):
        with l:
            data.update({id: (latitude, longitude, time.time())})

    def id_get(id: int):
        with l:
            out = data[id]
        return out
    
    def get(latitude, longitude):
        with l:
            out = {}
            for ship in data:
                if (latitude - ERROR < data[ship][0] < latitude + ERROR) and (longitude - ERROR < data[ship][1] < longitude + ERROR):
                    if time.time() - data[ship][2] > 60:
                        data.pop(ship)
                    else:
                        out.append({ship: data[ship]})
        
        return out
                    







async def connect_ais_stream(latitude, longitude, width, height):

    async with websockets.connect("wss://stream.aisstream.io/v0/stream") as websocket:
        subscribe_message = {"APIKey": "54fd66873359f819fab51694d01a39f847d8795b",  # Required !
                             "BoundingBoxes": [[[latitude - height, longitude - width], [latitude + height, longitude + width]]], # Required!
                             "FilterMessageTypes": ["PositionReport"]} # Optional!

        subscribe_message_json = json.dumps(subscribe_message)
        await websocket.send(subscribe_message_json)

        async for message_json in websocket:
            message = json.loads(message_json)
            message_type = message["MessageType"]


            if message_type == "PositionReport":
                # the message parameter contains a key of the message type which contains the message itself
                ais_message = message['Message']['PositionReport']
                print(f"[{datetime.now(timezone.utc)}] ShipId: {ais_message['UserID']} Latitude: {ais_message['Latitude']} Latitude: {ais_message['Longitude']}")

#asyncio.run(asyncio.run(connect_ais_stream(37.79463, -122.39112833333334, 0, 0)))