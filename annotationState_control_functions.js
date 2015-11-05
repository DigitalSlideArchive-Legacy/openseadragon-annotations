/** Controller for the attribute controls window. */
function AnnotationStateControl(id) {
	this._init(id === undefined ? 'annotationControls' : id);
}
$.extend(AnnotationStateControl.prototype, {
	_init: function(id) {
		this.id = id;
		
		var annotationState = DERM.getAnnotationState(),
			$annotationState = $(annotationState);
			
		var self = this;
		$(function() { self.$el = $('#' + self.id); });
		
		$annotationState.on('allAnnotationsChanged', $.proxy(this, 'refreshAnnotations'));
		$annotationState.on('annotationAdded', function(evt) {
			self.annotationAdded(evt.annotation, evt.index);
		});
	},
	
	refreshAnnotations: function() {
		var annotationState = DERM.getAnnotationState(),
			annotations = annotationState.annotations;
		$('#' + this.id).find("tr:gt(0)").remove();
		for( var i = 0; i < annotations.length; ++i )
			this.annotationAdded(annotations[i], i);
	},
	
	annotationAdded: function(annotation, i) {
		if( typeof(i) === 'undefined' )
			i = this.$el.find('tr:gt(0)').length;
		var html='<tr id="' + i + '_annotationControlRow">';
		html+='<td>'+i+'</td>'; //could be changed to annotationState.annotations[i].data.id
		html+='<td>'+annotation.data.type+'</td>';
		html+='<td>'+annotation.data.label+'</td>';
		html+='<td>'+'<div id="'+i+'_alphaSlider" class="alphaSlider"></div>'+'</td>';
		html+='<td>'+'<input type="text" class="input-small" id="'+i+'_colorTextbox" value="'+annotation.data.color+'"></input></td>';
		html+='<td>'+annotation.data.filled+'</td>';
		html+='<td>'+'<input type="checkbox" id="'+i+'_visibilityCheckbox" checked></div>'+'</td>';
		html+='</tr>';
		this.$el.append(html);

		/*need to add code for the toggle visibility here.... */

		$(function() {
			$( '#'+i+'_alphaSlider' ).slider({
				orientation: "horizontal",
				range: "min",
				max: 100,
				value: Math.round(annotation.data.alpha*100),
				change: function( event, ui ) {
					var roi_index=parseInt(this.id.split('_')[0]);
					var value=ui.value;
					var annotationState = DERM.getAnnotationState();
					
					annotationState.updateAnnotationData(roi_index, {alpha: value/100.0});
		      }
		  });
		  $( '#'+i+'_visibilityCheckbox' ).change(function(){
				//console.log(this.id);
				var roi_index=parseInt(this.id.split('_')[0]);
				var annotationState = DERM.getAnnotationState();
				if($(this).is(":checked")) {
					toggle_roi_properties( roi_index, 'visibility', false, annotationState) ;
				} else {
					toggle_roi_properties( roi_index, 'visibility', true, annotationState) ;
				}
			});
			$( '#'+i+'_colorTextbox' ).on('keyup',function(){
				var roi_index=parseInt(this.id.split('_')[0]);
				var new_color=this.value;
				if (new_color.length == 7 && new_color.charAt(0) == '#'){
					DERM.getAnnotationState().updateAnnotationData(roi_index, {color: new_color});
				}
			});
		});
	},
	
	annotationRemoved: function(index) {
		this.$el.find('tr:eq(' + (index+1) + ')').remove();
	},
});


function AnnotationStateToolbar(opts) {
	this._init(opts);
}
$.extend(AnnotationStateToolbar.prototype, {
	_DEFAULTS: {
		element: 'annotation_dialog'
	},

	_init: function(opts) {
		opts = $.extend({}, this._DEFAULTS, opts || {});
		var element = opts.element;
		if( typeof element === 'string' || element instanceof String ) {
			element = document.getElementById(element.valueOf());
		}
		this.element = element;
		this.annotationState = opts.annotationState;

		this._inject(this.element);
		this._attachToControls(this.element);

		if( this.annotationState )
			this.attach(this.annotationState);
	},

	_inject: function(element) {
		element.innerHTML = 
			'<div id="wsi_toolbar">\n' +
			'    <div id="wsi_active_shape" class="btn-group drawing_shape" data-toggle="buttons-radio">\n' +
			'        <button id="circle" type="button" class="btn btn-primary">Circle\n' +
			'            <img src="drawing_icons/circle.png">\n' +
			'        </button>\n' +
			'        <button id="rect" type="button" class="btn btn-primary">Square\n' +
			'            <img src="drawing_icons/square.png" </button>\n' +
			'            <button id="poi" type="button" class="btn btn-primary">Pin\n' +
			'                <img src="drawing_icons/Pin1_Blue.png" </button>\n' +
			'                <button id="polygon" type="button" class="btn btn-primary">Polygon\n' +
			'                    <img src="drawing_icons/polyline_v1.png" </button>\n' +
			'        <button id="freehand" type="button" class="btn btn-primary">Freehand</button>\n' +
			'    </div>\n' +
			'    <div id="wsi_paint_color" class="btn-group paint_color" data-toggle="buttons-radio">\n' +
			'        <button id="red" type="button" class="btn btn-primary">\n' +
			'            <div style="border:15px solid red"></div>\n' +
			'        </button>\n' +
			'        <button id="green" type="button" class="btn btn-primary">\n' +
			'            <div style="border:15px solid green"></div>\n' +
			'        </button>\n' +
			'        <button id="blue" type="button" class="btn btn-primary">\n' +
			'            <div style="border:15px solid blue"></div>\n' +
			'        </button>\n' +
			'        <button id="yellow" type="button" class="btn btn-primary">\n' +
			'            <div style="border:15px solid yellow"></div>\n' +
			'        </button>\n' +
			'    </div>\n' +
			'\n' +
			'    <span id="cur_color_span">Current Color:\n' +
			'        <span id="cur_color"></span>\n' +
			'    </span>\n' +
			'\n' +
			'    Drawing Enabled:\n' +
			'    <div id="drawing_switch" style="height:25px" class="switch drawing_switch" data-on="danger" data-off="warning">\n' +
			'                <input type="checkbox">\n' +
			'    </div>\n' +
			'</div>\n';
	},

	/**
	 * Attaches listeners to all the controls.  The controls are 
	 * stored in this.controls.
	 */
	_attachToControls: function() {
		var self = this;
		var $el = $(this.element);
		var controls = this.controls = {
			colorButtons:  $el.find('#wsi_paint_color button'),
			currentColor:  $el.find('#cur_color'),
			shapeButtons:  $el.find('#wsi_active_shape button'),
			drawingSwitch: $el.find('.drawing_switch')
		};

		controls.colorButtons.on('click', function (evt) {
			controls.colorButtons.removeClass('active');
			$(this).addClass('active');
			var hexColor = colourNameToHex(this.id);
			if (self.annotationState) {
				annotationState.lineColor = hexColor;
			}
			controls.currentColor.css('background-color', hexColor);
		});

		
		controls.shapeButtons.on('click', function (evt) {
			controls.shapeButtons.removeClass('active');
			$(this).addClass('active');
			if (self.annotationState) {
				self.annotationState.setDrawMode(this.id);
			}
		});

		controls.drawingSwitch.bootstrapSwitch();
		controls.drawingSwitch.on('switch-change', function (e, data) {
			console.debug("switch-change caught by drawing switch element");
			var $el = $(data.el), value = data.value;
			console.debug("switch change event is %o %O %O", e, $el, value);
			if (self.annotationState) {
				self.annotationState.setIsDrawing(!!data.value);
			}
		});
	},

	/**
	 * Attaches to a particular annotation state.
	 */
	attachState: function(annotationState) {
		var self = this;
		this.annotationState = annotationState;
		var $state = $(annotationState);
		$state.on('isDrawingChanged', function (evt) {
			var drawingSwitch = self.controls.drawingSwitch;
			var isDrawing = evt.isDrawing;
			if( drawingSwitch.bootstrapSwitch('status') !== isDrawing ) {
				console.debug("annotation state caught isDrawingChanged event. Updating switch elements");
				drawingSwitch.bootstrapSwitch('setState', isDrawing);
			}
		});

		this.syncState();
	},

	setActiveColor: function (color) {
		this.controls.colorButtons.removeClass('active');
		$(this.element).find('#wsi_paint_color #' + color).addClass('active');
	},

	/**
	 * Synchronizes the toolbar controls with the current annotation state.
	 */
	syncState: function() {
		if (!this.annotationState)
			return;
		var state = this.annotationState, ctl = this.controls;
		ctl.drawingSwitch.bootstrapSwitch('setState', state.isDrawing);
		this.controls.currentColor.css('background-color', state.lineColor);
		this.controls.shapeButtons.removeClass('active');
		$(this.element).find('#wsi_active_shape #' + state.drawMode).addClass('active');
	},
});

/* toggling visibility in the annotation state object..
to get an individual object... it's annotationState.annotations[index]

within that, the $element propery is what actually populates the div that is rendered... making changes to the visibilt of that will toggle things
 on and off.. but I need to make sure I propogate the event properly 
 */

function toggle_roi_properties(roi_index, roi_property, prop_value, annotationState) {
	annotation_obj = annotationState.annotations[roi_index];
	elmt_handle = annotation_obj.$element;

	if (roi_property == 'visibility') {
		prop_value ? $(elmt_handle).hide() : $(elmt_handle).show();
	}
}

function get_url_for_poi_image(pin_color) {
	if (pin_color == 'FF0000' || pin_color == 'red') {
		pin_image_src = "drawing_icons/Pin1_Red.png";
	} else if (pin_color == '00FF00' || pin_color == 'green') {
		pin_image_src = "drawing_icons/Pin1_Green.png";
	} else {
		pin_image_src = "drawing_icons/Pin1_Blue.png";
	}
	return (pin_image_src);
}

function annotation_setup_code(annotationState) {

	annotationToolbar = new AnnotationStateToolbar({

	});
	annotationToolbar.attachState(annotationState);


	Mousetrap.bind( ['ctrl+d'], function(evt) {
		if (typeof (evt.preventDefault) === 'function')
			evt.preventDefault();
		else
			evt.returnValue = false;
		annotationState.setIsDrawing(!annotationState.isDrawing);
	});

	return;
}
