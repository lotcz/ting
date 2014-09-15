/*
var jsonCarLoader = new THREE.JSONLoader();
jsonCarLoader.load( "play/buggy.js", function ( carGeometry, materials ) {
	var carMaterial = new THREE.MeshFaceMaterial( materials );	
	var car = new tingCar( {geometry:carGeometry, material:carMaterial, scene:scene, animated:animated } );
} );
	
*/

function tingCar( params ) {
	
	this.scale = _coalesce( params.scale, 40 );	
	this.wrapper = new THREE.Object3D();
	this.wrapper.scale.set( this.scale, this.scale, this.scale );	
	this.mesh = new THREE.Mesh( params.geometry, params.material );	
	this.wrapper.add( this.mesh );
	
	if (params.scene) params.scene.add( this.wrapper );
	if (params.animated) params.animated.push( this );
	
	this.rotation_amount_x = 1;
	this.rotation_amount_z = 1;
	
}

tingCar.prototype.animationFrame = function( delta ) {

	if (this.enabled) {
	
		/* buggy is hovering */
		this.mesh.rotation.x += ( DELTA * this.rotation_amount_x * ((controls.moveForward) ? 0.3 : 0.1) );
		if (this.mesh.rotation.x > 0.05) {
			this.mesh.rotation.x = 0.05;
			this.rotation_amount_x = -1;
		} else if (this.mesh.rotation.x < -0.01) {
			this.rotation_amount_x = 1;
			this.mesh.rotation.x = -0.01;
		}
			
		if (controls.moveForward) {
			this.mesh.rotation.z += ( DELTA * this.rotation_amount_z * 0.3 );
			if (this.mesh.rotation.z > 0.05) {
				this.rotation_amount_z = -1;
				this.mesh.rotation.z = 0.05;
			} else if (this.mesh.rotation.z < -0.05) {
				this.rotation_amount_z = 1;
				this.mesh.rotation.z = -0.05;
			}
		} else {
			this.mesh.rotation.z = 0;
		}
		
	}
}