var markupScope;
var layerScope;
var imageScope;

$(document).ready(function(){
	var viewer = DSAViewer.getViewer();
	var annotationState = window.annotationState = new AnnotationState();
	annotationState.setSeadragonViewer(viewer);
	annotation_setup_code(annotationState);

	//Layer andmarkup scope
	markupScope = angular.element(document.getElementById("markup_ng_controller")).scope();
	layerScope = angular.element(document.getElementById("layer_ng_controller")).scope();
	imageScope = angular.element(document.getElementById("image_ng_controller")).scope();

	$(annotationState).on("annotationAdded", function(e) {
		//Add new markup
		//Use $apply, which will trigger, $digest and $watch to update all scope variables.
		markupScope.$apply(function () {
			markupScope.add(annotationState.annotations[annotationState.annotations.length - 1]);
		});
	});

	$("#viewport_properties_modal").draggable({
		handle: ".modal-header"
	});

	$("#layers_modal").draggable({
		handle: ".modal-header"
	});

	$("#aperio_import_modal").draggable({
		handle: ".modal-header"
	});
});
