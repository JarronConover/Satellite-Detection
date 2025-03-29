from flask import Flask
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

if __name__ == "__main__":
    app.run(debug=True)