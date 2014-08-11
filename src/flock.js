function flockOfBirds( params ) {
	this.count = _coalesce( params.count, 11 );
	this.wrapper = new THREE.Object3D();
	this.animated = [];
	
	for (var i = 0, max = this.count; i < max; i++ ) {
		var bird = new animatedModel( { "geometry":params.geometry, "material":params.material, "duration": params.duration, "time":(Math.random()*params.duration) } );	
		var row = Math.ceil(i / 2);
		bird.mesh.position.x = row * ( (i % 2) - 0.5 ) * 80;
		bird.mesh.position.y = 0;
		bird.mesh.position.z = - row * 80;
		this.wrapper.add(bird.mesh);
		this.animated.push(bird);
	}
}

flockOfBirds.prototype.animationFrame = function (delta) {
	for (var i = 0, max = this.animated.length; i < max; i++ ) {
		this.animated[i].animationFrame(delta);
	}
}