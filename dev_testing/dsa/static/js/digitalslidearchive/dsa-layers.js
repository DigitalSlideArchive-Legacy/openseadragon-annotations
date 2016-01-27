//Author: Mohamemd Khalilia
//Date: Thu 14 Jan 2016 05:12:32 PM EST 
//Description: Annotation layers handler

var layers = {};

function layer(options) { this._init(options || {}); }

$.extend(layer.prototype, {
	OPTIONS: {
		id: null,
		name: null,
		description: null,
		imageId: null,
		createdBy: null,
		createdTime: new Date().toISOString(),
		attributes: {},
		markup: {}
	},

	_init: function(options){
		var opts = $.extend({}, this.OPTIONS, options);

		//Update the options if any is provided
		for( var opt in this.OPTIONS )
			this.OPTIONS[opt] = opts[opt];

		_log("New layer options", this.OPTIONS);

		if(!this._exists() && this.OPTIONS.name.length > 0){
			//Add the layer to the layer list
			this._add();

			//Display the layer in the layer modal
			this._display();

			//Update the markups in the markup modal
			//Since the layer names has changed we need to 
			//update the layer dropdown for each markup
			DSAAnnotations.display(annotationState);
			_log("Added layer to the list", layers);
		}
	},

	_exists: function(){
		return (this.OPTIONS.name in layers);
	},

	_add: function(){
		//Copy the the layer to the layer list
		layers[this.OPTIONS.name] = $.extend({}, this.OPTIONS);
	},

	_delete: function(){
		delete layers[this.OPTIONS.name];
	},

	_display: function(){
		$("#layer_list_table").append(
			$("<tr>").data("layer_name", this.OPTIONS.name).append(
			$("<td>").append($("<input/>").attr({size:10, value:this.OPTIONS.name}).addClass("form-control"))).append(
			$("<td>").append($("<textarea>").attr({rows:1}).text(this.OPTIONS.description).addClass("form-control"))).append(
			$("<img/>").on("click", function() {
				//First delete the layer from the list
				delete layers[$(this).parent().data('layer_name')];

				//Remove the row associated with that layer
				$(this).parent().detach();

				//Update the markups in the markup modal
				//Since the layer names has changed we need to 
				//update the layer dropdown for each markup
				DSAAnnotations.display(annotationState);
			}).attr({src:"openseadragon_annotations/drawing_icons/delete.png"}).addClass("annot_delete_icon"))
		)
	}
});
