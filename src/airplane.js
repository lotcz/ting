function tingAirplane(x, y, z, geometry, materials ) {
	
	this.wrapper = new THREE.Object3D();
	this.wrapper.scale.set( 0.01, 0.01, 0.01 );
	this.position = this.wrapper.position;
	this.rotation = this.wrapper.rotation;
	this.speed = 100;
	this.cruising = new tingCruising(this.wrapper);
	this.cruising.addTarget(700,50,400, this.speed);
	this.cruising.addTarget(10000,50,400, this.speed);
	/*
	this.cruising.addTarget(4000,-120,400, this.speed);
	this.cruising.addTarget(4500,-120,400, this.speed);
	this.cruising.addTarget(5500,-40,0, this.speed);
	this.cruising.addTarget(6000,-30,0, this.speed);
	this.cruising.addTarget(7000,-20,0, this.speed);
	this.cruising.addTarget(8500,0,0, this.speed);
	this.cruising.addTarget(9000,40,0, this.speed);
	this.cruising.addTarget(10000,30,0, this.speed);
	*/
	var material = new THREE.MeshLambertMaterial( materials );
	this.mesh = new THREE.Mesh( geometry, material );	
	this.mesh.airplane = this;	
	this.mesh.scale.set( 10, 10, 10 );
	this.mesh.position.set( 0, 0, 0 );
	this.mesh.rotation.x = Math.PI / 2;
	this.mesh.rotation.z = Math.PI;
	this.wrapper.add( this.mesh );
	
	/* ligths */
	this.lights = new Array();	
	this.lights.push(new tingLight(7500, 1750, -7000, 0xFF0000, [1], this.wrapper));
	this.lights.push(new tingLight(-8700,1750, -7000, 0x00FF00, [0,1,1,0], this.wrapper));
	/*
	this.lights.push(new tingLight(-1100,5400, -13800, 0xF0F0FF, [1,0.2,0.2,0.2], this.wrapper));
	this.lights.push(new tingLight(-1300,5400, -13800, 0xF0F0FF, [1,0.2,0.2,0.2], this.wrapper));
	*/
	this.lights.push(new tingLight(-1200,800, 0, 0xF0F0FF, [0.2,0.2,1,0.2], this.wrapper));
	
	this.addToScene = function( scene ) {
		this.wrapper.position.copy(this.cruising.targets[0].vector);
		scene.add( this.wrapper );
		scene.selectable.push( this.mesh );
		//this.sound.play();
	}
	
	this.animationFrame = function( delta ) {
		for (var i = 0; i < this.lights.length; i++ ) {
			this.lights[i].animationFrame( delta );
		}
		this.cruising.animationFrame( delta );
	}
	
}