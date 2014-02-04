function mouseSelect() {
	this.projector = new THREE.Projector();
	this.intersects = null;
	this.intersected = null;
	this.enabled = false;
	this.line = false;
	
	this.findIntersection = function ( mouseX, mouseY, camera, scene ) {	
		var vector = new THREE.Vector3( mouseX, mouseY, 1 );		
		this.projector.unprojectVector( vector, camera );
		
		/* VISUALIZE
		var geometry = new THREE.Geometry();
		var start = camera.position.clone();
		var end = vector.clone();
		start.y -= 100;
		geometry.vertices.push( start );
		geometry.vertices.push( end );
		var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( {color:0xF0F000} ) );
		scene.add( line );
		*/
		
		var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize()  );
		this.intersects = ray.intersectObjects( scene.selectable );
		
		if ( this.intersects.length > 0 ) {
				this.intersects.sort(_dynamicSort("distance"));
				this.intersected = this.intersects[ 0 ];				
				return true;
		} else {
			this.intersected = null;
			return false;
		}
				
	}	
	
	this.mouseDown = function (x, y, camera, scene) {	
		if (DEBUG_MODE) {
			if (this.findIntersection(x, y, camera, scene )) {
				console.log(this.intersected);
				if (this.intersected.object) {
					inspector2.reset();
					inspector2.inspectObject3D(this.intersected.object, 'Selected', 10, true );
				}				
			}
		} else if (this.enabled) {
			if (this.findIntersection(x, y, camera, scene )) {					
				if (this.intersected.object.cloud && this.intersected.object.cloud.active) {	
					for(var i = 0, max = this.intersects.length, nclouds = 17; (i < max) && (nclouds > 0); i++) {
						if (this.intersects[i].object.cloud && this.intersects[i].object.cloud.active) {
							this.intersects[i].object.cloud.tingClick();
							nclouds--;
						}
					}
					audio.cloud.play();
				} else if (this.intersected.object.airplane) {
					audio.airplane.play();
				} else if (this.intersected.object.eagle) {
					audio.eagle.play();
				}				
			}
		}		
	}
	
}


