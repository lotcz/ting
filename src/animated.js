function animatedModel( params ) {
	this.mesh = new THREE.MorphAnimMesh( params.geometry, params.material );	
	this.mesh.duration = _coalesce(params.duration, 2);
	this.mesh.time = _coalesce(params.time, 0);	
}

animatedModel.prototype.animationFrame = function (delta) {
	this.mesh.updateAnimation(delta);
}