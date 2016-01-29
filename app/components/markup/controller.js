//Define a controller for markups
//Add window dependency
app.controller("markupCtrl", function($scope, $window){

	//Define scope variables
	$scope.markups = [];
	$scope.layers = [];
	$scope.index = 0;

	//Listen to changes for variable layers broadcasted
	//by the layer controller and update the $scope layer
	//variable
	$scope.$on('layers', function(events, args){
		$scope.layers = args;
		console.log(args);
	});

	/**
	 * Add new markup
	 * Add new markup to the list. This method takes in all markups to
	 * update the scope variable and then update the scope index
	 * @param {Object} markups
	 */
	$scope.add = function(markups){
		//Update the scope markups variable
		$scope.markups = markups;

		//Get the most recently added markup
		var newMarkup = $scope.markups[$scope.markups.length - 1].data; 

		//IMPORTANT: we need to keep both the annotation code assigned markup/annotation ID
		//in sync with the $scope.index value. This way when we remove a markup or update
		//we can reference both the $scope markup and the global JS variable annotationState.annotations
		//using the same index.
		$scope.index = newMarkup.index;
	};

	/**
	 * Update markup
	 * @param {Number} index
	 * @param {Object} markup
	 */
	$scope.update = function(index, markup){
		$window.annotationState.annotations[index].element.style.borderColor = markup.data.color;
		$window.annotationState.annotations[index].data.color = markup.data.color;
	};

	/**
	 * Remove markup
	 * @param {Number} index
	 */
	$scope.remove = function(index){
		$window.annotationState.annotations[index].detach();
		$scope.markups.splice(index, 1);
	};
});
