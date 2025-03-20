from flask import Flask

app = Flask(__name__)

TEST = false

@app.route("/")
def hello_world():
    if TEST:
        return "<p>Recieved</p>"

    else:
        return "<p>No</p>"

@app.post('/json')
def json():
    