/*****************************************************
* DSA annotations handling module
*****************************************************/
DigitalSlideArchive.Annotations = function(){
	init = function(viewer){
		var annotationState = window.annotationState = new AnnotationState();
		annotationState.setSeadragonViewer(viewer);
		annotation_setup_code(annotationState);
		return annotationState;
	},

	save = function(){

	},

	load = function(){

	},

	display = function(annotationState, annot){
		$("#annotation_list_table").append(
        	$("<tr>").attr('id', 'annot_' + annot.data.index).data("annot_index", annot.data.index).data("annot_obj", annot).append(
        		$("<td>").html(annot.data.type)).append(
					$("<td>").html(annot.data.label)).append(
						$("<td>").append(
                        	$("<button>").on("click", function() {
                            	$(this).parent().parent().data("annot_obj").detach();
                            		for (i = 0; i < annotationState.annotations.length; i++)
                                		if (annotationState.annotations[i])
                                    		if (annotationState.annotations[i].data.index == $(this).parent().parent().data("annot_index"))
                                        		annotationState.annotations[i] = null;
                            			if (!annotationState.annotations[annotationState.annotations.length - 1])
                                			annotationState.annotations.length -= 1;
                            			$(this).parent().parent().remove();
                        }).html("Remove")
                    )
                )
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
            
            $("#annot_" + annot.data.index).append(
            	$("<td>").html(annot.data.browser_info)
            ).append(
            	$("<td>").html(new Date(annot.data.annotation_timestamp))
            );
	};

	return{
		init: init,
		display: display
	}	
};
