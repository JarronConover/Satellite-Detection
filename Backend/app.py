from flask import Flask, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

# Test route to confirm API works
@app.route("/", methods=["GET"])
def home():
    return "<h1>Hello from Flask!</h1>"

# API endpoint for React to fetch data
@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify({"message": "Hello from Flask! This is your data."})

if __name__ == "__main__":
    app.run(debug=True)