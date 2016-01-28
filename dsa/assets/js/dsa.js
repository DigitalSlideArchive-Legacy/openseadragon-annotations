$(document).ready(function(){
	var viewer = DSAViewer.getViewer();
		var annotationState = window.annotationState = new AnnotationState();
		annotationState.setSeadragonViewer(viewer);
		annotation_setup_code(annotationState);
	
		$(annotationState).on("annotationAdded", function(e) {
    		var scope = angular.element(document.getElementById("annotation_list_ctrl")).scope();
			scope.$apply(function () {				
				//var ants = annotationState.annotations;
				scope.add(annotationState.annotations);
				//scope.markups = ants;
				//scope.index = ants[ants.length - 1].data.index;
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
