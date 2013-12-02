function tingAirplane( geometry, materials ) {
	
	this.wrapper = new THREE.Object3D();
	this.speed = 4000;
	this.cruising = new tingCruising(this.wrapper);
	this.cruising.addTarget(-59241,117598, 201867, this.speed);
	this.cruising.addTarget(87259,101111, 134359, this.speed);
	
	var material = new THREE.MeshLambertMaterial( materials );
	this.airplane = new THREE.Mesh( geometry, material );	
	this.scale = 10;
	this.airplane.scale.set( this.scale, this.scale, this.scale );
	this.airplane.position.set( 0, 0, 0 );
	this.airplane.rotation.x = Math.PI / 2;
	this.airplane.rotation.z = Math.PI;
	this.wrapper.add( this.airplane );
	
	/* ligths */
	this.lights = new Array();
	this.lights.push(new tingLight(7500, 1750, -7000, 0xFF0000, [1], this.wrapper));
	this.lights.push(new tingLight(-8700,1750, -7000, 0x00FF00, [0,1,1,0], this.wrapper));
	this.lights.push(new tingLight(-1100,5400, -13800, 0xF0F0FF, [1,0.2,0.2,0.2], this.wrapper));
	this.lights.push(new tingLight(-1300,5400, -13800, 0xF0F0FF, [1,0.2,0.2,0.2], this.wrapper));
	this.lights.push(new tingLight(-1200,800, 0, 0xF0F0FF, [0.2,0.2,1,0.2], this.wrapper));
	
	this.addToScene = function( scene ) {
		this.wrapper.position.copy(this.cruising.targets[0].vector);
		scene.add( this.wrapper );
	}
	
	this.animationFrame = function( delta ) {
		for (var i = 0; i < this.lights.length; i++ ) {
			this.lights[i].animationFrame( delta );
		}
		this.cruising.animationFrame( delta );
	}
	
}