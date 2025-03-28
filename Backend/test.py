from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TEST = False

@app.route("/")
def hello_world():
    if TEST:
        return "<p>Recieved</p>"

    else:
        return "<p>No</p>"

@app.post('/json')
def json():
    pass