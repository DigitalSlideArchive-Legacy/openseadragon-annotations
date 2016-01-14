$(document).ready(function(){
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
