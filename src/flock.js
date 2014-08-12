function flockOfBirds( params ) {
	this.count = _coalesce( params.count, 11 );
	this.wrapper = new THREE.Object3D();
	this.animated = [];
	
	var randomModX = 0;
	
	for (var i = 0, max = this.count; i < max; i++ ) {
		var bird = new animatedModel( { "geometry":params.geometry, "material":params.material, "duration": params.duration, "time":(Math.random()*params.duration) } );	
		if (_prob( 5 )) {
			randomModX += 10;
		}
		if (_prob( 5 )) {
			randomModX -= 10;
		}
		var row = Math.ceil(i / 2);
		bird.mesh.position.x = (row * ( (i % 2) - 0.5 ) * (80 + randomModX));
		bird.mesh.position.y = _random(0, 40);
		bird.mesh.position.z = - row * 160;
		this.wrapper.add(bird.mesh);
		this.animated.push(bird);
	}
}

flockOfBirds.prototype.animationFrame = function (delta) {
	for (var i = 0, max = this.animated.length; i < max; i++ ) {
		this.animated[i].animationFrame(delta);
	}
}