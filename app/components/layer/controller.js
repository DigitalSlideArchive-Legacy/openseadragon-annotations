//Define a controller for layers
//Add root scope dependency
app.controller("layersCtrl", function($scope){

	//Define scope variables
	$scope.layers = [];
	$scope.index = 0;
	$scope.activeLayerIndex = 0;
	
	$scope.options = {
		id: null,
		name: $scope.index,
		description: null,
		color: null,
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
		console.log("Emit from markups to layer ");
		console.log(args);
		console.log($scope.activeLayerIndex);
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
		console.log("broadcast active index " + $scope.activeLayerIndex);
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
		$scope.layers[$scope.activeLayerIndex].color = $scope.activeLayer.color;
	};

	/**
	 * Set active layer
	 * Set the active layer index and the active layer data
	 * @param {Number} index
	 */
	$scope.setActiveLayer = function(index){
		$scope.activeLayerIndex = index;
		$scope.activeLayer = $scope.layers[$scope.activeLayerIndex];
		console.log("broadcast active index " + $scope.activeLayerIndex);

		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$broadcast('layers', obj);
	};
});
