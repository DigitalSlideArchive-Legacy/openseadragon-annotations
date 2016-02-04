//Define a controller for markups
//Add window dependency
app.controller("markupCtrl", function($scope, $window, markupService){

	//Define scope variables
	$scope.layers = [];
	$scope.activeLayerIndex = 0;
	$scope.index = 0;

	//Listen to changes for variable layers broadcasted
	//by the layer controller and update the $scope layer
	//variable
	$scope.$on('layers', function(events, args){
		$scope.layers = args.layers;
		$scope.activeLayerIndex = args.activeLayerIndex;
	});

	/**
	 * Add new markup
	 * Add new markup to the list. This method takes in all markups to
	 * update the scope variable and then update the scope index
	 * @param {Object} markups
	 */
	$scope.add = function(markup){ 
		$scope.layers[$scope.activeLayerIndex].markups[markup.data.index] = markup;
		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$emit('layers', obj);
	};

	/**
	 * Update markup
	 * @param {Number} index
	 * @param {Object} markup
	 */
	$scope.update = function(markup){
		markup.element.style.borderColor = markup.data.color;
		markup.data.color = markup.data.color;
		markup.data.name = markup.data.name;
	};

	/**
	 * Remove markup
	 * @param {Number} index
	 */
	$scope.remove = function(index){
		var antIndex = markupService.getAnnotationIndex(index);
		$window.annotationState.annotations[antIndex].detach();
		$window.annotationState.annotations.splice(antIndex, 1);
		delete $scope.layers[$scope.activeLayerIndex].markups[index];
		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$emit('layers', obj);
	};
});
