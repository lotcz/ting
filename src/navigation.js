function tingNavigation(camera, airplane) {

	this.camera = camera;
	this.airplane = airplane;
	
	this.animationFrame = function () {	
		this.camera.position.x = this.airplane.position.x - 700;
	}
}
