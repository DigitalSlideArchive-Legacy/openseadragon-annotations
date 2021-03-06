//Define a controller for layers
//Add root scope dependency
app.controller("imageCtrl", function($rootScope, $scope, $window, $http){
	$scope.activeImage = null;
	$scope.images = [
			{'file_thumbnail': 'http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-06-0137-01A-01-BS1.svs.dzi.tif', 'filename_url': 'http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-06-0137-01A-01-BS1.svs.dzi.tif.dzi', 'id': 'TCGA-06-0137-01A-01-BS1'},
			{"file_thumbnail": "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-02-0034-01A-02-BS2.svs.dzi.tif", "prep_type": "FrozenSection", "pyramid_w_path": "/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-02-0034-01A-02-BS2.svs.dzi.tif", "filename_url": "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-02-0034-01A-02-BS2.svs.dzi.tif.dzi", "id": "TCGA-02-0034-01A-02-BS2","pyramid_base_name": "TCGA-02-0034-01A-02-BS2.svs.dzi.tif"},
			{"file_thumbnail": "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-02-0002-01A-01-BS1.svs.dzi.tif", "prep_type": "FrozenSection", "pyramid_w_path": "/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-02-0002-01A-01-BS1.svs.dzi.tif", "filename_url": "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-02-0002-01A-01-BS1.svs.dzi.tif.dzi", "id": "TCGA-02-0002-01A-01-BS1",  "pyramid_base_name": "TCGA-02-0002-01A-01-BS1.svs.dzi.tif"}];

	/**
	 * Update the viewer when clicking on new image
	 */
	$scope.init = function(){
		img = $scope.images[0];
		$scope.activeImage = img;

		angular.element(document).ready(function () {
			$rootScope.$broadcast("activeImageId", img.id);
		});
	}

	/**
	 * Update the viewer when clicking on new image
	 */
	$scope.update = function(img){
		//Set the active image
		$scope.activeImage = img;
		var viewer = $window.DSAViewer.getViewer();
		viewer.open(img.filename_url);

		//Broadcast the active image ID
		$rootScope.$broadcast("activeImageId", img.id);
	}

	
});

