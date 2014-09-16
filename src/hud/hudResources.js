function hudResources( params ) {
	this.name = _coalesce(params.name, "Resources-" + _random(0,99));
	this.hud = _coalesce(params.hud, hud);	
	this.previewWidth = 300;
	this.previewHeight = 240;
	this.css = _coalesce(params.css, { top:"100px", left:"150px", height:(this.hud.height-120) + "px", width:(this.hud.width-300-this.previewWidth-30)+"px", backgroundColor:"#110000", opacity:0.8, fontSize:"50%"} );
	this.container = this.hud.addContainer(this.name, this.css);
	this.resources = _coalesce( params.resources, resources);
		
	/* header */
	(function(_this) {
		_this.menu = new hudMenu( { 	links: [
									{ title:"Refresh", onclick: function () { _this.refresh() } },
									{ title:"+ Add", onclick:function () { _this.addNewResource() } }
									
								], 
								hud:_this.hud,
								css: {top:"65px",left:"150px", fontSize:"75%", padding:"1px 10px", backgroundColor:"#110000"}
							}
						);		
	})(this);

	/* preview */
	this.previewContainer = this.hud.addContainer(this.name + "_preview", {top:"100px", left:(this.hud.width-150-this.previewWidth)+"px", height:(this.previewHeight) + "px", width:this.previewWidth + "px", backgroundColor:"#000000", opacity:1});
	this.previewScene = new tingScene({});
	this.previewScene.setAspectRatio(this.previewWidth / this.previewHeight);
	this.previewRenderer = new THREE.WebGLRenderer();
	this.previewRenderer.setSize( this.previewWidth, this.previewHeight );
	this.previewRenderer.setClearColor( 0x000000 );
	this.previewContainer.append(this.previewRenderer.domElement);
	
	this.renderResourcesList();
}

hudResources.prototype.addNewResource = function ( ) {
	var newRes = new basicResource();
	this.resourceWindow = new hudResource( {resource:newRes,hud:this.hud } );
	this.resourceWindow.render();
}

hudResources.prototype.renderResourcesList = function ( ) {
	this.container.empty();
	
	if (this.list) {
		this.list.empty();
	} else {
		this.list = $("<div class=\"list\"></div>").css( {top:"25px"} );
	}
	
	this.container.append( this.list );		
	
	this.list.append( $("<div class=\"list-header\"><div class=\"column column-id\">ID</div><div class=\"column column-type\">TYPE</div><div class=\"column column-desc\">DESCRIPTION</div></div>") );
	
	if (this.resources) {
		for (var i = 0, max = this.resources.resources.length; i < max; i++) {
			(function(_this, resource) {
				_this.list.append( resource
					.renderHUDList( function() {
						_this.renderResourcePreview(resource);
					} ) 
				);			
			})(this, this.resources.resources[i]);
		}	
	}
}

hudResources.prototype.refresh = function ( ) {
	this.renderResourcesList();
}

hudResources.prototype.getResource = function ( id ) {
	return this.resources.resources[i];
}

hudResources.prototype.renderResourcePreview = function ( resource ) {
	var preview = resource.renderHUDPreview();
	this.previewScene.removeAll();
	this.previewScene.add( preview );
	this.previewScene.camera.lookAt( preview.wrapper.position );
	this.previewScene.render( this.previewRenderer );	
}