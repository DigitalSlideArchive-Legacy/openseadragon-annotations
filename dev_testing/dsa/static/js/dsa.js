var dsa = (function() {
	
})(dsa || {});
var dsa = dsa || {};

/*****************************************************
* DSA image handling module
*****************************************************/
dsa.image = (function(){
	 
	//public methods
	return{
		loadThumbnail: function(data) {
			$("#thumbnail_img").attr('src', data.file_thumbnail);
		},

		initViewer: function(data){
			viewer = OpenSeadragon({
				id: "image_viewer",
		        prefixUrl: "static/imgs/",
				tileSources: data.filename_url
		    });
		}
	};
})();

/*****************************************************
* DSA annotations handling module
*****************************************************/
dsa.annotation = (function(){
	save = function(){

	},

	load = function(){

	},

	display = function(){

	}	
})();

