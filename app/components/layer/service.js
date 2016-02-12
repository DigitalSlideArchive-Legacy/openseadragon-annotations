//Define a service for the layer
//Add root scope dependency
app.factory("layerService", function(){

	options = {
		id: null,
		name: null,
		description: null,
		imageId: null,
		createdBy: "Guest",
		createdTime: null,
		attributes: {},

		//Place to hold all markups assigned to this layer
		markups: {}
	};
	
	return{
		options: options
	}
});
