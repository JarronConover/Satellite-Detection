import os
from flask import Flask, jsonify, g
from flaskr.db import get_db, init_db
from .aisstream import AISClient, AISDataStore


def create_app(config_filename=None):
    app = Flask(__name__, instance_relative_config=True)
    # Load default config
    app.config.from_mapping(
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
        AISSTREAM_API_KEY=None,
    )
    # Override with file or env
    if config_filename:
        app.config.from_pyfile(config_filename, silent=True)

    init_db(app)

    # Setup AIS client
    store = AISDataStore()
    bounding = [[[37.8038, -122.4050], [37.5860, -122.1245]]]
    client = AISClient(store, bounding, api_key=app.config.get('AISSTREAM_API_KEY'))
    client.start()

    # Make store available in request context
    @app.before_request
    def attach_ais():
        g.ais = store

    # Register blueprints
    from flaskr.views import bp as main_bp
    app.register_blueprint(main_bp)

    return app

# For local debugging
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)

