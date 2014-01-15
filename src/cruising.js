function tingCruising( mesh ) {
	this.targets = new Array();
	this.next_position = 0;
	this.distance = -1;
	this.distance_last_check = 101;
	this.mesh = mesh;
	
	this.addTarget = function ( x, y, z, speed, iterations ) {	
		this.targets.push( new cruisingTarget( x, y, z, speed, iterations ) );	
	}
	
	this.reset = function() {
		this.mesh.position.copy(this.targets[0].vector);
		this.next_position = 0;
		this.distance_last_check = 101;
		this.distance = -1;
	}
		
	this.animationFrame = function( delta ) {
		
		/* check for new target */
		if (this.distance_last_check > 100) {
			this.last_distance = this.distance;
			this.distance = this.mesh.position.distanceTo(this.targets[this.next_position].vector);
			
			if (this.distance > this.last_distance) {
				this.next_position++;
				if (this.next_position >= this.targets.length) {
					this.next_position = 0;
				}
				this.distance = this.mesh.position.distanceTo(this.targets[this.next_position].vector);
				this.targets[this.next_position].initStep( this.mesh.position );
				this.distance_last_check = 0;
				this.mesh.lookAt( this.targets[this.next_position].vector );
			}
		} else {
			this.distance_last_check++;
		}
		
		/* move mesh */
		this.mesh.position.add( this.targets[this.next_position].getStep(delta) );
	}
	
	this.calculateIterations = function() {
		
		var prev_target, prev_pos, next_pos;
		var diff = new THREE.Vector3();
		
		for ( var i = 0; i < this.targets.length; i++) {
			if ( this.targets[i].iterations ) {
				prev_target = (i == 0) ? this.targets.length-1 : i-1;
				prev_pos = this.targets[prev_target].vector;
				next_pos = this.targets[i].vector;
				diff.subVectors( next_pos, prev_pos );
				diff.divideScalar(this.targets[i].iterations);
				for (var j = 1; j <= this.targets[i].iterations; j++) {
					this.targets.splice( i, 0, new cruisingTarget( (prev_pos.x + (j * diff.x), prev_pos.y + (j * diff.y), prev_pos.z + (j * diff.z), this.targets[i].speed ) ) );
				}
			}		
		}
	}
}

function cruisingTarget(x, y, z, speed, iterations) {
	
		this.vector = new THREE.Vector3(x,y,z);
		this.speed = speed;
		this.iterations = iterations;
		this.step = new THREE.Vector3();
		
		this.initStep = function(position) {
			this.step.subVectors(this.vector, position );
			this.step.setLength(this.speed);
		}
		
		this.getStep = function(delta) {
			var step = new THREE.Vector3();
			step.copy(this.step);
			step.multiplyScalar(delta);
			return step;
		}
	
}
