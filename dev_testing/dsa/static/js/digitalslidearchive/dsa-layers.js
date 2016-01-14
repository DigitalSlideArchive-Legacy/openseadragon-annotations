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

		for( var opt in this.OPTIONS )
			this.OPTIONS[opt] = opts[opt];

		_log("New layer options", this.OPTIONS);

		if(!this._exists() && this.OPTIONS.name.length > 0){
			this._add();
			this._display();
			_log("Added layer to the list", layers);
			DSAAnnotations.display(annotationState);
		}
	},

	_exists: function(){
		return (this.OPTIONS.name in layers);
	},

	_add: function(){
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
				delete layers[$(this).parent().data('layer_name')];
				$(this).parent().detach();
				DSAAnnotations.display(annotationState);
			}).attr({src:"openseadragon_annotations/drawing_icons/delete.png"}).addClass("annot_delete_icon"))
		)
	}
});
