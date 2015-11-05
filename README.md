openseadragon-annotations
=========================
This currently only works with a previous version of OpenSeaDragon 1.0.0;  I will be upgrading this to work with the 2.0 version ASAP


In your index.html you need to add the following two includes:

<script type="text/javascript" src="openseadragon-annotations/annotations.js"></script>
<script type="text/javascript" src="js/annotationState_control_functions.js"></script>


jQuery is also a dependency and so is jQueryUI;  In order to do annotation(s) you need to have some sort of widget/modal that pops up to allow the user to select the shape primitive

This same functionality can also be used to load previously saved annotations back onto the OSD Canvas.


As a simple example, the following code will load four shapes onto the Canvas:





