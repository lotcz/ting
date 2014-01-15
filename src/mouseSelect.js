function mouseSelect() {
	this.projector = new THREE.Projector();
	this.intersects = null;
	this.intersected = null;
	this.enabled = true;
	
	this.findIntersection = function ( mouseX, mouseY, camera, scene ) {
	
		var vector = new THREE.Vector3( mouseX, mouseY, 1 );
		this.projector.unprojectVector( vector, camera );
		var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
		this.intersects = ray.intersectObjects( scene.selectable );
		
		if ( this.intersects.length > 0 ) {
				this.intersected = this.intersects[ 0 ];
				console.log(this.intersected);
				return true;
		} else {
			this.intersected = null;
			return false;
		}
				
	}	
	
	this.mouseDown = function (x, y, camera, scene) {	
		if (this.enabled) {
			if (this.findIntersection(x, y, camera, scene )) {				
				if (this.intersected.object.cloud && this.intersected.object.cloud.active) {
					var n = 5;
					for(var i = 0, max = this.intersects.length; ((i < max) && (n > 0)); i++) {
						if (this.intersects[i].object.cloud) {
							this.intersects[i].object.cloud.tingClick();
							n--;
						}
					}
					audio.laser.play();
				} else if (this.intersected.object.airplane) {
					audio.airplane.play();
				} else if (this.intersected.object.eagle) {
					audio.eagle.play();
				}				
			}
		}		
	}
	
}


