tingBuilding.prototype.colorPresets = [
	{ minColor:new THREE.Color( 0xB0B0FF ), maxColor:new THREE.Color( 0xFFFFFF ) },
	{ minColor:new THREE.Color( 0xB0FFFF ), maxColor:new THREE.Color( 0xFFFFFF ) },
	{ minColor:new THREE.Color( 0xB0FFB0 ), maxColor:new THREE.Color( 0xFFFFFF ) },
	{ minColor:new THREE.Color( 0xB0B0B0 ), maxColor:new THREE.Color( 0xFFFFFF ) },
]

tingBuilding.prototype.blackMaterial = new THREE.MeshBasicMaterial({color:0x080814});

tingBuilding.prototype.generateMaterial = function( params ) {

	sideX = _coalesce( params.sideX, 10);
	sideY = _coalesce( params.sideY, 10);
		
	windowsX = Math.floor( sideX / this.windowSizeX );
	windowsY = Math.floor( sideY / this.windowSizeY );
	
	var canvas = document.createElement( 'canvas' );
	canvas.width = windowsX;
	canvas.height = windowsY;

	var context = canvas.getContext( '2d' );
	context.fillStyle = this.blackMaterial.color.getStyle();
	context.fillRect( 0, 0, windowsX, windowsY);

	for ( var y = 1, maxY = windowsY - 1; y < maxY; y += 2 ) {
		for ( var x = 1, maxX = windowsX - 1; x < maxX; x += 2 ) {
			if ( Math.random() > ( 1 - this.amount ) ) {				
				var rand = Math.random();
				var R = this.minColorR + Math.floor( rand * ( this.maxColorR - this.minColorR ) );
				var G = this.minColorG + Math.floor( rand * ( this.maxColorG - this.minColorG ) );
				var B = this.minColorB + Math.floor( rand * ( this.maxColorB - this.minColorB ) );
				context.fillStyle = 'rgb(' + [ R, G, B ].join( ',' )  + ')';
				context.fillRect( x, y, 1, 1 );
			}
		}
	}

	var canvas2 = document.createElement( 'canvas' );
	canvas2.width = windowsX * 4;
	canvas2.height = windowsY * 4;

	var context = canvas2.getContext( '2d' );
	context.imageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled = false;
	context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
	
	var texture = new THREE.Texture( canvas2 );	
	texture.needsUpdate = true;
	texture.anisotropy  = renderer.getMaxAnisotropy();	
	return new THREE.MeshBasicMaterial({map: texture});

}

function tingBuilding( params ) {
	
	this.windowSizeX = _coalesce( params.windowSizeX, 100 );
	this.windowSizeY = _coalesce( params.windowSizeY, 150 );
	this.amount = _coalesce( params.amount, 0.5);	
	this.width = _coalesce( params.width, 1000 );
	this.width = this.width + this.windowSizeX - (this.width % ( this.windowSizeX * 2 ) );	
	this.length = _coalesce( params.length, 1000 );
	this.length = this.length + this.windowSizeX - (this.length % ( this.windowSizeX * 2 ) );
	this.height = _coalesce( params.height, 1000);
	this.height = this.height + this.windowSizeY - (this.height % ( this.windowSizeY * 2 ) );
	this.position = new THREE.Vector3( _coalesce( params.x,0 ), _coalesce( params.y + (this.height/2),0 ), _coalesce( params.z,0 ));
	this.maxColor = _coalesce( params.maxColor, new THREE.Color( 0xffffff ) );
	this.minColor = _coalesce( params.minColor, new THREE.Color( 0x000000 ) );
	this.minColorR = Math.floor( 255 * Math.min( this.minColor.r, this.maxColor.r ) );
	this.maxColorR = Math.ceil( 255 * Math.max( this.minColor.r, this.maxColor.r ) );
	this.minColorG = Math.floor( 255 * Math.min( this.minColor.g, this.maxColor.g ) );
	this.maxColorG = Math.ceil( 255 * Math.max( this.minColor.g, this.maxColor.g ) );
	this.minColorB = Math.floor( 255 * Math.min( this.minColor.b, this.maxColor.b ) );
	this.maxColorB = Math.ceil( 255 * Math.max( this.minColor.b, this.maxColor.b ) );

	var material1 = this.generateMaterial( { 
		sideX: this.length, sideY: this.height,
		minColor: this.minColor, maxColor: this.maxColor,		
	});
	var material2 = this.generateMaterial( {
		sideX:this.width, sideY:this.height,
		minColor: this.minColor, maxColor: this.maxColor,	
	});
	
	this.material =  new THREE.MeshFaceMaterial([
		material1,
		material1,
		this.blackMaterial,
		this.blackMaterial,
		material2,
		material2
	]);
	
	//var building_material = new THREE.MeshBasicMaterial();
	this.geometry = new THREE.CubeGeometry( this.width, this.height, this.length );
	
}

tingBuilding.prototype.getMesh = function( params ) {
	return new THREE.Mesh(this.geometry, this.material);
}

function tingBuildingGenerateCache( params ) {

	var scale = _coalesce(params.scale, 500);
	var buildings_cache = new Array();
	var bwidth, blength, bheight;
	buildings_cache.delimiter = 7; /* how many scrapers */	
	for (var i = 0, max = 30; i < max; i++ ) { 
		
		if (i < buildings_cache.delimiter) {
			bwidth = scale + ( Math.random() * scale * 5 );
			blength = scale + ( Math.random() * scale * 5 );
			bheight = (scale*10) + ( Math.random() * scale * 20 )
		} else {
			bwidth = scale + ( Math.random() * scale * 8 );
			blength = scale + ( Math.random() * scale * 8 );
			bheight = scale + ( Math.random() * scale * 4 )
		}
		
		buildings_cache.push( new tingBuilding( {			
			width:bwidth, length:blength, height:bheight,
			windowSizeX:70, windowSizeY:50, amount: 0.1 + (Math.random()*0.2),
			minColor:new THREE.Color( 0xB0B0B0 ),
			maxColor:new THREE.Color( 0xFFFFFF ),
		}));
	}

	return buildings_cache
}