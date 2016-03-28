from .routes import AnnotationsResource


# This loads the REST endpoints into Girder
def load(info):
    info['apiRoot'].annotations = AnnotationsResource()
