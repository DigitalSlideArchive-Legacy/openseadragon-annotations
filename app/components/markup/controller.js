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
		console.log("Broadcast from layers to markups ");
		console.log(args);
		console.log($scope.activeLayerIndex);
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

		//console.log("Add new markup with index = " + newMarkup.index + " for active layer index " + $scope.activeLayerIndex);
		//console.log($scope.layers[$scope.activeLayerIndex].markups);
		$scope.layers[$scope.activeLayerIndex].markups[newMarkup.index] = newMarkup;
		//console.log($scope.layers);

		//IMPORTANT: we need to keep both the annotation code assigned markup/annotation ID
		//in sync with the $scope.index value. This way when we remove a markup or update
		//we can reference both the $scope markup and the global JS variable annotationState.annotations
		//using the same index.
		$scope.index = newMarkup.index;
		//console.log("new index" + $scope.index);

		console.log("Active: " + $scope.activeLayerIndex);
		console.log($scope.layers);
		console.log($window.annotationState.annotations);
		console.log($scope.markups);

		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$emit('layers', obj);
	};

	/**
	 * Update markup
	 * @param {Number} index
	 * @param {Object} markup
	 */
	$scope.update = function(index, markup){
		var ants = $window.annotationState.annotations;
		for(var i=0;i<ants.length;i++){
			if(ants[i].data.index == index){
				$window.annotationState.annotations[i].element.style.borderColor = markup.color;
				$window.annotationState.annotations[i].data.color = markup.color;
				break;
			}
		}
	};

	/**
	 * Remove markup
	 * @param {Number} index
	 */
	$scope.remove = function(mindex, index){
		console.log("delete index" + mindex);
		
		var ants = $window.annotationState.annotations;
		console.log(ants);
		console.log($scope.markups);
		console.log(mindex + " " + index);
		for(var i=0;i<ants.length;i++){
			if(ants[i].data.index == mindex){
				console.log("detach " + i);
				console.log($window.annotationState.annotations[i]);
				$window.annotationState.annotations[i].detach();
				break;
			}
		}
		
		$scope.markups.splice(index, 1);
		delete $scope.layers[$scope.activeLayerIndex].markups[mindex];
		console.log("which" + index);
		console.log($scope.layers[$scope.activeLayerIndex].markups[index]);
		var obj = {layers: $scope.layers, activeLayerIndex: $scope.activeLayerIndex};
		$scope.$emit('layers', obj);
	};
});
