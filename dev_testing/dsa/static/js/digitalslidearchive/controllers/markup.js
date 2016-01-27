app.controller("markupCtrl", function($scope, $window){
	$scope.markups = [];
	$scope.layers = [];
	$scope.index = 0;

	$scope.$on('layers', function(events, args){
		$scope.layers = args;
		console.log(args);
	});

	$scope.update = function(index, markup){
		$window.annotationState.annotations[index].element.style.borderColor = markup.data.color;
		$window.annotationState.annotations[index].data.color = markup.data.color;
	};

	$scope.remove = function(index){
		$window.annotationState.annotations[index].detach();
		$scope.markups.splice(index, 1);
	}

});
