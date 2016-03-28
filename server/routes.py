from girder.api import access
from girder.api.describe import describeRoute, Description
from girder.api.rest import Resource, RestException

import pymongo

client = pymongo.MongoClient('localhost', 27017)
db = client.TCGA_Slide_DB


class AnnotationsResource(Resource):
    def __init__(self):
        super(AnnotationsResource, self).__init__()
        self.resourceName = 'annotations'

        self.route('POST', (), self.add_annotation)
        self.route('GET', (), self.get_annotation)

    @access.public
    @describeRoute(
        Description('Add or change annotations')
        .param('body', 'A JSON list of annotations to set.  Each item in the '
               'list must be an object with imageId and createdBy.')
        .errorResponse('Invalid JSON passed in request body.')
    )
    def add_annotation(self, params):
        reqjson = self.getBodyJson()
        ants = db.annotations
        layers = db.layers
        layer_ids = []

        if reqjson is None:
            raise RestException('No JSON data')

        for a in reqjson:
            layer_id = ants.insert_one(a).inserted_id
            layer_ids.append(layer_id)

        layers.insert_one({
            "createdBy": reqjson[0]['createdBy'],
            "imageId": reqjson[0]['imageId'],
            "layers": layer_ids
        })

        return {"status": "created", "code": 201}

    @access.public
    @describeRoute(
        Description('Get annotations')
        .param('user_id', 'The ID of the user who created the annotations.',
               required=True)
        .param('image_id', 'The ID of the image with the annotations.',
               required=True)
    )
    @access.public
    def get_annotation(self, params):
        created_by = params.get("user_id")
        image_id = params.get("image_id")
        layers = []

        data = db.layers.find({"createdBy": created_by, "imageId": image_id},
                              {"_id": 0}).sort([("_id", -1)]).limit(1)

        if data.count() > 0:
            data = data[0]

            for layer_id in data['layers']:
                ant = db.annotations.find_one({"_id": layer_id}, {"_id": 0})
                layers.append(ant)

            return {"status": "success", "code": 200, "layers": layers}
        return {"status": "success", "code": 404}
