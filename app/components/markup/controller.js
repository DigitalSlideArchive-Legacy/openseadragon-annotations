//Define a controller for markups
//Add window dependency
app.controller("markupCtrl", function($scope, $window){

	//Define scope variables
	$scope.markups = [];
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
	$scope.update = function(index, markup){
		$scope.layers[$scope.activeLayerIndex].markups[index].element.style.borderColor = markup.data.color;
		$scope.layers[$scope.activeLayerIndex].markups[index].data.color = markup.data.color
	};

	/**
	 * Remove markup
	 * @param {Number} index
	 */
	$scope.remove = function(index){
		var antIndex = $scope.getAnnotationIndex(index);
		$window.annotationState.annotations[antIndex].detach();
		$window.annotationState.annotations.splice(antIndex, 1);
		delete $scope.layers[$scope.activeLayerIndex].markups[index];
		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$emit('layers', obj);
	};

	/**
	 * Get the annotation index based on the markup.index value
	 * @param {Number} index
	 */
	$scope.getAnnotationIndex = function(index){
		var ants = $window.annotationState.annotations;

		for(var i=0;i<ants.length;i++)
			if(ants[i].data.index == index)
				return i
			
		return null;
	};
});
