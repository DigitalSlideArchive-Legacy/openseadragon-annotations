
function getAperioXML_document(xml_filename) {

    /*
	 this will actually grab the xml document itself from the local filesystem based on the passed filename
	 this expects either a fully qualifier url or a relative path
	 */

    var result = null;
    var scriptUrl = xml_filename;
    $.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

var poi_win_old;
var point_list;
var overlay;
var overlay_obj;
var main_annotation_win;
var aperio_win;
var aperio_win_grid1;
var aperio_win_grid2;
var aperio_win_grid3;

/*below will be deprecated--- but are image buttons I am using in some of the view ports.. */

var red_image = "<img id='redImage' src='dsa-common-files/codebase/imgs/red1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>";
var blue_image = "<img id='blueImage' src='dsa-common-files/codebase/imgs/blue1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>";
var green_image = "<img id='greenImage' src='dsa-common-files/codebase/imgs/green1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>";
var blue_eye = "";
var eye_style = "style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'";
var eye_open_url = " 'dsa-common-files/codebase/imgs/openEye.gif' ";


if (typeof KEEP_LOGS === 'undefined') KEEP_LOGS = true;
if (typeof _log !== 'function') {
    _log = function() {
        if (!KEEP_LOGS) return;
        try {
            console.log(arguments);
        } catch (err) {}
    }
}

/* so Aperio stores their numbers for line color as an unsigned int, so this is analogous to an ip address
of 255.255.255.255.... or really 255.255.255  ==  R G B ... I then need to convert this number to hex....
*/
function intToIP(int) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

function aperioLineColortoHex(int) {
    int = parseInt(int);
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    // var part4 = ((int >> 24) & 255);
    // return part4 + "." + part3 + "." + part2 + "." + part1;
    return part1.toString(16) + part2.toString(16) + part3.toString(16);
}




function load_aperio_annotation_list(display_on_load) {
    if (!main_layout.dhxWins.isWindow("aperio_xml")) {
        gen_aperio_annotation_box();
    }
    //        else{ dhxWins.window("aperio_xml").show(); }



    try {
        aperio_xml_filegrid.clearAll();
    } catch (err) {
        console.log(err);
    }

    try {
        xml_file_list = getAperioXML_list();
        /* Now I have queried the php function and gotten a list of active xml files for this subject...
                             this array has three properties  title/datagroup and filename... */
        /* TO DO-- just generate this window on init... */

        /* add a flag regarding loaading the first annotaiton file by default */
        load_first_annotation = true;
        /*when a user clicks on a new slide.. the first annotation xml found
                                                 will be loaded by default... can be toggled... */
        xml_file_list.forEach(function(x) {
            var newId = (new Date()).valueOf();
            aperio_xml_filegrid.addRow(newId, [x.title, x.filename])

            if (load_first_annotation) {
                load_first_annotation = false;; //this is the first xml file found...
                // alert('should also actually LOAD the annotation!!!??');
                console.log(x.filename);
                aperioxml_annotation = getAperioXML_document(x.filename);
                display_all_annotations_and_load_first_instance(aperioxml_annotation);
                /*now call a function to actually load them... */
            }
        });
        /*this gets called if annotations are present and then will clear and load the regions into the grid files */
    } catch (err) {
        console.log("Aperio XML functio not defined");

    }


}


function display_all_annotations_and_load_first_instance(xml_file_to_show) {
    console.log(xml_file_to_show);
    /* while a given subject can have one or more annotations...for now I am going to by default load the first one I can find as I
     change slidees */
    $('Annotation', xml_file_to_show).each(function() {
        console.log('hi');
        current_rgn_id = this.getAttribute("Id");
        linecolor = this.getAttribute("LineColor").toString(16);
        linecolor = (linecolor.length < 6) ? "0" + linecolor : linecolor;
        console.log(linecolor);
        $('Region', this).each(function() {
            aperio_vertex_to_osd(this, linecolor);
        });
    });
}


var hex_color_set = new Array();
hex_color_set[0] = "#FF0000";
hex_color_set[1] = "#FFFF00";
hex_color_set[2] = "#00FFFF";
hex_color_set[3] = "#FF00FF";
hex_color_set[4] = "#FFA500"; //orange
hex_color_set[5] = "#008080"; //teal
hex_color_set[6] = "#00FF00"; //green
hex_color_set[7] = "#0000FF"; //blue
hex_color_set[8] = "#008000"; //lightergreen


function aperio_vertex_to_osd(vertex_list_object, linecolor) {
    /*moving this part to a standalone function */
    $('Vertices', vertex_list_object).each(function() {
        var data = new Array();

        $('Vertex', this).each(function() {
			var row = new OpenSeadragon.Point();
			row.x = (this.getAttribute("X"));
			row.y = (this.getAttribute("Y"));
			var x = DSAViewer.getViewer().viewport.imageToViewportCoordinates(row);
			data.push(x);
        });
		
        point_list = data;

        //var overlay_obj = $.extend({}, AnnotationOverlay.prototype.OPTIONS);
		var overlay_obj = {
			id: null,
			type: 'freehand',
			index: 0,

			label: "0",
			points: point_list,

			color: '#ff0000',
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
			addl_notes: null,
			slide_id: null
		};

        /*overlay_obj = {
            type: 'freehand',
            points: point_list,
            color: "#FF00FF", //hex_color_set[Math.floor(Math.random() * 8)],
			label: "SS"
        };*/

        overlay = AnnotationOverlay.fromValueObject(overlay_obj);
        overlay.attachTo(DSAViewer.getViewer());
		annotationState.annotations.push(overlay);
    });

}

function aperio_region_to_osdAnnotation(annotation_xml_file, region_id) {

    alert('hi');
    /*this will be slowly cleaned up... but basically i will create a new annotation using the annotation.js methodology and
    copy the properties over from the aperio file....*/
    //      $('Region', XMLResponse2).each(function(){
    //assuming xml document... have annotation and then regions each regino is a set of points
    annotation_list = $('Annotation', aperioxml_annotation);
    region_list = $('Vertices', annotation_list);

    //this gets rid of the loaded annotations in the grid

    /*          $.ajax({
    url: val.Experiment,
    type: 'GET',
    dataType: 'xml',
    success: function(returnedXMLResponse){
    XMLResponse = returnedXMLResponse;
    $('Annotation', returnedXMLResponse).each(function(){
    grid0.addRow(1,fname,1);
    grid1.addRow(this.getAttribute("Id"),"Annotation " + this.getAttribute("Id"),this.getAttribute("Id"));
    
    /* vertex list then is a set of x,y points.. */
    /*  total_regions = vertex_list.length;
    for(i=0;i<total_regions;i++)
    {
    console.log(vertex_list[i].childNodes.length);
    /* a given set of vertex points has the form Vertex X="3232.3" Y="8462.86">
    so avertex.getAttributes('X') and getAttributes('Y') will return the data i need... */
    //      cur_region =vertex_list[i];
    //      }

}

function setup_wsi_toolbar(id) {
    _log('setup_wsi_toolbar', id);
    //make an elseif
    if (id == "query_db") {
        //alert('db_query_win');
        db_query_win.show();
        get_dataprovider_list();
    }

    if (id == "cdsa_db_query") {
        db_query_win.show();
    }

    if (id == "about_cdsa") {
        portal_info_win.show();
    }

    if (id == "show_annotations") {
        main_layout.dhxWins.window("annotation_win").show();

    }
    if (id == "gen_annotations") {
        main_layout.dhxWins.window("annotation_win").show();
    }
    if (id == "view_radiology") {
        alert('Integration coming soon... for now visit xnatview.org');
    }

    if (id == "load_aperio") {
        //          alert('load aperio window...');
        if (!main_layout.dhxWins.isWindow("aperio_xml")) {
            gen_aperio_annotation_box();
        } else {
            main_layout.dhxWins.window("aperio_xml").show();
        }
        xml_file_list = getAperioXML_list();
    }

}

function render_vertex_list(vertex_list) {

    /* this is not done properly as "this" is not set up properly...*/

    $('Vertices', vertex_list).each(function() {
        var data = [];
        dzi_x_pixels = viewer.viewport.contentSize.x;
        dzi_y_pixels = viewer.viewport.contentSize.y;
        aspect_ratio = dzi_y_pixels / dzi_x_pixels;
        var data = new Array();

        $('Vertex', this).each(function() {
            var row = new OpenSeadragon.Point();
            row.x = (this.getAttribute("X") / (dzi_x_pixels));
            row.y = (this.getAttribute("Y") / (dzi_y_pixels) * aspect_ratio);
            data.push(row);
        });
        point_list = data;
        var overlay_obj = $.extend({}, AnnotationOverlay.prototype.OPTIONS);
        overlay_obj = {
            type: 'freehand',
            points: point_list
        };
        overlay = AnnotationOverlay.fromValueObject(overlay_obj);
        overlay.attachTo(viewer);
        annotationState.annotations.push(overlay);
    });


}


function gen_aperio_annotation_box(target_win_id) {
    /* This is inherited code from Dan--- this generates the basic grid/layout needed to render an Aperio XML type document */

    /*target win id hasn't been generated yet... will add this in the future... */

    aperio_win = main_layout.dhxWins.createWindow("aperio_xml", 100, 50, 600, 600);
    aperio_win.setText("Aperio Annotations Window");

    aperio_win.button("close").hide();
    aperio_win.button("minmax1").hide();
    aperio_win.button("park").hide();
    aperio_win.addUserButton("hide", 0, 'Hide', 'hide');
    aperio_win.button('hide').attachEvent("onClick", function() {
        aperio_win.hide()
    });

    layers_layout = aperio_win.attachLayout('4U');

    mainlayers_div = layers_layout.cells('a');
    aperio_xml_filegrid = mainlayers_div.attachGrid();
    aperio_xml_filegrid.setImagePath("dsa-common-files/codebase/imgs/");
    aperio_xml_filegrid.setHeader("Annotation File,filename");
    aperio_xml_filegrid.setColTypes("ro,ro");
    aperio_xml_filegrid.setColSorting("str,ro");
    aperio_xml_filegrid.setInitWidths("*,0");
    aperio_xml_filegrid.init();
    aperio_xml_filegrid.setSkin("dhx_web");
    mainlayers_div.setText('');
    /* need to add an onclick handler to this grid box as well... */

    var XMLResponse;

    aperio_xml_filegrid.attachEvent("onRowSelect", function(id, ind) {
        /* Now load the appropriate XML and clear the other data... */
        var xml_filename = aperio_xml_filegrid.cellById(id, 1).getValue();
        aperioxml_annotation = getAperioXML_document(xml_filename);
        /*this aperioxml_annotation now contains the entire xml document I needed... I may need a callback function for this */
        /*grid 1 will be renamed.. this currently contains the list of labeled regions... */
        aperio_win_grid1.clearAll();

        $('Annotation', aperioxml_annotation).each(function() {
            aperio_win_grid1.addRow(this.getAttribute("Id"), "Annotation " + this.getAttribute("Id"), this.getAttribute("Id"));
            linecolor = this.getAttribute("LineColor").toString(16);
            linecolor = (linecolor.length < 6) ? "0" + linecolor : linecolor;
            /*I need to now load this data into the grid1 spot... */
            /*line color seems to be in a weird 5 or 6 digit integer format... need to convert this to FF0000 type */
        });

    });

    sections_div = layers_layout.cells('b');
    aperio_win_grid1 = sections_div.attachGrid();
    aperio_win_grid1.setImagePath("dsa-common-files/codebase/imgs/");
    aperio_win_grid1.setHeader("Annotations");
    aperio_win_grid1.setColTypes("ro");
    aperio_win_grid1.setColSorting("str");
    aperio_win_grid1.init();
    aperio_win_grid1.setSkin("dhx_web");

    aperio_win_grid1.attachEvent("onRowSelect", function(id, ind) {

        /*should initiate the drawing here as well... */

        aperio_win_grid2.clearAll();
        aperio_win_grid3.clearAll();

        XMLResponse = aperioxml_annotation;
        $('Annotation', XMLResponse).each(function() {
            if (this.getAttribute("Id") == id) {
                aperio_win_grid2.addRow(1, ["Id:", this.getAttribute("Id")], 1);
                aperio_win_grid2.addRow(2, ["Name:", this.getAttribute("Name")], 2);
                aperio_win_grid2.addRow(3, ["ReadOnly:", this.getAttribute("ReadOnly")], 3);
                aperio_win_grid2.addRow(4, ["NameReadOnly:", this.getAttribute("NameReadOnly")], 4);
                aperio_win_grid2.addRow(5, ["LineColorReadOnly:", this.getAttribute("LineColorReadOnly")], 5);
                aperio_win_grid2.addRow(6, ["Incremental:", this.getAttribute("Incremental")], 6);
                aperio_win_grid2.addRow(7, ["Type:", this.getAttribute("Type")], 7);
                aperio_win_grid2.addRow(8, ["LineColor:", this.getAttribute("LineColor")], 8);
                aperio_win_grid2.addRow(9, ["Visible:", this.getAttribute("Visible")], 9);
                aperio_win_grid2.addRow(10, ["Selected:", this.getAttribute("Selected")], 10);
                aperio_win_grid2.addRow(11, ["MarkupImagePath:", this.getAttribute("MarkupImagePath")], 11);
                aperio_win_grid2.addRow(12, ["MacroName:", this.getAttribute("MacroName")], 12);
                // aperio_win_grid2.addRow(2,["LineColor:",this.getAttribute("LineColor")],2);
                linecolor = this.getAttribute("LineColor").toString(16);
                linecolor = (linecolor.length < 6) ? "0" + linecolor : linecolor;
                XMLResponse2 = this;



                $('Region', this).each(function() {
                    aperio_win_grid3.addRow(this.getAttribute("Id"), ["<img id='eyeImage" + this.getAttribute("Id") + "' src=" + eye_open_url + eye_style + ">", "Layer " + this.getAttribute("Id"), this.getAttribute("Length"), this.getAttribute("Area"), this.getAttribute("Zoom"), red_image, green_image, blue_image], this.getAttribute("Id"));

                    /*the line color is contained in the previous atributes.... */

                    console.log(linecolor);
                    console.log(this);
                    console.log('iterating through the regions...');
                    aperio_vertex_to_osd(this, linecolor);
                });
                /*besides adding the row... I should.. dRAW THEM!!! */

            }
        })
    });

    sections_div.setText('');
    data_div = layers_layout.cells('c');
    aperio_win_grid2 = data_div.attachGrid();
    aperio_win_grid2.setImagePath("dsa-common-files/codebase/imgs/");
    aperio_win_grid2.setHeader("Parameter,Value");
    aperio_win_grid2.setColTypes("ro,ro");
    aperio_win_grid2.setColSorting("str,str");
    aperio_win_grid2.init();
    aperio_win_grid2.setSkin("dhx_web");
    /* aperio_win_grid2.attachEvent("onRowSelect", function(id,ind){
     alert ("Id: " + id + " Index: " + ind);
     }); */

    data_div.setText('');
    layers_div = layers_layout.cells('d');
    aperio_win_grid3 = layers_div.attachGrid();
    aperio_win_grid3.setHeader("Visible,Layer,Length,Area,Zoom,Red,Green,Blue");
    aperio_win_grid3.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
    aperio_win_grid3.setColSorting("str,str,str,str,str,str,str,str");
    aperio_win_grid3.enableKeyboardSupport(false);
    aperio_win_grid3.init();
    aperio_win_grid3.setSkin("dhx_web");
    aperio_win_grid3.attachEvent("onRowSelect", function(id, ind) {});

    layers_div.setText('');

    aperio_win.hide();
}

function get_url_for_poi_image(pin_color) {
    if (pin_color == 'FF0000' || pin_color == 'red') {
        pin_image_src = "dsa-common-files/imgs/Pin1_Red.png";
    } else if (pin_color == '00FF00' || pin_color == 'green') {
        pin_image_src = "dsa-common-files/imgs/Pin1_Green.png";
    } else {
        pin_image_src = "dsa-common-files/imgs/Pin1_Blue.png";
    }
    return (pin_image_src);
}

function create_main_annotation_windowbox() {
    main_annotation_win = main_layout.dhxWins.createWindow("annotation_win", 400, 50, 600, 400);
    main_annotation_win.setText("Annotation Viewer");
    main_annotation_win.button("close").hide();
    main_annotation_win.button("minmax1").hide();
    main_annotation_win.button("park").hide();
    main_annotation_win.addUserButton("hide", 0, 'Hide', 'hide');
    main_annotation_win.button('hide').attachEvent("onClick", function() {
        main_annotation_win.hide()
    });
    //    main_annotation_win.hide()

    layers_layout = main_annotation_win.attachLayout('3U');

    mainlayers_div = layers_layout.cells('a');
    mainlayers_div.setText('');
    mainlayers_div.setHeight('10');

    sections_div = layers_layout.cells('b');
    sections_div.setText('');

    roi_div = layers_layout.cells('c');

    RoiGrid = roi_div.attachGrid();
    RoiGrid.setImagePath("dsa-common-files/codebase/imgs/");
    RoiGrid.setHeader("ID,Type,Color,Status");
    RoiGrid.setColAlign("center,center,center,center");
    RoiGrid.setColTypes("ro,ro,ro,ro");
    RoiGrid.setColSorting("str,str,str,str");
    RoiGrid.init();
    //  RoiGrid.set_Skin("dhx_web");

    RoiGrid.attachEvent("onRowSelect", function(id, ind) {
        if (ind == 3) {
            /*var valcell = RoiGrid.cells(id, 0).getValue();
             var b2 = document.getElementById("eye" + valcell).src;
             viewer.drawer.clearOverlays();
             if (b2.substring(b2.length - 11, b2.length) == "openEye.gif") {
             var tempvar;
             document.getElementById("eye" + valcell).src = "dsa-common-files/imgs/closedEye.gif";
             tempvar = defn[valcell].split(";");
             defn[valcell] = tempvar[0] + ";" + tempvar[1] + ";0";

             } else {
             var tempvar;
             document.getElementById("eye" + valcell).src = "dsa-common-files/imgs/openEye.gif";
             }
             /* k is apparently the shape ID or the position of the po in the list.... */

        }
    });

    roi_div.setText('');
    main_annotation_win.hide();

    /*
     bottomLayers_div = layers_layoutshape.cells('c');

     gridShapes = bottomLayers_div.attachGrid();
     gridShapes.setImagePath("dsa-common-files/codebase/imgs/");
     gridShapes.setHeader("ID,Type,Color,Status");
     //gridShapes.setInitWidths("50,100,60,100");
     gridShapes.setColAlign("center,center,center,center");
     gridShapes.setColTypes("ro,ro,ro,ro");
     gridShapes.setColSorting("str,str,str,str");

     gridShapes.init();
     gridShapes.setSkin("dhx_web");

     gridShapes.attachEvent("onRowSelect", function (id, ind) {
     if (ind == 3) {
     var valcell = gridShapes.cells(id, 0).getValue();
     var b2 = document.getElementById("eye" + valcell).src;
     viewer.drawer.clearOverlays();
     if (b2.substring(b2.length - 11, b2.length) == "openEye.gif") {
     var tempvar;
     document.getElementById("eye" + valcell).src = "codebase/imgs/closedEye.gif";
     tempvar = defn[valcell].split(";");
     defn[valcell] = tempvar[0] + ";" + tempvar[1] + ";0";

     } else {
     var tempvar;
     document.getElementById("eye" + valcell).src = "codebase/imgs/openEye.gif";
     tempvar = defn[valcell].split(";");
     defn[valcell] = tempvar[0] + ";" + tempvar[1] + ";1";
     }

     for (var k in defn) {
     var temvar = defn[k].split(";");
     if (temvar[0] == "poi") {
     if (temvar[2] == "1") {
     poi_image.src = get_url_for_poi_image(tempvar[1]);
     document.body.appendChild(poi_image);
     viewer.drawer.addOverlay(poi_image, nucleus_rect);
     }
     }
     if (temvar[0] == "rect") {
     if (temvar[2] == "1") {

     var cur_div = document.createElement("div");
     cur_div.setAttribute("style", "border: 2px solid " + temvar[1]);
     document.body.appendChild(cur_div);
     var rect = new Seadragon.Rect(x1, y1, w, h); //(x,y,w,h)
     viewer.drawer.addOverlay(cur_div, rect);
     }
     }

     if (temvar[0] == "circ") {

     var cur_div = document.createElement("div");
     cur_div.setAttribute("style", "border: 2px solid " + temvar[1] + "; border-radius: 50%;");
     document.body.appendChild(cur_div);
     var rect = new Seadragon.Rect(x1, y1, w, w); //(x,y,w,h)
     viewer.drawer.addOverlay(cur_div, rect);
     }
     }

     }
     }
     });

     bottomLayers_div.setText('');

     */
}
