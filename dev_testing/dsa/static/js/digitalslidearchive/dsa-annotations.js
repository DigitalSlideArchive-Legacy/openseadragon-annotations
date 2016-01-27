/*****************************************************
* DSA annotations handling module
*****************************************************/
var DSAAnnotations = (function(){
	
	$(document).ready(function() {	
		var viewer = DSAViewer.getViewer();
		var annotationState = window.annotationState = new AnnotationState();
		annotationState.setSeadragonViewer(viewer);
		annotation_setup_code(annotationState);
	
		$(annotationState).on("annotationAdded", function(e) {
    		var scope = angular.element(document.getElementById("annotation_list_ctrl")).scope();
			scope.$apply(function () {
				var ants = annotationState.annotations;
				scope.markups = ants;
				scope.index = ants[ants.length - 1].data.index;
			});

		});
	});

	save = function(){
	
	},

	load = function(){

	},

	display = function(annotationState){
		//show overview of the annotations in the bootstrap accordion
		/*$("#annotation_list_table").html("");
		
		for (i = 0; i < annotationState.annotations.length; i++){
			annot = annotationState.annotations[i];

		$("#annotation_list_table").append(
        	$("<tr>").attr('id', 'annot_' + annot.data.index).data("annot_index", annot.data.index).data("annot_obj", annot).append(
        		$("<td>").html(annot.data.type + " (" + annot.data.label + ")"))
            );

			            //To change color, only for rectangle and circle as of now
            //TODO change color names to color codes if needed
            if (annot.data.type == 'rect' || annot.data.type == 'circle'){
            	var col;
                $("#annot_" + annot.data.index).append(
                    $("<td>").append(
                        $("<select>").append(
                        	$("<option>").attr("value","#FF0000").html("&nbsp;&nbsp;").css("background-color","#FF0000")
                        ).append(
                        	$("<option>").attr("value","#00FF00").html("&nbsp;&nbsp;").css("background-color","#00FF00")
                        ).append(
                        	$("<option>").attr("value","#0000FF").html("&nbsp;&nbsp;").css("background-color","#0000FF")
                        ).append(
                        	$("<option>").attr("value","#FFFF00").html("&nbsp;&nbsp;").css("background-color","#FFFF00")
                        ).on("change", function() {
                            $(this).parent().parent().data("annot_obj").element.style.borderColor = this.value;
                            $(this).parent().parent().data("annot_obj").data.color = this.value;
                            $(this).css("background-color",this.options[this.selectedIndex].style.backgroundColor);
                        }).css("background-color",annot.data.color)
                    )
                );
            }
            else
            	$("#annot_" + annot.data.index).append(
                    $("<td>")
                );

			//Append the name input field
			var layersDropDown = $('<select>');
			$.each(layers, function(k, v){
				layersDropDown.append($("<option>").attr("value", k).html(k));
			});

			$("#annot_" + annot.data.index).append(
				$("<td>").append(layersDropDown)).append(
				$("<td>").append($("<input/>").attr({type: "text"}))
			);
		
			//Append the delete button
			$("#annot_" + annot.data.index).append(
				$("<td>").append(
                	$("<img/>").on("click", function() {
                            	$(this).parent().parent().data("annot_obj").detach();
								//$("#annotfull_" + $(this).parent().parent().data("annot_index")).remove();
                            		for (i = 0; i < annotationState.annotations.length; i++)
                                		if (annotationState.annotations[i])
                                    		if (annotationState.annotations[i].data.index == $(this).parent().parent().data("annot_index"))
                                        		annotationState.annotations[i] = null;
                            			if (!annotationState.annotations[annotationState.annotations.length - 1])
                                			annotationState.annotations.length -= 1;
                            			$(this).parent().parent().remove();
					}).attr({src:"openseadragon_annotations/drawing_icons/delete.png"}).addClass("annot_delete_icon")
				)
			);
		}*/
	};

	return{
		display: display,
		getAnnotationState: function() {return annotationState;}
	}	
}(DSAViewer.getViewer(), window));
