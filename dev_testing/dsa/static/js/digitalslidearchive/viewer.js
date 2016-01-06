/*****************************************************
* DSA image handling module
*****************************************************/
DigitalSlideArchive.Viewer = function(){
	
	init = function(data){
		var viewer = OpenSeadragon({
			id: "image_viewer",
		    prefixUrl: "static/imgs/",
			tileSources: data.filename_url
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

		return viewer;
	},
		 
	loadThumbnail = function(data) {
		$("#thumbnail_img").attr('src', data.file_thumbnail);
	};

	return{
		loadThumbnail: loadThumbnail,
		init: init
	}
};

