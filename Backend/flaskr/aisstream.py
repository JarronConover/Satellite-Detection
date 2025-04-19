import os, json, time, threading, logging
from websockets.sync.client import connect
from websockets.exceptions import ConnectionClosedError, WebSocketException



logger = logging.getLogger(__name__)

ERROR = 0.001
MAX_AIS_SHIPS = 100

class AISDataStore:
    """Thread-safe in-memory storage for AIS ship positions."""
    def __init__(self):
        self._data = {}
        self._queue = []
        self._lock = threading.Lock()

    def add(self, ship_id: int, lat: float, lon: float):
        with self._lock:
            self._data[ship_id] = (lat, lon, time.time())
            if ship_id in self._queue:
                self._queue.remove(ship_id)
            self._queue.append(ship_id)
            if len(self._queue) > MAX_AIS_SHIPS:
                old_id = self._queue.pop(0)
                self._data.pop(old_id, None)

    def get_all(self):
        with self._lock:
            return list(self._queue)

    def get(self, lat: float, lon: float):
        """Return ships within ERROR proximity of given coords."""
        with self._lock:
            return {
                sid: data
                for sid, data in self._data.items()
                if abs(data[0] - lat) < ERROR and abs(data[1] - lon) < ERROR
            }

class AISClient:
    """
    Connects to AIS WebSocket, parses messages, and updates a data store.
    """
    def __init__(self, store: AISDataStore, bounding_boxes: list, api_key=None):
        self.store = store
        self.bounding = bounding_boxes
        self.api_key = api_key or os.getenv("AISSTREAM_API_KEY")
        self._stop = threading.Event()
        self._thread = None

    def start(self):
        if not self.api_key:
            logger.warning("AISSTREAM_API_KEY not set; client not started.")
            return
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()
        logger.info("AISClient thread started.")

    def stop(self):
        self._stop.set()
        if self._thread:
            self._thread.join()

    def _run(self):
        retry = 5
        while not self._stop.is_set():
            ws = None
            try:
                ws = connect("wss://stream.aisstream.io/v0/stream")
                sub = {
                    "apiKey":            self.api_key,
                    "boundingBoxes":     self.bounding,
                    "filterMessageTypes":["PositionReport"],
                }

                logger.debug("🔎 SUBSCRIBE ➡️ %s", sub)
                ws.send(json.dumps(sub))

                while not self._stop.is_set():
                    raw = ws.recv()
                    if isinstance(raw, (bytes, bytearray)):
                        raw = raw.decode("utf-8")
                    msg = json.loads(raw)

                    if "error" in msg:
                        logger.error("Subscription error: %s", msg["error"])
                        break

                    if msg.get("MessageType") == "PositionReport":
                        pr = msg["Message"]["PositionReport"]
                        self.store.add(pr["UserID"], pr["Latitude"], pr["Longitude"])

            except ConnectionClosedError as e:
                logger.warning("WebSocket closed: %s", e)
            except WebSocketException as e:
                logger.error("WebSocket protocol error", exc_info=e)
            except Exception as e:
                logger.error("Unexpected error", exc_info=e)
            finally:
                if ws:
                    ws.close()

            time.sleep(retry)
            retry = min(retry * 1.5, 60)
