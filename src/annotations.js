
var KEEP_LOGS = true;
if( typeof _log !== 'function' ) {
	_log = function() {
		if( !KEEP_LOGS ) return;
		try { console.log(arguments); } catch(err) {}
	}
}

var AnnotationTypes = {},
	OverlayTypes = {};


function AnnotationData(options) { this._init(options || {}); }

/** Instantiate a copy from storage data. */
AnnotationData.fromValueObject = function(obj) {
	var result;
	if( AnnotationTypes.hasOwnProperty(obj.type) )
		result = new AnnotationTypes[obj.type](obj);
	else
		result = new AnnotationData(obj);
	return result;
};


//TODO: To support setting properties on annotations when they are pushed e.g. zoom_level
// 1. Add the keys for the properties to the OPTIONS so they are white-listed for serialization
// 2. Create a common properties field that is an array of properties to add to each annotation data
// 3. Provide a public getter and setter for the property so users of the annotation state can specify the common properties for the next annotation
$.extend(AnnotationData.prototype, {
	OPTIONS: {
		id: null,
		type: 'unknown',

		label: null,
		points: null,

		color: '#FF00FF',
		alpha: 1,
		filled: false,
		closed: false,
		zoom_level: null,
		
		markup_for: null,
		
// 		markup_image_name: null,
// 		markup_image_md5: null,
		server_id: null,
		annotation_timestamp: null,
		annotation_revision_id: null,
		ontology_or_termset_id: null,
		browser_info: null,
		markup_text: null,
		addl_notes: null
	},
		
	/** If positive, limit the number of points to maxPoints. */
	maxPoints: -1,
	
	_init: function(options) {
		var opts = $.extend({}, this.OPTIONS, options);
		for( var opt in this.OPTIONS )
			this[opt] = opts[opt];
		if( this.points == null ) this.points = [];
		
		this.bounds = null;
	},
	
	/** 
	 * Return the bounds, computing if necessary or request by <code>recompute</code>.
	 * @param {boolean} recompute to force bounds to be recomputed
	 * @return {null} the bounds ({x,y,width,height}) or <code>null</code> if no points
	 */
	getBounds: function(recompute) {
		if( this.points.length < 1 ) return null;
		if( this.bounds == null || recompute ) {
			var start = this.points[0], top, bottom, left, right;
			top = bottom = start.y;
			left = right = start.x;
			for( var i = 1; i < this.points.length; ++i ) {
				var p = this.points[i];
				if( p.y < top )    top = p.y;
				if( p.y > bottom ) bottom = p.y;
				if( p.x < left )   left = p.x;
				if( p.x > right )  right = p.x;
			}
			this.bounds = {x: left, y: top, width: right - left, height: bottom - top};
		}
		return this.bounds;
	},
	
	/** Get absolute bounds for a given dimension. */
	getAbsoluteBounds: function(width, height, recompute) {
		
		var bounds = this.getBounds(recompute);
		if( bounds == null ) return null;
		 
		var absolute = {
			x: bounds.x * width,
			y: bounds.y * height,
			width: bounds.width * width,
			height: bounds.height * height
		};
		return absolute;
	},
	
	/** Add a point and invalidate the bounds. */
	addPoint: function(point) {
		if( this.maxPoints > 0 && this.points.length >= this.maxPoints )
			throw new Error('Points already at max: ' + this.maxPoints);
		this.points.push(point);
		this.bounds = null;
	},
	
	/** Remove a point and invalidate the bounds. */
	removePoint: function(index) {
		if( typeof index !== 'number' ) throw new Error('index is not a number');
		if( index < 0 || index >= this.points.length ) throw new Error('index out of range: ' + index);
		this.points.splice(index, 1);
		this.bounds = null;
	},
	
	/** Replace an existing point and invalidate the bounds if changed. */
	replacePoint: function(index, point) {
		if( typeof index !== 'number' ) throw new Error('index is not a number');
		if( index < 0 || index > this.points.length ) throw new Error('index out of range: ' + index);
		if( index === this.points.length ) {
			this.addPoint(point);
			return null;
		}
		var old = this.points[index];
		this.points[index] = point;
		if( old.x !== point.x || old.y !== point.y )
			this.bounds = null;
		return old;
	},
	
	/** Return a copy of this data with only the values for storage. */
	asValueObject: function() {
		var obj = {};
		for( var opt in this.OPTIONS )
			obj[opt] = this[opt];
		return obj;
	}
});

/** Point of Interest data. */
function PointOfInterestData(options) {
	options = options || {};
	options.type = 'poi';
	this._init(options);
}
AnnotationTypes['poi'] = PointOfInterestData;
$.extend(PointOfInterestData.prototype, AnnotationData.prototype, {
	OPTIONS: $.extend({}, AnnotationData.prototype.OPTIONS, {
		imgsrc: null,
		rectsize: 0.025
	}),
	
	maxPoints: 1,
	
	/** 
	 * Return the bounds, computing if necessary or request by <code>recompute</code>.
	 * @param {boolean} recompute to force bounds to be recomputed
	 * @return {null} the bounds ({x,y,width,height}) or <code>null</code> if no points
	 */
	getBounds: function(recompute) {
		if( this.points.length < 1 ) return null;
		if( this.bounds == null || recompute ) {
			var p = this.points[0], size = this.rectsize;
			this.bounds = {x: p.x - size, y: p.y - size, width: size, height: size};
		}
		return this.bounds;
	}
});

/** A rectangle. */
function RectangleData(options) {
	options = options || {};
	options.type = 'rect';
	this._init(options);
}
AnnotationTypes['rect'] = RectangleData;
$.extend(RectangleData.prototype, AnnotationData.prototype, {
	maxPoints: 2
});

/** A circle / oval. */
function CircleData(options) {
	options = options || {};
	options.type = 'circle';
	this._init(options);
}
AnnotationTypes['circle'] = CircleData;
$.extend(CircleData.prototype, AnnotationData.prototype, {
	maxPoints: 2
});

/** Polygons and freehand drawing data. */
function PolygonData(options) {
	options = options || {};
	if( options.type !== 'polygon' && options.type !== 'freehand' )
		options.type = 'polygon';
	this._init(options);
}
AnnotationTypes['polygon'] = PolygonData;
AnnotationTypes['freehand'] = PolygonData;
$.extend(PolygonData.prototype, AnnotationData.prototype);

//
// END data objects
//

//
// BEGIN overlays
//

/** Annotation overlay renderer. */
function AnnotationOverlay(options) { this._init(options || {}); }
AnnotationOverlay.fromValueObject = function(obj) {
	var result;
	if( OverlayTypes.hasOwnProperty(obj.type) )
		result = new OverlayTypes[obj.type]({data: obj});
	else
		result = new AnnotationData({data: obj});
	return result;
};
$.extend(AnnotationOverlay.prototype, {
	EMPTY_RECT: new OpenSeadragon.Rect(0,0,0,0),
	
	_init: function(options) {
		if( options.data )
			this.data = AnnotationData.fromValueObject(options.data);
		else
			this.data = AnnotationData.fromValueObject(options);
		
		this.viewer = null;
		this.element = null;
		this.labelelement = null;
		if( options.viewer ) this.attachTo(options.viewer);
	},

	/** Implement shape specific drawing. */
	draw: $.noop,

	/** Called by detach() for extra cleanup. */
	cleanup: $.noop,

	/** Creates the drawing element, which is a div by default. */
	createElement: function() {
		return document.createElement('div');
	},
	
	/** Creates the label display element. */
	createLabelElement: function() {
		var el = document.createElement('div');
		// TODO: use negative 'top' or 'left' values to place outside of element container
		$(el).css({
			'position': 'absolute',
			'overflow': 'visible',
			'top': '0px',
			'left': '0px'
		});
		return el;
	},
	
	attachTo: function(viewer) {
		this.viewer = viewer;
		this.element = this.createElement();
		this.labelelement = this.createLabelElement();
		$(this.labelelement).text(this.data.label).appendTo(this.element);
		viewer.drawer.addOverlay(this.element, this.EMPTY_RECT);
		this.redraw();
	},

	detach: function() {
		if( !this.viewer ) return;
		this.viewer.drawer.removeOverlay(this.element);
		this.viewer = this.element = this.labelelement = null;
		this.cleanup();
	},
	
	updateBounds: function() {
		var bounds, rect;
		if( !this.viewer ) return;
		bounds = this.data.getBounds();
		if( bounds == null ) {
			rect = this.EMPTY_RECT;
		} else {
			rect = new OpenSeadragon.Rect(
				bounds.x, bounds.y, bounds.width, bounds.height);
		}
		this.viewer.drawer.updateOverlay(this.element, rect);
	},
	
	redraw: function() {
		if( this.viewer ) {
			this.updateBounds();
			this.labelelement.innerText = this.data.label || '';
			this.draw();
		}
	},
	
	/** Render to a canvas */
	renderTo: $.noop /*function(img) {
		var   w = img.width, 
		      h = img.height,
		     el = this.createElement(), 
		  label = this.createLabelElement(),
		 bounds = this.data.getBounds();
		
		$(label).text(this.data.label).appendTo(el);
		
		// make relative to image size
		bounds.x *= w;
		bounds.y *= h;
		bounds.width *= w;
		bounds.height *= h;
		
		var $el = $(el).width(bounds.width).height(bounds.height).css({
			position: 'absolute',
			top: bounds.x + 'px',
			left: bounds.y + 'px'
		});//.appendTo(img);
		
		var $canvas = $('<canvas>').width(w).height(h);
		var ctx = $canvas[0].getContext('2D');
		ctx.drawImage(img, 0, 0);
		$el.appendTo($canvas[0]);
		ctx.dispose();
		
		return $canvas;
	}*/
});

function POIOverlay(options) {
	options = options || {};
	options.type = 'poi';
	if( typeof(options.data) === 'object' )
		options.data.type = 'poi';
	this._init(options);
};
OverlayTypes['poi'] = POIOverlay;
$.extend(POIOverlay.prototype, AnnotationOverlay.prototype, {
	_superinit: AnnotationOverlay.prototype._init,
	_superCreateElement: AnnotationOverlay.prototype.createElement,
	
	_init: function(options) {
		this._superinit(options);
	},
	
	createElement: function() {
		var el = this._superCreateElement();
		
		this.img = document.createElement('img');
		var $img = $(this.img);
		if( this.data.imgsrc )
			$img.attr('src', this.data.imgsrc);
		$img.css({width: '100%', height: '100%'});
		$img.appendTo(el);
		
		return el;
	},
	
	cleanup: function() {
		this.img = null;
	}
});

/** Mixin for overlays using a <DIV> and CSS. */
var DivOverlayMixin = {
	/** Implement for initial CSS settings on the DIV. */
	applyStaticCSS: $.noop,

	/** For dynamic attributes, defaults implemented. */
	applyDynamicCSS: function() {
		var d = this.data;
		this.$element.css({
			'border-color': d.color,
			'opacity': d.alpha,
			'filter': 'alpha(opacity=' + (d.alpha*100) + ')',
			'background': (d.filled ? d.color : '')
		});
		this.labelelement.innerText = d.label || '';
	},

	/** Creates the DIV and applies the static CSS to it. */
	createElement: function() {
		var e = document.createElement('div');
		this.$element = $(e);
		this.applyStaticCSS();
		return e;
	},

	cleanup: function() { 
		this.$element = null;
	},

	draw: function() {
		if( !this.viewer ) return;
		this.applyDynamicCSS();
	}
};

/** An overlay for a rectangle annotation. */
function RectangleOverlay(options) {
	options = options || {};
	options.type = 'rect';
	if( typeof(options.data) === 'object' )
		options.data.type = 'rect';
	this._init(options || {});
}
OverlayTypes['rect'] = RectangleOverlay;
$.extend(RectangleOverlay.prototype,
			AnnotationOverlay.prototype,
			DivOverlayMixin, {
	/** Sets the border to show the rectangle. */
	applyStaticCSS: function() {
		this.$element.css({
			'position': 'relative',
			'border-width': '2px',
			'border-style': 'solid'
		});
	},
	
	renderTo: function(canvas) {
// 		var bounds = this.data.getBounds();
		var bounds = this.data.getAbsoluteBounds(canvas.width, canvas.height);
		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.lineWidth = '2';
		ctx.strokeStyle = this.data.color;
		ctx.globalAlpha = this.data.alpha;
// 		ctx.scale(canvas.width, canvas.height);
		ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
		ctx.restore();
		// FIXME need to render the label?
	}
});

/** An overlay for a circle annotation. */
function CircleOverlay(options) {
	options = options || {};
	options.type = 'circle';
	if( typeof(options.data) === 'object' )
		options.data.type = 'circle';
	this._init(options);
};
OverlayTypes['circle'] = CircleOverlay;
$.extend(CircleOverlay.prototype,
			AnnotationOverlay.prototype,
			DivOverlayMixin, {
	/** Sets the border and makes it circular. */
	applyStaticCSS: function() {
		this.$element.css({
			'position': 'relative',
			'border-width':  '2px',
			'border-style':  'solid',
			'border-radius': '50%'
		});
	},
	
	renderTo: function(canvas) {
		var bounds = this.data.getAbsoluteBounds(canvas.width, canvas.height);
		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.lineWidth = '2';
		ctx.strokeStyle = this.data.color;
		ctx.globalAlpha = this.data.alpha;
		// move to center
		ctx.translate(bounds.x + bounds.width/2, bounds.y + bounds.height/2);
		// distort circle in terms of width
		ctx.scale(bounds.width/bounds.height, 1);
		ctx.beginPath();
		// draw circle
		ctx.arc(0, 0, bounds.height/2, 0, 2*Math.PI, false);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		// FIXME need to render the label?
	}
});


/**
 * Creates a polygon or freehand annotation.
 *
 * @param {object} the options, which may be:<br /><ul>
 *   <li>points - an initial array of points</li>
 *   <li>color - a color string of the form #HHHHHH</li>
 *   <li>alpha - a number [0,1] indicating the alpha level</li>
 *   <li>filled - if the shape should be filled</li>
 *   <li>closed - if the shape should be closed</li>
 *   <li>viewer - the OpenSeadragon viewer to attach to, if not given call attachTo(viewer) later</li>
 * </ul>
 */
function PolygonOverlay(options) {
	options = options || {};
	var type = options.type;
	if( type !== 'polygon' && type !== 'freehand' )
		options.type = 'polygon';
	if( typeof(options.data) === 'object' )
		options.data.type = options.type;
	this._init(options);
};
OverlayTypes['polygon'] = PolygonOverlay;
OverlayTypes['freehand'] = PolygonOverlay;
$.extend(PolygonOverlay.prototype, AnnotationOverlay.prototype, {
	_superinit: AnnotationOverlay.prototype._init,
	_superCreateElement: AnnotationOverlay.prototype.createElement,
			
	_init: function(options) {
		this._superinit(options);

		this._lastBounds = null;
		this._lastCanvasSize = null;
		this._canvasPoints = null;
	},

	createElement: function() {
      this.canvas = document.createElement('canvas');
      this.$canvas = $(this.canvas).css({'height': '100%', 'width': '100%'});
		var element = this._superCreateElement();
      this.$canvas.appendTo(element);
		return element;
	},

	addPoint: function(point) {
		this.data.addPoint(point);
		this.clearCaches();
		this.redraw();
	},

	clearCaches: function() {
		this._lastBounds = null;
		this._lastCanvasSize = null;
		this._canvasPoints = null;
	},

	/**
	 * Returns whether the bounds are different from the cached version.
	 * If not given, uses the data bounds.
	 */
	areBoundsChanged: function(bounds) {
		var last = this._lastBounds, current = bounds;
		if( current === undefined ) current = this.data.getBounds();
		
		if( last == null && current != null ) return true;
		if( last != null && current == null ) return true;
		if( last.x !== current.x || last.y !== current.y ||
				last.width !== current.width || last.height !== current.height ) {
			return true;
		}

		return false;
	},

	/** Same as areBoundsChanged but caches the bounds if changed. */
	cacheBounds: function(bounds) {
		if( bounds === undefined ) bounds = this.data.getBounds();
		if( this.areBoundsChanged(bounds) ) {
			this._lastBounds = bounds;
			return true;
		}
		return false;
	},
			
	/**
	 * Returns whether the canvas size is different from the cached version.
	 * If not given, uses the element dimensions.
	 */
	isCanvasResized: function(width, height) {
		var last = this._lastCanvasSize;
		if( width == null ) {
			width = this.element.width;
			height = this.element.height;
		}
		if( last == null ) return true;
		if( last.width !== width || last.height !== height ) return true;

		return false;
	},

	/** Same as isCanvasResized but caches the size if changed. */
	cacheCanvasSize: function(width, height) {
		if( this.isCanvasResized(width, height) ) {
			this._lastCanvasSize = {width: width, height: height};
			return true;
		}
		return false;
	},

	draw: function() {
		if( !this.viewer ) return;
		 
		var cwidth = this.canvas.width, cheight = this.canvas.height;
			
		if( cwidth === undefined || cheight === undefined ) {
			_log('PolygonAnnotation.draw, canvas width/height undefined:', cwidth, cheight);
			return;
		}
		
		var ctx = this.canvas.getContext('2d');
		ctx.clearRect(0, 0, cwidth, cheight);
		if( this.data.points.length < 2 )
			return;
		
		this.renderTo(this.canvas, this.getCanvasPoints());
	},
	
	renderTo: function(canvas, _points) {
		var cwidth = canvas.width, cheight = canvas.height,
			ctx = canvas.getContext('2d'), data = this.data,
			cpoints = _points;
			
		if( cwidth === undefined || cheight === undefined ) {
			_log('PolygonAnnotation.renderTo, canvas width/height undefined:', cwidth, cheight);
			return;
		}
		
		// no points so rendering once onto an external canvas
		// translate points to absolute coordinates
		if( cpoints == null ) {
			cpoints = $.map(data.points, function(point) {
				return {x: point.x * cwidth, y: point.y * cheight};
			});
		}

		// always clear
		if( cpoints.length < 2 )
			return;
		
		var first = cpoints[0];

		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = data.color;
		ctx.globalAlpha = data.alpha;

		// draw the path
		ctx.moveTo(first.x, first.y);
		for( var i = 1, len = cpoints.length; i < len; ++i ) {
			var p = cpoints[i];
			ctx.lineTo(p.x, p.y);
		}

		if( data.closed ) ctx.closePath();

		ctx.stroke();

		if( data.filled ) {
			ctx.fillStyle = data.color;
			ctx.fill();
		}
		ctx.restore();
	},

	/** Gets the overlay points relative to the canvas. */
	getCanvasPoints: function() {
		var bounds = this.data.getBounds(),
			cwidth = this.canvas.width,
			cheight = this.canvas.height,
			cpoints = this._canvasPoints,
			cached;
			
		if( cwidth === undefined || cheight === undefined ) {
			_log('PolygonAnnotation.getCanvasPoints, canvas width or height undefined.', cwidth, cheight);
			return null;
		}

		// see if we can reuse the earlier points
		cached = this.cacheBounds(bounds);
		cached = this.cacheCanvasSize(cwidth, cheight) && cached;
		cached = cached && cpoints != null;
		if( cached ) return cpoints;

		// translate based on current bounds and canvas size
		var xorigin = bounds.x,     yorigin = bounds.y,
		      width = bounds.width,  height = bounds.height,
			points = this.data.points,        len = points.length,
			i = 0, x, y, p, Point = OpenSeadragon.Point;
			
		cpoints = Array(len);
		for(; i < len; ++i) {
			p = points[i];
			x = ((p.x - xorigin) / width)  * cwidth;
			y = ((p.y - yorigin) / height) * cheight;
			cpoints[i] = new Point(x, y);
		}

		// cache and return
		this._canvasPoints = cpoints;
		return cpoints;
	},
			
	cleanup: function() {
		this.clearCaches();
	}
});

//
// END overlays
//

// BEGIN Annotation state controller
function AnnotationState(toolbar, viewer) {
	// need anything here?
	this.drawMode = 'poi';
	this.lineColor = '#FFFF00';
	this.toolbar = null;
	this.viewer = null;
	this.markupFor = null;
	this.isDrawing = false;
	this.annotations = [];

	if( toolbar ) this.setupToolbar(toolbar);
	if( viewer ) this.setSeadragonViewer(viewer);
}
$.extend(AnnotationState.prototype, {
	setDrawMode: function(mode) {
		var oldMode = this.drawMode;
		// cancel the current annotation if switching modes
		if( mode !== oldMode ) 
			this.cancelAnnotation();
		this.drawMode = mode;
		if( mode !== oldMode ) {
			$(this).trigger({
				type: 'drawModeChanged',
				oldMode: oldMode,
				newMode: mode
			});
		}
	},

	selectForegroundColor: function(color) {
		if( color ) 
			this.colorPicker.setColor(color);
		else
			this.colorPicker.setColor(this.lineColor);
		this.colorPicker.show();
	},
	
	setForegroundColor: function(color) {
		this.lineColor = color;
		// FIXME
		$('#line_color').val(color);
		this.$colorInput.css('background-color', color);
	},
	
	setSeadragonViewer: function(viewer) {
		if( this.viewer ) {
			_log('Warning: setSeadragonViewer already called.', this.viewer, viewer, this);
		}
		this.viewer = viewer;
		OpenSeadragon.Utils.addEvent(viewer.element, 'click', $.proxy(this._viewerClicked, this));
		
		// set up listeners for freehand drawing
		var self = this;
		var $el = this.$el = $(viewer.element);
		$el.on('mousedown', function(evt) {
			var loc, onMouseMove;
			if( 'freehand' === self.drawMode && self.isDrawing ) {
				loc = self._getEventLocation(evt);
				self._startFreehand(loc.point);
				onMouseMove = function(event) {
					var loc = self._getEventLocation(event);
					self._overlay.addPoint(loc.point);
				};
				$el.one('mouseup', function(event) {
					// FIXME this is not preventing the click event for some reason
					event.preventDefault();
					event.stopImmediatePropagation();
					
					// stop listening to movement and turn off drawing
					$el.off('mousemove', onMouseMove);
					self.annotations.push(self._overlay);
					self._overlay = null;
					self.setIsDrawing(false, true);
				});
				$el.on('mousemove', onMouseMove);
			}
		});
	},
	
	setIsDrawing: function(drawing, setItemState) {
		var oldVal = this.isDrawing;
		this.isDrawing = drawing;
		this.viewer.setMouseNavEnabled(!this.isDrawing);

		if( !drawing ) {
			// TODO finalize freehand / polygon
			if( this.drawMode !== 'polygon' && this._overlay != null ){
				this.cancelAnnotation();
			}
			if( this._overlay != null ){
				/* adding a sticky option... will be a global variable?? that determines if drawing mode stays on or off i.e. addm ultiple shapes without clicking redraw */
				this.pushAnnotation(this._overlay);
				this._overlay = null;
				console.debug('added annotation from overlay??');
			}
		}
		if( setItemState )
			this.toolbar.setItemState('start_draw', drawing);
		
		if( oldVal !== this.isDrawing ) {
			$(this).trigger({
				type: 'isDrawingChanged',
				isDrawing: this.isDrawing
			});
		}
	},
	
	/** 
	 * Gets the pixel and point location from a click event.
	 * @return {object} with 'pixel' and 'point' attributes
	 */
	_getEventLocation: function(event) {
		var u = OpenSeadragon.Utils, 
			pixel = u.getMousePosition(event).minus(u.getElementPosition(this.viewer.element)),
			point = this.viewer.viewport.pointFromPixel(pixel);
		return {pixel: pixel, point: point};
	},
	
	_viewerClicked: function(event) {
		var location = this._getEventLocation(event),
			pixel = location.pixel,
			point = location.point;
		_log('_viewerClicked', pixel, point, event, this);
		if( this.isDrawing ) {
			var isNewOverlay = this._overlay == null;
			
			if( 'poi' === this.drawMode ) {
				this._drawPOI(point);
			} else if( 'polygon' === this.drawMode ) {
				if( isNewOverlay )
					this._startPolygon(point);
				else
					this._overlay.addPoint(point);
			} else if( 'rect' == this.drawMode ) {
				if( isNewOverlay ) {
					this._startRectangle(point);
				} else {
					this._overlay.data.replacePoint(1, point);
					this._overlay.redraw();
					this.pushAnnotation(this._overlay);					

					this._overlay = null; // FIXME save these
				}
			} else if( 'circle' === this.drawMode ) {
				if( isNewOverlay ) {
					this._startCircle(point);
				} else {
					this._overlay.data.replacePoint(1, point);
					this._overlay.redraw();
					this.pushAnnotation(this._overlay);

					this._overlay = null; // FIXME save these
				}
			}
		}
	},
	
	/**
	 * Returns the annotation properties for use in constructing a new overlay.
	 * 
	 * @param point the initial point for the overlay
	 * @param props optional non-default properties to merge in
	 */
	_getAnnotationProperties: function(point, props) {
		var defaults = {
			viewer: this.viewer,
			data: {
				label: String(this.annotations.length + 1),
				color: this.lineColor,
				points: [point],
				annotation_timestamp: new Date().getTime(),
				markup_for: this.markupFor,
				// add any other common properties here
			}
		};
		if( typeof props !== 'undefined' )
			defaults = $.extend(true, defaults, props);
		return defaults;
	},
	
	_startRectangle: function(point) {
		this._overlay = new RectangleOverlay(this._getAnnotationProperties(point));
		var self = this, $el = this.$el = $(this.viewer.element);
		var onMouseMove = function(event) {
			var location = self._getEventLocation(event);
			self._overlay.data.replacePoint(1, location.point);
			self._overlay.redraw();
		};
		$el.one('mouseup', function() { $el.off('mousemove', onMouseMove); });
		$el.on('mousemove', onMouseMove);
	},

	_startCircle: function(point) {
		this._overlay = new CircleOverlay(this._getAnnotationProperties(point));
		var self = this, $el = this.$el = $(this.viewer.element);
		var onMouseMove = function(event) {
			var location = self._getEventLocation(event);
			self._overlay.data.replacePoint(1, location.point);
			self._overlay.redraw();
		};
		$el.one('mouseup', function() { $el.off('mousemove', onMouseMove); });
		$el.on('mousemove', onMouseMove);
	},
	
	/** Starts a freehand annotation at the given point. */
	_startFreehand: function(point) {
		this._overlay = new PolygonOverlay(this._getAnnotationProperties(point, {
			type: 'freehand'
		}));
	},
	
	/** Starts a polygon annotation at the given point. */
	_startPolygon: function(point) {
		this._overlay = new PolygonOverlay(this._getAnnotationProperties(point, {
			type: 'polygon',
			data: {
				filled: true,
				closed: true,
				alpha: 0.3
			}
		}));
	},

	/**
	 * Draws a POI (Point of Interest) based on the current 
	 * point.
	 */
	_drawPOI: function(point) {
		var lineColor = this.lineColor || '#FFFF00',
			pinImg = get_url_for_poi_image(lineColor.substring(1));
			
		var overlay = new POIOverlay(this._getAnnotationProperties(point, {
			type: 'poi',
			data: {
				imgsrc: pinImg
			}
		}));
		this.pushAnnotation(overlay);
	},

	
	/** Cancel and remove the current annotation. */
	cancelAnnotation: function() {
		if( this._overlay != null ) {
			this._overlay.detach();
			this._overlay = null;
		}
	},

	/**
	 * Set and initialize the dhtmlx.Toolbar instance.
	 * Should only be called once.
	 */
	setupToolbar: function(toolbar) {
		var self = this;
		if( this.toolbar ) {
			_log('Warning: setupToolbar already called.', this.toolbar, toolbar, this);
		}
		this.toolbar = toolbar;
		toolbar.attachEvent('onClick', $.proxy(this._toolbarClicked, this));
		toolbar.attachEvent('onStateChange', $.proxy(this._stateChanged, this));
		
		// this.toolbar.disableItem('foreground_color_input');
		this.$colorInput = $(toolbar.cont).find('input.inp').first();
		this.$colorInput.on('click keypress', function(event){
			event.preventDefault();
			if( event.type === 'click' || (event.type === 'keypress' && event.which == 13) )
				self.selectForegroundColor();
		});

		this.colorPicker = new dhtmlXColorPicker(null, null, true, true);
		this.colorPicker.setSkin('');
		this.colorPicker.setOnSelectHandler($.proxy(this.setForegroundColor, this));
		this.colorPicker.init();
		
		this.setForegroundColor(this.lineColor);
	},

	_toolbarClicked: function(id) {
		_log('_toolbarClicked', id, this);
		// FIXME handle this ourselves, forward for now
		setup_wsi_toolbar(id);

		var isDrawMode = id.substring(0, "drawmode_".length) === "drawmode_";
		if( isDrawMode ) {
			this.setDrawMode(id.substring("drawmode_".length));
		} else if( id === 'foreground_color' ) {
			this.selectForegroundColor();
		} else if( id === 'add_poi' ) {
			if( this.drawMode === 'poi' ) {
				this.toolbar.setItemState('add_poi', false);
				this.drawMode = null;
			} else {
				this.setDrawMode('poi');
			}
		}
	},
	
	/**
	 * Adds a new annotation and fires a notification event.
	 */
	pushAnnotation: function(annotation) {
		this.annotations.push(annotation);
		console.log("added annotation %o", annotation);
		$(this).trigger({
			type: 'annotationAdded',
			annotation: annotation,
			index: this.annotations.length - 1
		});
	},
	
	/**
	 * Update the annotation.data values of the index'th annotation.
	 * If modified, ensures the annotation is redrawn and a notification 
	 * event is fired.
	 */
	updateAnnotationData: function(index, values) {
		if( index < 0 || index >= this.annotations.length )
			throw {message: 'Index out of bounds: ' + String(index)};
		
		var annotation = this.annotations[index];
		var data = annotation.data;
		var modified = {}, isModified = false;
		for( var prop in values ) {
			if( !values.hasOwnProperty(prop) ) continue;
			var newVal = values[prop];
			if( data[prop] !== newVal ) {
				modified[prop] = data[prop] = newVal;
				isModified = true;
			}
		}
		
		if( isModified ) {
			annotation.redraw();
			$(this).trigger({
				type: 'annotationUpdated',
				annotation: annotation,
				index: index,
				values: modified
			});
		}
	},

	/** Return all the annotation data as value objects. */
	storeAnnotations: function() {
		return $.map(this.annotations, function(el, idx) {
			return el.data.asValueObject();
		});
	},
	
	/** Remove all the current annotations. */
	clearAnnotations: function() {
		var annotations = this.annotations, annotation;
		while( annotation = annotations.pop() )
			annotation.detach();
		$(this).trigger({
			type: 'allAnnotationsChanged'
		});
	},
	
	/** Load a set of annotations from value objects. */
	loadAnnotations: function(values) {
		var overlay;
		this.clearAnnotations();
		for( var i=0, ilen=values.length; i < ilen; ++i ) {
			overlay = AnnotationOverlay.fromValueObject(values[i]);
			overlay.attachTo(this.viewer);
			this.annotations.push(overlay);
		}
		$(this).trigger({
			type: 'allAnnotationsChanged'
		});
	},

	_stateChanged: function(id, state) {
		_log('_stateChanged', id, state, this);
		if( 'start_draw' === id ) {
			this.setIsDrawing(state);
		}
	},
	
	renderForImage: function(img) {
		var width = img.width, height = img.height;
		if( !(width && height) ) {
			_log('AnnotationState.renderOnImage: Bad image dimensions.', img, width, height);
			return null;
		}
		
		var $canvas = $('<canvas>').width(width).height(height),
			canvas = $canvas[0];
		
		var ctx = canvas.getContext('2d');
		ctx.save();
		
		ctx.clearRect(0, 0, width, height);
		// FIXME this prevent exporting the result, 'tainted canvas'
// 		ctx.drawImage(img, 0, 0, width, height);
		
		for( var i = 0, ilen = this.annotations.length; i < ilen; ++i ) {
			this.annotations[i].renderTo(canvas);
		}
		ctx.restore();
		
		var dataURL = canvas.toDataURL();
		var rendered = document.createElement('img');
		rendered.width = width;
		rendered.height = height;
		rendered.src = dataURL;
		return rendered;
	}
});
OpenSeadragon.Utils = OpenSeadragon;
// END Annotation state controller 
