import os
from flask import Flask, g
from flask_cors import CORS
from dotenv import load_dotenv

def create_app(test_config=None):
    # 1) Create and configure Flask
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
        AISSTREAM_API_KEY=None,              # placeholder; will be overridden by .env/config.py
    )
    CORS(app)

    # 2) Load .env and config.py
    load_dotenv()
    if test_config:
        app.config.update(test_config)
    else:
        app.config.from_pyfile("config.py", silent=True)

    # 3) Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # 4) Initialize the database (register teardown + CLI)
    from .db import init_app as init_db_app
    init_db_app(app)

    # 5) Start the AIS client & attach it to `g` on every request
    from .aisstream import AISClient, AISDataStore
    store = AISDataStore()
    bounding_boxes = [[[37.8038, -122.4050], [37.5860, -122.1245]]]
    client = AISClient(store, bounding_boxes,
                       api_key=app.config.get("AISSTREAM_API_KEY"))
    client.start()

    @app.before_request
    def attach_ais():
        g.ais = store

    # 6) Register your routes (make sure views.py has your Blueprint)
    from .views import bp as main_bp
    app.register_blueprint(main_bp)

    # 7) (Optional) a quick health check
    @app.route("/hello")
    def hello():
        return "Hello, World!"

    return app
