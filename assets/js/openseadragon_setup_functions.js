function makeControl() {
       var control = document.createElement("a");
       var controlText = document.createTextNode("Random");
       
       control.href = "#"; // so browser shows it as link
       control.className = "control";
       control.appendChild(controlText);
       Seadragon.Utils.addEvent(control, "click", onControlClick);
       return control;
     }	

function onControlClick(event) {
       Seadragon.Utils.cancelEvent(event); 
 // don't process link
             if (!viewer.isOpen()) { return;    }
     }
	
	
	
	  function toString(point, useParens) {
        var x = point.x;
        var y = point.y;
       
        if (x % 1 || y % 1) {     // if not an integer,
          x = x.toFixed(PRECISION); // then restrict number of
          y = y.toFixed(PRECISION); // decimal places
        }
       
        if (useParens)
         { return "(" + x + ", " + y + ")";} 
          else {   return x + " x " + y; }
      } 	
      
      
      
      

      function showMouse(event) {
       // getMousePosition() returns position relative to page,
       // while we want the position relative to the viewer
       // element. so subtract the difference.
       var pixel = OpenSeadragon.Utils.getMousePosition(event).minus
         (OpenSeadragon.Utils.getElementPosition(viewer.element));
       
        document.getElementById("mousePixels").innerHTML = toString(pixel, true);
        
       if (!viewer.isOpen()) {
          return;
        }

        var point = viewer.viewport.pointFromPixel(pixel);
        document.getElementById("mousePoints").innerHTML = toString(point, true);
        
        } 
        
        
 
      function showViewport(viewer) {
        if (!viewer.isOpen()) {
          return;
        }
     }
     




			function draw(points) {
				//alert(points);
				var canvas = document.getElementById('annotationCanvas');
				var context = canvas.getContext('2d');
				var i = 0;
				var sx = 0;
				var sy = 0;
				var colorcode = 0;
				context.beginPath();				  
				$.each(points, function() {
					// alert ("X:"+this.X+" | "+"Y:"+this.Y);					
					if(i == 0) {
						sx = this.X;
						sy = this.Y;
						context.moveTo(this.X, this.Y);
					}
					else {
						context.lineTo(this.X, this.Y);
					}
					i = i + 1;
				});
				context.lineTo(sx, sy);
				colorcode = Math.round(Math.abs(256 - (sx + sy)));
				if ((colorcode%3)==0) {
					context.strokeStyle = '#' + colorcode.toString(16) + '0000';		
				}
				if ((colorcode%3)==1) {
					context.strokeStyle = '#00' + colorcode.toString(16) + '00';		
				}
				if ((colorcode%3)==2) {
					context.strokeStyle = '#0000' + colorcode.toString(16);		
				}
				//alert (colorcode);
				context.stroke();				  	  
			}



function create_annotation_window()
	{
		dhxWins = new dhtmlXWindows();
		dhxWins.setImagePath("dhtmlxwin_files/dhtmlxWindows/codebase/imgs/");
		//dhxWins.setImagePath("./codebase/imgs/");
		dhxWins.setSkin('dhx_web');
		
				w1 = dhxWins.createWindow("w1", 400, 50, 600, 600);
				// alert (fname);
				w1.setText("Annotations Window");
				w1.button("close").hide();
				//w1.button("close").show();
				// w1.setModal(true);

				layers_layout = w1.attachLayout('4U', 'dhx_skyblue');
				

				mainlayers_div = layers_layout.cells('a');
				grid0 = mainlayers_div.attachGrid();
				grid0.setImagePath("./codebase/imgs/");
				grid0.setHeader("Experiment");
				// grid1.setInitWidths("100");
				//grid0.setColAlign("center");
				grid0.setColTypes("ro");
				grid0.setColSorting("str");
				
				grid0.init();
				grid0.setSkin("dhx_web");
				mainlayers_div.setText('');
				
				sections_div = layers_layout.cells('b');
				grid1 = sections_div.attachGrid();
				grid1.setImagePath("./codebase/imgs/");
				grid1.setHeader("Annotations");
				// grid1.setInitWidths("100");
				//grid1.setColAlign("center");
				grid1.setColTypes("ro");
				grid1.setColSorting("str");
				
				grid1.init();
				grid1.setSkin("dhx_web");
		
				
				
				grid1.attachEvent("onRowSelect", function(id,ind){
					grid2.clearAll();
					grid3.clearAll();
					/* $.getJSON('data.json', function(jd) {
						  $.each(jd.Experiments, function(key,val){
							  if (fname == arrtmp[1]) {
								$.ajax({
									url: val.Experiment,
									type: 'GET',
									dataType: 'xml',
									success: function(returnedXMLResponse){ */
										$('Annotation', XMLResponse).each(function(){
											if (this.getAttribute("Id") == id) {
												grid2.addRow(1,["Id:",this.getAttribute("Id")],1);	
												grid2.addRow(2,["Name:",this.getAttribute("Name")],2);
												grid2.addRow(3,["ReadOnly:",this.getAttribute("ReadOnly")],3);
												grid2.addRow(4,["NameReadOnly:",this.getAttribute("NameReadOnly")],4);
												grid2.addRow(5,["LineColorReadOnly:",this.getAttribute("LineColorReadOnly")],5);
												grid2.addRow(6,["Incremental:",this.getAttribute("Incremental")],6);
												grid2.addRow(7,["Type:",this.getAttribute("Type")],7);
												grid2.addRow(8,["LineColor:",this.getAttribute("LineColor")],8);
												grid2.addRow(9,["Visible:",this.getAttribute("Visible")],9);
												grid2.addRow(10,["Selected:",this.getAttribute("Selected")],10);
												grid2.addRow(11,["MarkupImagePath:",this.getAttribute("MarkupImagePath")],11);
												grid2.addRow(12,["MacroName:",this.getAttribute("MacroName")],12);
												// grid2.addRow(2,["LineColor:",this.getAttribute("LineColor")],2);											
												XMLResponse2 = this;
												$('Region', this).each(function(){
													grid3.addRow(this.getAttribute("Id"),["<img id='eyeImage"+this.getAttribute("Id")+"' src='codebase/imgs/closedEye.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>","Layer " + this.getAttribute("Id"),this.getAttribute("Length"),this.getAttribute("Area"),this.getAttribute("Zoom"),"<img id='redImage' src='codebase/imgs/red1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>","<img id='greenImage' src='codebase/imgs/green1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>","<img id='blueImage' src='codebase/imgs/blue1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>"],this.getAttribute("Id"));
													document.getElementById("txtPlots").value+="n;000000|";
													/* $('Vertices', returnedXMLResponse).each(function(){
													  var data = [];
														//scaling factor gets set here....
														 scale_factor = 2500;
														///the 500 is wrong for this image... i need to scale it
														dzi_x_pixels = viewer.viewport.contentSize.x;	
														dzi_y_pixels = viewer.viewport.contentSize.y  ;
														aspect_ratio = dzi_y_pixels/dzi_x_pixels;

													  $('Vertex', this).each(function(){
														var row = {};
														//row.X = (this.getAttribute("X")/$("#txtconstant").val());
														//row.Y = (this.getAttribute("Y")/$("#txtconstant").val());
														row.X = (this.getAttribute("X")/( dzi_x_pixels) *500  );
														row.Y = (this.getAttribute("Y")/( dzi_y_pixels) * (aspect_ratio *500) );
													   data.push(row);
													  })
													  setTimeout(function() { draw(data) }, 1000);
													}) */
												})
											}
										})
									/*}
								});
							  }
						  });
					}); */										
				});

				sections_div.setText('');
				data_div = layers_layout.cells('c');
				grid2 = data_div.attachGrid();
				grid2.setImagePath("./codebase/imgs/");
				grid2.setHeader("Parameter,Value");
				// grid2.setInitWidths("100");
				//grid2.setColAlign("center, center");
				grid2.setColTypes("ro,ro");
				grid2.setColSorting("str,str");				
				grid2.init();
				grid2.setSkin("dhx_web");
				/* grid2.attachEvent("onRowSelect", function(id,ind){
					alert ("Id: " + id + " Index: " + ind);
				}); */
				
					data_div.setText('');
				layers_div = layers_layout.cells('d');
				grid3 = layers_div.attachGrid();
				grid3.setImagePath("./codebase/imgs/");
				grid3.setHeader("Visible,Layer,Length,Area,Zoom,Red,Green,Blue");;
				// grid3.setInitWidths("100");
				//grid3.setColAlign("center, center, center, center");
				grid3.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
				grid3.setColSorting("str,str,str,str,str,str,str,str");	
				grid3.enableKeyboardSupport(false);			
				grid3.init();
				grid3.setSkin("dhx_web");
				grid3.attachEvent("onRowSelect", function(id,ind){
					var canvas = document.getElementById('annotationCanvas');
					var context = canvas.getContext('2d');	  
					context.clearRect ( 0 , 0 , 1000 , 500 );

					var arrCurves;
				if(ind==0)
					{
						//var a = parseInt(id) + 1;
						var b=document.getElementById("eyeImage"+id).src;
						//alert (b.substring(b.length-13,b.length));
						if(b.substring(b.length-11,b.length)=="openEye.gif")
						{
							/*------*/
							var strPlot = document.getElementById("txtPlots").value;
							strPlot = strPlot.substr(0, (strPlot.length - 1));
							arrCurves = strPlot.split("|");
							var plot = arrCurves[parseInt(id)-1].split(";");
							arrCurves[parseInt(id)-1] = "n;" + plot[1];
							document.getElementById("txtPlots").value = "";
							for (var i=0; i<arrCurves.length; i++) {
								document.getElementById("txtPlots").value+=arrCurves[i]+"|";
							}
							/*------*/

							document.getElementById("eyeImage"+id).src="http://sideshowbob.psy.emory.edu/dan1000_livedev/dg-Pathtools/seadragon_js/codebase/imgs/closedEye.gif";
						}
						else
						{
							/*------*/
							var strPlot = document.getElementById("txtPlots").value;
							strPlot = strPlot.substr(0, (strPlot.length - 1));
							arrCurves = strPlot.split("|");
							var plot = arrCurves[parseInt(id)-1].split(";");
							arrCurves[parseInt(id)-1] = "y;" + plot[1];
							document.getElementById("txtPlots").value = "";
							for (var i=0; i<arrCurves.length; i++) {
								document.getElementById("txtPlots").value+=arrCurves[i]+"|";
							}
							/*------*/

							document.getElementById("eyeImage"+id).src="http://sideshowbob.psy.emory.edu/dan1000_livedev/dg-Pathtools/seadragon_js/codebase/imgs/openEye.gif";
						}
					}
					if(ind==5)
					{
						/*------*/
						var strPlot = document.getElementById("txtPlots").value;
						strPlot = strPlot.substr(0, (strPlot.length - 1));
						arrCurves = strPlot.split("|");
						var plot = arrCurves[parseInt(id)-1].split(";");
						arrCurves[parseInt(id)-1] = plot[0] + ";FF0000";
						document.getElementById("txtPlots").value = "";
						for (var i=0; i<arrCurves.length; i++) {
							document.getElementById("txtPlots").value+=arrCurves[i]+"|";
						}
						/*------*/

						grid3.setRowColor(grid3.getSelectedId(), 'red');
					}
					if(ind==6)
					{
						/*------*/
						var strPlot = document.getElementById("txtPlots").value;
						strPlot = strPlot.substr(0, (strPlot.length - 1));
						arrCurves = strPlot.split("|");
						var plot = arrCurves[parseInt(id)-1].split(";");
						arrCurves[parseInt(id)-1] = plot[0] + ";00FF00";
						document.getElementById("txtPlots").value = "";
						for (var i=0; i<arrCurves.length; i++) {
							document.getElementById("txtPlots").value+=arrCurves[i]+"|";
						}
						/*------*/

						grid3.setRowColor(grid3.getSelectedId(), 'green');
					}
					if(ind==7)
					{
						/*------*/
						var strPlot = document.getElementById("txtPlots").value;
						strPlot = strPlot.substr(0, (strPlot.length - 1));
						arrCurves = strPlot.split("|");
						var plot = arrCurves[parseInt(id)-1].split(";");
						arrCurves[parseInt(id)-1] = plot[0] + ";0000FF";
						document.getElementById("txtPlots").value = "";
						for (var i=0; i<arrCurves.length; i++) {
							document.getElementById("txtPlots").value+=arrCurves[i]+"|";
						}
						/*------*/

						grid3.setRowColor(grid3.getSelectedId(), 'blue');
					}
					// alert (document.getElementById("txtPlots").value);
				
					var counter = 0;
					var check;
					$('Region', XMLResponse2).each(function(){
						check = arrCurves[counter].split(";");
						//alert (check[0] + ":" + check[1]);
						if (check[0] == "y") {					
							$('Vertices', this).each(function(){
							  var data = [];
								//scaling factor gets set here....
								 scale_factor = 2500;
								///the 500 is wrong for this image... i need to scale it
								dzi_x_pixels = viewer.viewport.contentSize.x;	
								dzi_y_pixels = viewer.viewport.contentSize.y  ;
								aspect_ratio = dzi_y_pixels/dzi_x_pixels;

							  $('Vertex', this).each(function(){
								var row = {};
								//row.X = (this.getAttribute("X")/$("#txtconstant").val());
								//row.Y = (this.getAttribute("Y")/$("#txtconstant").val());
								row.X = (this.getAttribute("X")/( dzi_x_pixels) *500  );
								row.Y = (this.getAttribute("Y")/( dzi_y_pixels) * (aspect_ratio *500) );
							   data.push(row);
							  })
							  var colorcode = check[1];
							  setTimeout(function() { draw(data, colorcode) }, 1000);
							})
						}
						counter = counter + 1;
					})
				});
				
				layers_div.setText('');
//				dhxWins.window("w1").hide();

	
	}


