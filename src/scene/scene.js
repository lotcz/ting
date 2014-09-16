function tingScene( params ) {
	this.scene = new THREE.Scene();
	this.animated = [];
	this.objects = [];

	/* camera*/
	this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000000 );
	this.camera.position.set( -3000, 3000, -3000 );
	this.camera.lookAt( 0, 0, 0);
	this.scene.add(this.camera);
	
	this.ambientLight = new THREE.AmbientLight(0xf0f0f0);
	this.scene.add(this.ambientLight);
	
}

tingScene.prototype.add = function ( object ) {
	this.objects.push( object );
	object.addToScene( this.scene );
}

tingScene.prototype.remove = function ( object ) {
	_remove(this.objects, object );
	object.removeFromScene( this.scene );
}

tingScene.prototype.removeAll = function ( ) {
	for(var i = 0, max = this.objects.length; i < max; i++) {
		this.remove(this.objects[i]);
	}
}

tingScene.prototype.render = function ( renderer ) {
	renderer.render( this.scene, this.camera );	
}

tingScene.prototype.loadFromJSON = function ( json, resources ) {

	
}

tingScene.prototype.setAspectRatio = function ( aspect ) {
	this.camera.aspect = aspect;
	this.camera.updateProjectionMatrix();	
}