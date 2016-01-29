$(document).ready(function(){
	var viewer = DSAViewer.getViewer();
		var annotationState = window.annotationState = new AnnotationState();
		annotationState.setSeadragonViewer(viewer);
		annotation_setup_code(annotationState);
	
		$(annotationState).on("annotationAdded", function(e) {

			//Once an annotation is added update the markup controller variable
    		var scope = angular.element(document.getElementById("annotation_list_ctrl")).scope();
			
			//Add new markup
			//Use $apply, which will trigger, $digest and $watch to update all scope variables.
			scope.$apply(function () {
				scope.add(annotationState.annotations);
			});
	});

	$("#viewport_properties_modal").draggable({
      handle: ".modal-header"
	});

	$("#annotations_modal").draggable({
      handle: ".modal-header"
	});

	$("#draw_tools_modal").draggable({
      handle: ".modal-header"
	});

	$("#layers_modal").draggable({
      handle: ".modal-header"
	});

	$("#save_layer_btn").click(function(e){
		var newLayer = new layer({
				name: $("#new_layer_name").val(),
				description: $("#new_layer_description").val(),
				imageId: selectedImageId
			});
	});
});
