``` bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask --app flaskr init-db

export FLASK_APP="flaskr:create_app"
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=8000
```