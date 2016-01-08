/*****************************************************
* DSA image handling module
*****************************************************/
DigitalSlideArchive.Viewer = function(){
	var viewer;
	var slides;
	var annotations = {};

	init = function(data){
		slides = data;

		viewer = OpenSeadragon({
			id: "image_viewer",
		    prefixUrl: "static/imgs/",
			tileSources: data[0].filename_url
		});

		viewer.scalebar({
			type: OpenSeadragon.ScalebarType.MAP,
			pixelsPerMeter: 3.356,
			minWidth: "75px",
			location: OpenSeadragon.ScalebarLocation.BOTTOM_LEFT,
			xOffset: 5,
			yOffset: 10,
			stayInsideImage: true,
			color: "rgb(150, 150, 150)",
			fontColor: "rgb(100, 100, 100)",
			backgroundColor: "rgba(255, 255, 255, 0.5)",
			fontSize: "small",
			barThickness: 2
		});
	
		loadThumbnail();
		$("#image_viewer").attr({"slide-id": data[0].id});

		return viewer;
	},
 
	loadThumbnail = function() {
		slides.forEach(function(slide){
			$("#img_thumbnails")
				.append($("<img/>")
					.attr({src: slide.file_thumbnail, width: "30%"})
					.addClass("img-thumbnail")
					.click(function(){
						var currentSlideId = $("#image_viewer").attr("slide-id");
						switchAnnotations(slide.id, currentSlideId);

						viewer.open(slide.filename_url);
						$("#image_viewer").attr({"slide-id": slide.id});
					})
				)
		});
	},

	switchAnnotations = function(newSlideId, oldSlideId){
		//on changing slide
		//associate current annotations with the previous slide Id
		annotations[oldSlideId] = annotationState.annotations;
		
		//clear the annotation state
		annotationState.clearAnnotations();

		//check the new slide has existing annotations
		//if so load the existing annotations


		//else clear the annotation state

	};

	return{
		init: init,
		annotations: annotations
	}
};

