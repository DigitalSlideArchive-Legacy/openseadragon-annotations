openseadragon-annotations
=========================
I have set up a testing environment for local development using Python/Flask

To run this code, first make sure your python environment has Flask available, I am using the Anaconda Python Distribution

Then cd into the dev_testing/ directory and type python app.py

Then open your local browser to localhost:5001  (Port can be changed in the app.py if desired)

#Create Python Environment
conda create --name osd-annotations flask
source activate osd-annotations




#Requirements
For now I am linking to the OSD 2.1.0 src on GitHub







Attatched to this object is annotationState.annotations that actually stores the annotation data I just created.

So after I draw a couple of objects, I issue the following from the javascript console:

currentDataSet = annotationState.storeAnnotation()
//This converts the individual annotations into a simpler JSON object for storing on the server.  I also need  to store additional metadata that actually tells me WHAT image the ROIs were drawn on






As a simple example, the following code will load four shapes onto the Canvas:





