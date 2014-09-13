function tingDriver( params ) {
	this.camera = params.camera;
	this.mesh = params.mesh;
	this.element = params.element;
	this.enabled = true;
	this.movementEnabled = true;
	this.maxSpeed = 3200;
	this.minSpeed = -2000;
	this.acceleration = 1100;
	this.actualSpeed = 0;
	this.speedPortion = 0;
	this.target = new THREE.Vector3();
	
	this.animationFrame = function( delta ) {
		if ( this.enabled ) {				
			if ( this.moveForward ) {
				if (this.actualSpeed >= 0) {
					/* accelerating */				
					this.actualSpeed = Math.min( this.actualSpeed + ( delta * this.acceleration), this.maxSpeed );
				} else {
					/* braking backwards */
					this.actualSpeed = Math.min( this.actualSpeed + (4 * delta * this.acceleration), 0 );
				}				
			} else if ( this.moveBackward ) {
				if (this.actualSpeed > 0) {
					/* braking */
					this.actualSpeed = Math.max( this.actualSpeed - (4 * delta * this.acceleration), 0 );
				} else {
					/* going backwards */
					this.actualSpeed = Math.max( this.actualSpeed - (delta * this.acceleration), this.minSpeed );
				}
			} else {
				/* loosing speed to 0 */
				if (this.actualSpeed > 0) {
					this.actualSpeed = Math.max( this.actualSpeed - (0.5 * delta * this.acceleration), 0 );
				} else {
					this.actualSpeed = Math.min( this.actualSpeed + (0.5 * delta * this.acceleration), 0 );
				}				
			}

			if (this.actualSpeed > 0) {
				this.speedPortion = this.actualSpeed / Math.max(this.maxSpeed, 1);
			} else {
				this.speedPortion = 0;
			}
			
			if ( this.actualSpeed != 0 ) {
				this.mesh.position.x += delta * this.actualSpeed * Math.sin( this.mesh.rotation.y );
				this.mesh.position.z += delta * this.actualSpeed * Math.cos( this.mesh.rotation.y );
			}
			
			if ( this.moveLeft ) {
				this.mesh.rotation.y += (3.5 - (2.5 * this.speedPortion)) * delta;
			}
			
			if ( this.moveRight ) {
				this.mesh.rotation.y -= (3.5 - (2.5 * this.speedPortion)) * delta;
			}
			
			this.camera.position.x = this.mesh.position.x - ( Math.sin( this.mesh.rotation.y ) * (700 - (550 * this.speedPortion) ) );
			this.camera.position.y = this.mesh.position.y + 380 - (300 * this.speedPortion);
			this.camera.position.z = this.mesh.position.z - ( Math.cos( this.mesh.rotation.y ) * (700 - (550 * this.speedPortion) ) );
			this.target.set( this.mesh.position.x, this.mesh.position.y + 70 + (10 * this.speedPortion), this.mesh.position.z); 
			this.camera.lookAt( this.target );
			
			hud.updateContainer( 'speed', _round( this.actualSpeed, -2 ) );
		}
	}
	
	this.onKeyDown = function ( event ) {
		if (this.movementEnabled) {
			//event.preventDefault();
			switch ( event.keyCode ) {
				
				case 38: /* UP, FORWARD */
				case 87: /* W */ 
					this.moveForward = true;
					this.moveBackward = false;
				break;
				
				case 40: /* DOWN, BACKWARD */
				case 83: /*S*/
					this.moveBackward = true; 
					this.moveForward = false;
				break;
				
				case 37: /*left*/
				case 65: /*A*/ this.moveLeft = true; break;
				
				case 39: /*right*/
				case 68: /*D*/ this.moveRight = true; break;
				case 82: /*R*/ this.moveUp = true; break;
				case 70: /*F*/ this.moveDown = true; break;
			}
		}
	};

	this.onKeyUp = function ( e ) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		//console.log("key:" + key);
		if (this.movementEnabled) {
			switch( key ) {
				case 38: /*up*/
				case 87: /*W*/ this.moveForward = false; break;
				case 37: /*left*/
				case 65: /*A*/ this.moveLeft = false; break;
				case 40: /*down*/
				case 83: /*S*/ this.moveBackward = false; break;
				case 39: /*right*/
				case 68: /*D*/ this.moveRight = false; break;
				case 82: /*R*/ this.moveUp = false; break;
				case 70: /*F*/ this.moveDown = false; break;				
			}
		}
		
		switch( key ) {
			case 80: /*P*/ this.lookEnabled=!this.lookEnabled;break;
		}
	}		
	
	this.element.addEventListener( 'keydown', bind( this, this.onKeyDown) , false );	
	this.element.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );
	
	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		}
	}
}