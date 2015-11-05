openseadragon-annotations
=========================
This currently only works with a previous version of OpenSeaDragon 1.0.0;  I will be upgrading this to work with the 2.0 version ASAP


In your index.html you need to add the following two includes:

<script type="text/javascript" src="openseadragon-annotations/annotations.js"></script>
<script type="text/javascript" src="js/annotationState_control_functions.js"></script>


jQuery is also a dependency and so is jQueryUI;  In order to do annotation(s) you need to have some sort of widget/modal that pops up to allow the user to select the shape primitive

This same functionality can also be used to load previously saved annotations back onto the OSD Canvas.


So within the OSD code, I generate an instance of my anntoator called

annotationState()


Once I drew some annotations I can do;
currentdataset = annotationState.storeAnnotations()

##Various functionality
To clear annotations you can call:
annotationState.clearAnnotations()

There's probably a cleaner way, but to save the data to the server, I did a 

myjson_as_a_string = JSON.stringy(currentdataset) 

## This will which generate a string that I can push to the server;  I can also reverse this oepration by doing

JSON.parse(myjson_as_a_string)


# Once I clear the data, if I run

annotationState.loadAnnotations(currentdataset)

it will reload the ROI's I just drew.  ROI's can also be drawn directly if I specify the JSON properly










Attatched to this object is annotationState.annotations that actually stores the annotation data I just created.

So after I draw a couple of objects, I issue the following from the javascript console:

currentDataSet = annotationState.storeAnnotation()
//This converts the individual annotations into a simpler JSON object for storing on the server.  I also need  to store additional metadata that actually tells me WHAT image the ROIs were drawn on






As a simple example, the following code will load four shapes onto the Canvas:





