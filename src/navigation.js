function tingNavigation(camera, airplane) {

	this.camera = camera;
	this.airplane = airplane;
	
	this.animationFrame = function () {	
		this.camera.position.copy(this.airplane.position);
	}
}
