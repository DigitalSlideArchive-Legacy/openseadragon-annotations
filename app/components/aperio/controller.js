//Define a controller for Aperio
app.controller("aperioCtrl", function($scope, $rootScope, $http, $window, layerService){

	$scope.url = "http://node15.cci.emory.edu/LGG_LiveDev/XML_FILES/TCGA-06-0137-01A-01-BS1.xml";
	$scope.index = 0;

	$scope.import = function(){
		$window.annotationState.clearAnnotations();
		$scope.readXML();
	};

	$scope.readXML = function(){
		layers = [];
		$http({
			method: 'GET',
			url: $scope.url
		}).then(function successCallback(response){
			var layerIndex = 0;
			$('Annotation', response.data).each(function() {
				color = this.getAttribute("LineColor").toString(16);
				color = (color.length < 6) ? "0" + color : color;

				$('Region', this).each(function() {
					layerObj = angular.merge(
						angular.copy(layerService.options),
						{id: layerIndex, name: this.getAttribute("Id"), createdTime: new Date().toISOString()});
					
					layerObj.markups = $scope.getRegionMarkups(this, color);
					layers[layerIndex] = layerObj;
					layerIndex++;
				});
    		});
			
			$rootScope.$broadcast("aperioLayers", layers);
		}, function errorCallback(response){

		});

		
	};

	$scope.getRegionMarkups = function(vertices, color){
		var markups = {};

		$('Vertices', vertices).each(function() {
			var points = [];

			$('Vertex', this).each(function() {
				var pt = new OpenSeadragon.Point(Number(this.getAttribute("X")), Number(this.getAttribute("Y")));
				var point = $window.DSAViewer.getViewer().viewport.imageToViewportCoordinates(pt);
				points.push(point);
        	});

			var overlayObj = {
				type: 'freehand',
				index: $scope.index,
				label: String($scope.index),
				points: points,
				color: color,
				alpha: 1
			};

			overlay = $window.AnnotationOverlay.fromValueObject(overlayObj);
        	overlay.attachTo($window.DSAViewer.getViewer());
			$window.annotationState.annotations.push(overlay);
			markups[$scope.index] = overlay;
			$scope.index++;
		});

		return markups;
	}
});
