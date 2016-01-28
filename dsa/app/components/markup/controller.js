app.controller("markupCtrl", function($scope, $window){
	$scope.markups = [];
	$scope.layers = [];
	$scope.index = 0;

	$scope.$on('layers', function(events, args){
		$scope.layers = args;
		console.log(args);
	});

	$scope.add = function(markups){
		$scope.markups = markups;
		var newMarkup = $scope.markups[$scope.markups.length - 1].data; 
		$scope.index = newMarkup.index;
	};

	$scope.update = function(index, markup){
		$window.annotationState.annotations[index].element.style.borderColor = markup.data.color;
		$window.annotationState.annotations[index].data.color = markup.data.color;
		$scope.setLayer(index, markup.data.layer.id);
	};

	$scope.remove = function(index){
		$window.annotationState.annotations[index].detach();
		$scope.markups.splice(index, 1);
	};

	$scope.setLayer = function(markupId, layerId){
		$scope.layers[markupId].markup.push($window.annotationState.annotations[layerId]);
		console.log($scope.layers);
	}

});
