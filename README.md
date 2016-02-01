openseadragon-annotations
=========================

Openseadragon annotation is a web application that gives users the ability to specify deep zoom image source and then be able to markup and annotate the images. As of the now the application provides the following features:

1. Markup images using predefined shapes: rectangule, circle, polygon, free hand and a point. In addition, the user can select a color for each markup.
2. Add layers to which markups are assigned. The user can add/update/delete layers.
3. From the markup window, users can update the markup name, change color using a color picker and assign a layer.

This branch only contains the client side application. Server side and web services are to be included in a different branch.

Dependencies
--------------------------
|Library| Version | Used for|
|-------|---------|---------|
|jQuery |2.1.4    |         |
|jQuery UI|1.11.4| |
|Bootstrap|3.3.5||
|Knockout|3.0.0||
|Openseadragon|2.1||
|openseadragon-scalebar|||
|openseadragon-imaginghelper|1.2||
|openseadragon-viewerinputhook|1.1.0||
|bootstrap-switch|3.3.2||
|Angular JS|1.4.9||


 
This repo inludes only the client side application for the annotation. Parts of the code were written in Angular JS and Bootstrap and the directory structire is changed to AngularJS based structure. The Python web service was removed from this repo and will be push to a new standalone repo to keep things separated.

This currently only works with a previous version of OpenSeaDragon 2.0.

The UI needs some work. Currently, the UI contains three modals:

1. Markup drawing tools: you can select a shape and color
2. Markup list: to list all annotations, udpate the color using a color picker and add markup name
3. Layers list: a modal to add and update layers

Within the OSD code, I generate an instance of my anntoator called

annotationState()


Once I drew some annotations I can do;
currentdataset = annotationState.storeAnnotations()

##Various functionality
To clear annotations you can call:
annotationState.clearAnnotations()

There's probably a cleaner way, but to save the data to the server, I did a 

myjson_as_a_string = JSON.stringy(currentdataset) 

This will which generate a string that I can push to the server;  I can also reverse this oepration by doing

JSON.parse(myjson_as_a_string)


Once I clear the data, if I run

annotationState.loadAnnotations(currentdataset)

it will reload the ROI's I just drew.  ROI's can also be drawn directly if I specify the JSON properly

Attatched to this object is annotationState.annotations that actually stores the annotation data I just created.

So after I draw a couple of objects, I issue the following from the javascript console:

currentDataSet = annotationState.storeAnnotation()
//This converts the individual annotations into a simpler JSON object for storing on the server.  I also need  to store additional metadata that actually tells me WHAT image the ROIs were drawn on

Current working features
---------------------------
1. Add markup including circle, rectangular, polygon and a point
2. Update markup color, name and layer
3. Add/delete/update layers

New features to work on
---------------------------
1. Save markups
2. Load markups
