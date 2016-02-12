//Define a controller for Aperio
app.controller("aperioCtrl", function($scope, $http, $window){

	$scope.url = "http://node15.cci.emory.edu/LGG_LiveDev/XML_FILES/TCGA-06-0137-01A-01-BS1.xml";
	$scope.layers = [];

	$scope.import = function(){
		$scope.readXML();
	};

	$scope.readXML = function(){
		$http({
			method: 'GET',
			url: $scope.url
		}).then(function successCallback(response){
			$('Annotation', response.data).each(function() {
				layerId = this.getAttribute("Id");
				color = this.getAttribute("LineColor").toString(16);
				color = (color.length < 6) ? "0" + color : color;

				$('Region', this).each(function() {
					$scope.getRegionMarkups(this, color);
				});
    		});
		}, function errorCallback(response){

		});
	};

	$scope.getRegionMarkups = function(vertices, color){
		$('Vertices', vertices).each(function() {
			var points = [];
			$('Vertex', this).each(function() {
				var pt = new OpenSeadragon.Point();
				pt.x = this.getAttribute("X");
				pt.y = this.getAttribute("Y");
				var point = $window.DSAViewer.getViewer().viewport.imageToViewportCoordinates(pt);
				points.push(point);
        	});

			var overlay_obj = {
				type: 'freehand',
				index: 0,
				label: "0",
				points: points,
				color: color,
				alpha: 1
			};

			overlay = $window.AnnotationOverlay.fromValueObject(overlay_obj);
        	overlay.attachTo($window.DSAViewer.getViewer());
			$window.annotationState.annotations.push(overlay);
		});
	}
});
