//Define a controller for layers
//Add root scope dependency
app.controller("layersCtrl", function($rootScope, $scope){

	//Define scope variables
	$scope.layers = [];
	$scope.index = 0;
	$scope.activeLayerIndex = 0;

	$scope.options = {
		id: null,
		name: null,
		description: null,
		color: null,
		imageId: null,
		createdBy: null,
		createdTime: new Date().toISOString(),
		attributes: {},

		//Place to hold all markups assigned to this layer
		markup: []
	};

	/**
	 * Add new layer
	 * Add new layer and broadcast the scope layer variables
	.* to the root scope so it can be used by markup controller
	 */
	$scope.add = function(){
		var opt = angular.merge(
						angular.copy($scope.options), 
						{id: $scope.index, name: $scope.layer.name}
				);
		
		$scope.layers.push(opt);
		$rootScope.$broadcast('layers', $scope.layers);
		$scope.index++;
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
	};
});
