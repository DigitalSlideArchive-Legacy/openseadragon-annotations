/* globals OpenSeadragon */

girder.wrap(girder.views.OpenseadragonImageViewerWidget, 'initialize', function (initialize) {
    /* The large_image plugin viewer reloads Openseadragon every time the
     * viewer is started.  Override this behavior, as otherwise the OSD plugins
     * would need to be reloaded, too. */
    var settings = Array.prototype.slice.call(arguments, 1);
    console.log(settings);
    girder.views.ImageViewerWidget.prototype.initialize.apply(this, settings);
    this.render();
});

girder.wrap(girder.views.OpenseadragonImageViewerWidget, 'destroy', function (destroy) {
    /* The large_image plugin viewer destroys Openseadragon every time the
     * viewer is exited.  Override this behavior, as otherwise the OSD plugins
     * would need to be reloaded, too. */
    if (this.viewer) {
        this.viewer.destroy();
        this.viewer = null;
    }
    girder.views.ImageViewerWidget.prototype.destroy.call(this);
});

girder.wrap(girder.views.OpenseadragonImageViewerWidget, 'render', function (render) {
    render.call(this);
    if (!this.viewer) {  /* not ready yet */
        return this;
    }

    // this.viewer is a reference to an OpenSeadragon viewer
    // this.itemId has the girder ID of the image that is being viewed
    // girder.currentUser.id is the current user ID
    // girder.currentUser is a Backbone model object of the current user

    this.viewer.scalebar({
        type: OpenSeadragon.ScalebarType.MAP,
        pixelsPerMeter: 20,
        minWidth: '75px',
        location: OpenSeadragon.ScalebarLocation.BOTTOM_LEFT,
        xOffset: 5,
        yOffset: 10,
        stayInsideImage: true,
        color: 'rgb(150, 150, 150)',
        fontColor: 'rgb(100, 100, 100)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        fontSize: 'small',
        barThickness: 2
    });
    return this;
});
