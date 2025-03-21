from flask import Flask, request, Response

app = Flask(__name__)

TEST = False

@app.route("/")
def hello_world():
    if TEST:
        return "<p>Recieved</p>"

    else:
        return "<p>No</p>"

@app.post('/json')
def json():
    try:
        Test = request.get_json()
        print(Test)
        return
    except:
        pass


