function tingChopper( params ) {
	this.scale = _coalesce( params.scale, 35 );
	this.actualRotorSpeed = 3 * Math.PI;
	this.wrapper = new THREE.Object3D();
	this.body = new THREE.Mesh( params.body_geometry, params.body_material );	
	this.wrapper.add( this.body );
	this.rotor = new THREE.Mesh( params.rotor_geometry, params.rotor_material );	
	this.wrapper.add( this.rotor );
	this.rotor2 = new THREE.Mesh( params.rotor2_geometry, params.rotor2_material );	
	this.wrapper.add( this.rotor2 );
	this.rotor2.position.z = -14;
	this.wrapper.scale.set( this.scale, this.scale, this.scale );
}

tingChopper.prototype.animationFrame = function( delta ) {
	this.rotor.rotation.y += (delta * this.actualRotorSpeed);	
	this.rotor2.rotation.x += (delta * this.actualRotorSpeed);	
}