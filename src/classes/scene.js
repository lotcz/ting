function tingScene( params ) {
	this.scene = new THREE.Scene();
	this.animated = [];

	/* camera*/
	this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000000 );
	this.camera.position.set( -1000, 3000, -1000 );
	this.camera.lookAt( 0, 0, 0);
	this.scene.add(this.camera);
	
	this.ambientLight = new THREE.AmbientLight(0xf0f0f0);
	this.scene.add(this.ambientLight);
	
}

tingScene.prototype.loadFromJSON = function ( json, resources ) {

	
}