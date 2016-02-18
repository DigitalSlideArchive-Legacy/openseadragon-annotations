//Define a controller for Aperio
app.controller("aperioCtrl", function($scope, $rootScope, $http, $window, layerService){

	//Intialize scope variables
	$scope.url = "http://node15.cci.emory.edu/LGG_LiveDev/XML_FILES/TCGA-06-0137-01A-01-BS1.xml";
	$scope.index = 0;

	/**
	 * Import Aperio XML file
	 */
	$scope.import = function(){
		//clear existing annotations for the current image
		$window.annotationState.clearAnnotations();
		
		//read the XML file
		$scope.readXML();
	};

	/**
	 * Read the Aperio XML file
	 * Parse the annotations from the XML file and populate the layers and markups
	 */
	$scope.readXML = function(){
		layers = [];

		//Send HTTP request to read the XML file
		$http({
			method: 'GET',
			url: $scope.url
		}).then(function successCallback(response){
			var layerIndex = 0;

			//for every annotation create a layers and add markups
			$('Annotation', response.data).each(function() {
				color = this.getAttribute("LineColor").toString(16);
				color = $scope.rgb2hex(color);

				//we treat every region as a layer in DSA
				$('Region', this).each(function() {
					//create layer with default options 
					//add layer ID, name and creation time
					layerObj = angular.merge(
						angular.copy(layerService.options),
						{id: layerIndex, name: this.getAttribute("Id"), createdTime: new Date().toISOString()});
					
					//add markups to the layer
					layerObj.markups = $scope.getRegionMarkups(this, color);
					layers[layerIndex] = layerObj;
					layerIndex++;
				});
    		});
			
			//when done broadcast the layers
			//this will be read by the layers controller
			$rootScope.$broadcast("aperioLayers", layers);
		}, function errorCallback(response){

		});

		
	};

	/**
	 * Parse markups for a given region
	 * @param {obj} vertices 
	 * @param {string} color
	 */
	$scope.getRegionMarkups = function(vertices, color){
		var markups = {};

		//each set of vertices represents a markup
		$('Vertices', vertices).each(function() {
			var points = [];

			//push the vertix points to points array
			$('Vertex', this).each(function() {
				//create openseadragon Point object with the (X, Y) coordinated from Aperio vertix
				//Aperio uses image coordinates
				var pt = new OpenSeadragon.Point(Number(this.getAttribute("X")), Number(this.getAttribute("Y")));

				//convert the Aperio image coordinates to openseadragon viewport coordinates
				var point = $window.DSAViewer.getViewer().viewport.imageToViewportCoordinates(pt);
				points.push(point);
        	});

			//create overlay
			var overlayObj = {
				type: 'freehand',
				index: $scope.index,
				label: String($scope.index),
				points: points,
				color: color,
				alpha: 1
			};

			overlay = $window.AnnotationOverlay.fromValueObject(overlayObj);

			//attach the overlay to the viewer
        	overlay.attachTo($window.DSAViewer.getViewer());

			//add the overlay to the annotations array
			$window.annotationState.annotations.push(overlay);
			markups[$scope.index] = overlay;
			$scope.index++;
		});

		return markups;
	};

	/**
	 * Convert RGB to HEX color codes
	 */
	$scope.rgb2hex = function (rgb) {
		rgb = "0".repeat(9 - rgb.length) + rgb;
		var r = parseInt(rgb.substring(0,3));
		var g = parseInt(rgb.substring(3,3));
		var b = parseInt(rgb.substring(7,3));
    
		var h = b | (g << 8) | (r << 16);
		return '#' + "0".repeat(6 - h.toString(16).length) + h.toString(16);
	}
});
