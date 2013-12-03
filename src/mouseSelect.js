function mouseSelect()
{
	this.x = 0;
	this.y = 0;
	this.projector = new THREE.Projector();
	this.intersected = null;
	this.intersectedID = 0;
	
	this.animationFrame = function (camera, scene) {

		if (false) {
			var vector = new THREE.Vector3( this.x, this.y, 1 );
			this.projector.unprojectVector( vector, camera );
			var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

			var intersects = ray.intersectObjects( scene.children );
			
			if ( intersects.length > 0 )
			{

				if ( ( intersects[ 0 ].object.id != this.intersectedID ) && ( intersects[ 0 ].object != this.moonGlow ) )
				{

					if ( this.intersected ) this.clearSelection();
					
					this.intersected = intersects[ 0 ];
					this.intersectedID = this.intersected.object.id;
					
					if (this.intersected && this.intersected.object.selectable) {
			
						if (this.intersected.object.geometry) {
							var customMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } );
							var customGeometry = this.intersected.object.geometry.clone();
							this.moonGlow = new THREE.Mesh( customGeometry, customMaterial );
							this.moonGlow.position.x = this.intersected.object.position.x;
							this.moonGlow.position.y = this.intersected.object.position.y ;
							this.moonGlow.position.z = this.intersected.object.position.z;
							this.moonGlow.rotation.x = this.intersected.object.rotation.x;
							this.moonGlow.rotation.y = this.intersected.object.rotation.y;
							this.moonGlow.rotation.z = this.intersected.object.rotation.z;
							this.moonGlow.scale.set(this.intersected.object.scale.x ,this.intersected.object.scale.y ,this.intersected.object.scale.z );
							scene.add( this.moonGlow );
						}
					}
				}
			} 
			else // there are no intersections
			{
				this.clearSelection()
			}
		} else {
			if (this.intersected) {
				this.clearSelection()
			}
		}
	}

	this.clearSelection = function() {
		scene.remove(this.moonGlow);
		this.moonGlow = null;
		this.intersected = null;		
	}
	
	this.mouseDown = function () {	
		
		if (this.intersected) {
			/* click event here */	
			}
		
	}
	
}


