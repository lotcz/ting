function tingCityBlock( params ) {
	this.startX = _coalesce( params.startX, 0 );
	this.startY = _coalesce( params.startY, 0 );
	this.startZ = _coalesce( params.startZ, 0 );
	this.sizeA = _coalesce( params.sideA, 12 );
	this.sizeB = _coalesce( params.sideB, 12 );	
	this.scale = _coalesce( params.scale, 500 );
	this.wrapper = new THREE.Object3D();
	this.wrapper.position.set ( this.startX, this.startY, this.startZ );
	if (params.scene) params.scene.add( this.wrapper );
	
	var street = new tingStreet( { length:this.sizeA, scale:this.scale, scene:this.wrapper} );
	street = new tingStreet( { startZ:((this.sizeB-1)*this.scale), length:this.sizeA, scale:this.scale, scene:this.wrapper} );
	street = new tingStreet( {crossing:true, startX:((this.sizeA-1)*this.scale), startZ:this.scale, length:this.sizeB-2, scale:this.scale, scene:this.wrapper} );
	street = new tingStreet( {crossing:true, startZ:this.scale, length:this.sizeB-2, scale:this.scale, scene:this.wrapper} );
	
	var gsizeX = (this.sizeA-2) * this.scale;
	var gsizeY = (this.sizeB-2) * this.scale;
	
	var ground = new THREE.Mesh(new THREE.PlaneGeometry( gsizeX , gsizeY), params.ground_material ) ;
	ground.position.x = (gsizeX/2) + this.scale;
	ground.position.z = (gsizeY/2) + this.scale;
	ground.rotation.x = -Math.PI/2;
	this.wrapper.add( ground );
	
	var minX, minZ, maxX, maxZ, index;
	var buildings = Math.round( this.sizeA * this.sizeB / 20 )
	var scrapers = Math.round( buildings / 10 );
	
	for (var i = 0, max = scrapers + buildings; i < max; i++ ) { 
		
		if (i < scrapers) {
			index = Math.random() * params.cache.delimiter;
		} else {
			
		}
		
		minX = ( bwidth / 2 ) + this.scale ;
		minZ = ( blength / 2 ) + this.scale ;
		maxX = ((this.sizeA-1) * this.scale) - (bwidth/2);
		maxZ = ((this.sizeB-1) * this.scale) - (blength/2);
	
		this.wrapper = building = params.cache.getMesh( );
		this.wrapper.position = this.position;
		
		params.scene.add( this.wrapper );

	}
	
	//console.log( this );

}