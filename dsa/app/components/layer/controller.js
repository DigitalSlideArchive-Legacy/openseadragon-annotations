app.controller("layersCtrl", function($rootScope, $scope){
	$scope.layers = [];
	$scope.index = 0;
	$scope.options = {
		id: null,
		name: null,
		description: null,
		imageId: null,
		createdBy: null,
		createdTime: new Date().toISOString(),
		attributes: {},
		markup: []
	};

	$scope.add = function(){
		var opt = angular.merge(
						angular.copy($scope.options), 
						{id: $scope.index}
				);
		
		$scope.layers.push(opt);
		$rootScope.$broadcast('layers', $scope.layers);
		$scope.index++;
	};

	$scope.remove = function(index){
		$scope.layers.splice(index, 1);
	};

	$scope.update = function(index, layer){
		$scope.layers[index].name = layer.name;
		$scope.layers[index].description = layer.description;

		console.log($scope.layers);
	}
});
