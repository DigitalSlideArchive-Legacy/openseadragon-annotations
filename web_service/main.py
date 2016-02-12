from flask import Flask
from flask.ext.cors import CORS
from routes import dsa

app = Flask('dsa')
app.register_blueprint(dsa)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

app.run(host='0.0.0.0', port=5003, debug=True)
