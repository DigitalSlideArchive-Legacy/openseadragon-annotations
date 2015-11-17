from flask import Flask, request, redirect, url_for, send_from_directory,jsonify
from werkzeug.wsgi import DispatcherMiddleware
import os
#from flask_crossdomains import crossdomain



app = Flask('dsa')


#application = DispatcherMiddleware( { '/backend': backend })

@app.route('/')
def root():
    return app.send_static_file('index.html')

## adding decorators to allow cross origin access

@app.route('/openseadragon_annotations/<path:path>')
def static_osd_files(path):
	"""Since I want to keep the main OSD annotation files separate from the mini flask app, I am adding a route 
	that points to that directory"""
	print "Routing from here"
	## This path is relative to the run_devel.py 
	rel_osd_annotation_path = '../src/'
	cur_cwd = os.getcwd()
	#print os.getcwd(),"is the current working directory"
	full_file_path =  os.path.join(cur_cwd,rel_osd_annotation_path, path) 
	#print os.path.isfile(full_file_path ),"is a file???",full_file_path
	## I could not get the send_static_file to work for some reason...
	return send_from_directory( os.path.join(cur_cwd, rel_osd_annotation_path), path )





@app.route('/static/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(os.path.join('.', path))






#@app.route('/<path:path>')
#def static_file(path):
#    return app.send_static_file(path)
