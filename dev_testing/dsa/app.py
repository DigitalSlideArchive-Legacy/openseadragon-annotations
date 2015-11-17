from flask import Flask, request, redirect, url_for, send_from_directory,jsonify
from werkzeug.wsgi import DispatcherMiddleware

#from flask_crossdomains import crossdomain



app = Flask('dsa')


#application = DispatcherMiddleware( { '/backend': backend })

@app.route('/')
def root():
    return app.send_static_file('index.html')

## adding decorators to allow cross origin access


@app.route('/static/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(os.path.join('.', path))


#@app.route('/<path:path>')
#def static_file(path):
#    return app.send_static_file(path)
