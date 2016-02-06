from flask import Blueprint, request, jsonify
import pymongo

client = pymongo.MongoClient('localhost',27017)
db = client.TCGA_Slide_DB
dsa = Blueprint('dsa', __name__)

@dsa.route('/annotations', methods=['POST','OPTIONS'])
def add_annotation():
	ant = db.annotations

	if request.json == None:
		return jsonify({"status": "failure", "code": 404})

	for a in request.json:
		ant.insert_one(a)

	return jsonify({"status": "created", "code": 201})

@dsa.route('/annotations', methods=['GET','OPTIONS'])
def get_annotation():
	created_by = request.args.get("user_id")
	image_id = request.args.get("image_id")
	annotation = db.annotations.find({"createdBy": created_by, "imageId": image_id}).sort([("_id", 1)]).limit(1)[0]
	annotation['_id'] = str(annotation['_id'])
	return jsonify({"status": "success", "code": 200, "layers": annotation})
