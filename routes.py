from flask import Blueprint, request, jsonify
import pymongo

client = pymongo.MongoClient('localhost',27017)
db = client.TCGA_Slide_DB
dsa = Blueprint('dsa', __name__)

@dsa.route('/annotations', methods=['POST','OPTIONS'])
def add_annotation():
	ants = db.annotations
	layers = db.layers
	layer_ids = []

	if request.json == None:
		return jsonify({"status": "failure", "code": 404})

	for a in request.json:
		layer_id = ants.insert_one(a).inserted_id
		layer_ids.append(layer_id)

	layers.insert_one({
		"createdBy": request.json[0]['createdBy'],
		"imageId": request.json[0]['imageId'],
		"layers": layer_ids
	})

	return jsonify({"status": "created", "code": 201})

@dsa.route('/annotations', methods=['GET','OPTIONS'])
def get_annotation():
	created_by = request.args.get("user_id")
	image_id = request.args.get("image_id")
	data = db.layers.find({"createdBy": created_by, "imageId": image_id}).sort([("_id", 1)]).limit(1)[0]
	layers = []

	for layer_id in data['layers']:
		ant = db.annotations.find_one({"_id": layer_id})
		ant['_id'] = str(ant['_id'])
		layers.append(ant)

	return jsonify({"status": "success", "code": 200, "layers": layers})
