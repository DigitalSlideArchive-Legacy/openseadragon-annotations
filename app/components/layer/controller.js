//Define a controller for layers
//Add root scope dependency
app.controller("layersCtrl", function($scope, $window, $http, markupService){

	//Define scope variables
	$scope.layers = [];
	$scope.index = 0;
	$scope.activeLayerIndex = 0;

	$scope.options = {
		id: null,
		name: $scope.index,
		description: null,
		imageId: "Unknown",
		createdBy: "Guest",
		createdTime: null,
		attributes: {},

		//Place to hold all markups assigned to this layer
		markups: {}
	};

	$scope.$on('layers', function(events, args){
		$scope.layers = args.layers;
		$scope.activeLayerIndex = args.activeLayerIndex;
	});

	/**
	 * Add new layer
	 * Add new layer and broadcast the scope layer variables
	.* to the root scope so it can be used by markup controller
	 */
	$scope.add = function(){
		var opt = angular.merge(
						angular.copy($scope.options), 
						{id: $scope.index, name: $scope.options.name, createdTime: new Date().toISOString()}
				);
		
		$scope.layers.push(opt);
		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$broadcast('layers', obj);
		$scope.index++;
		$scope.options.name = $scope.index;
	};

	/**
	 * Remove layer
	 * @param {Number} index (layer index or ID)
	 */
	$scope.remove = function(index){
		var markups = $scope.layers[index].markups;
		for(var i in markups){
			markup = markups[i];
			var antIndex = markupService.getAnnotationIndex(markup.data.index);
			$window.annotationState.annotations.splice(antIndex, 1);
			markup.detach();
		}

		$scope.layers.splice(index, 1);
	};

	/**
	 * Update layer attributes
	 * @param {Number} index
	 * @param {Object} layer
	 */
	$scope.update = function(){
		$scope.layers[$scope.activeLayerIndex].name = $scope.activeLayer.name;
		$scope.layers[$scope.activeLayerIndex].description = $scope.activeLayer.description;
		
		var markups = $scope.layers[$scope.activeLayerIndex].markups;
		for(var index in markups){
			markup = markups[index];
			markup.element.style.borderColor = $scope.activeLayer.color;
			markup.data.color = $scope.activeLayer.color;
		}
	};

	/**
	 * Set active layer
	 * Set the active layer index and the active layer data
	 * @param {Number} index
	 */
	$scope.setActiveLayer = function(index){
		$scope.activeLayerIndex = index;
		$scope.activeLayer = $scope.layers[$scope.activeLayerIndex];
		
		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$broadcast('layers', obj);
	};

	/**
	 * Clean the layers data structure
	 *   1. Remove empty layers
	 *   2. Only include the "data" field for each markup
	 **/ 
	$scope.cleanup = function(){
		var data = [];
		var i = 0;

		angular.forEach($scope.layers, function(layer, index){
			if(Object.keys(layer.markups).length > 0){
				data[i] = $.extend({}, layer);
				data[i].markups = [];

				angular.forEach(layer.markups, function(markup, markupIndex){
					data[i].markups.push(angular.copy(markup.data));
				});
				i++;
			}
		});

		return data;
	};

	/**
	 * Save the layers to a remote database
	 */
	$scope.save = function(){
		var data = $scope.cleanup();
		
		$http({
			method: 'POST',
			url: 'http://localhost:5003/annotations',
			data: data
		});
	};

	/**
	 * Load layers and markups from data source
	 */
	$scope.load = function(){
		$http({
			method: 'GET',
			url: 'http://localhost:5003/annotations?user_id=Guest&image_id=TCGA-06-0137-01A-01-BS1',
		}).then(function successCallback(response){
			console.log(response.data.layers.markups);
			$window.annotationState.loadAnnotations(response.data.layers.markups);
		}, function errorCallback(response){

		});
	}
});
