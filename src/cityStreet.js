function tingStreet ( params ) {
	this.startX = _coalesce( params.startX, 0 );
	this.startY = _coalesce( params.startY, 0 );
	this.startZ = _coalesce( params.startZ, 0 );
	this.length = _coalesce( params.length, 40 );
	this.scale = _coalesce( params.scale, 1500 );
	this.wrapper = new THREE.Object3D();
	this.wrapper.position.set ( this.startX, this.startY, this.startZ );
	if (params.scene) params.scene.add( this.wrapper );	
	geometry = new THREE.PlaneGeometry( this.length * this.scale, this.scale);
	var texture = params.texture;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( this.length, 1 );
	texture.anisotropy = MAX_ANISOTROPY;
	material = new THREE.MeshBasicMaterial( { map:texture, side: THREE.BackSide } );
	this.street = new THREE.Mesh( geometry, material );
	this.street.rotation.x = Math.PI/2;

	if ( params.crossing ) {
		this.street.rotation.z = Math.PI/2;
		this.street.position.z += (this.length/2) * this.scale;
		this.street.position.x =  (this.scale/2) ;
	} else {
		this.street.position.x = ( this.length * this.scale ) / 2;		
		this.street.position.z = this.scale / 2;
	}
	
	this.wrapper.add( this.street );		
}

