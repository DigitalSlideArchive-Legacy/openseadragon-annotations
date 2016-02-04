app.factory("markupService", function($window){

	getAnnotationIndex = function(index){
		var ants = $window.annotationState.annotations;

		for(var i=0;i<ants.length;i++)
			if(ants[i].data.index == index)
				return i

		return null;
	};

	return{
		getAnnotationIndex: getAnnotationIndex
	}
});
