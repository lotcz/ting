function tingCruising( params ) {
	this.next_target = false;
	this.step = false;
	this.distance_left = 0;
	this.check_interval = 1;
	this.mesh = params.mesh;
}

tingCruising.prototype.findNextTarget = function( ) {	
	this.next_target = this.next_target.neighbours[ Math.floor( Math.random() * (this.next_target.neighbours.length) ) ];
	this.distance_left = this.mesh.position.distanceTo(this.next_target.vector);
	this.step = this.next_target.initStep( this.mesh.position );
	this.distance_last_check = 0;	
	this.mesh.lookAt( this.next_target.vector );
}

tingCruising.prototype.set = function( target ) {	
	this.mesh.position.copy( target.vector );
	this.next_target = target;
	this.findNextTarget();	
}

tingCruising.prototype.animationFrame = function( delta ) {
		
	if ( delta > 3 ) {			
		/* if idle for more than 3 seconds jump right to next target */		
		this.set( this.next_target );		
	} else {
		
		/* check for new target */
		if (this.distance_last_check > this.check_interval) {
			if ( this.distance_left <= 0 ) {
				this.findNextTarget();			
			}
			this.distance_last_check = 0;
		} else {
			this.distance_last_check++;
		}
		
		/* move mesh */
		var step = new THREE.Vector3();	
		step.copy( this.step );
		step.multiplyScalar( delta );
		this.distance_left -= step.length();
		this.mesh.position.add( step );
		
		if (this.next_target.coordSprite) {
			this.next_target.coordSprite.position.copy( this.mesh.position );
			this.next_target.coordSprite.position.y += 200;
		}
	}
}
	
function cruisingTargets( params ) {	
	this.targets = new Array();
}

cruisingTargets.prototype.add = function( target ) {

	for (var i = 0, max = this.targets.length; i < max; i++ ) {
		if (( this.targets[i].vector.x == target.vector.x ) 
		&& ( this.targets[i].vector.y == target.vector.y ) 
		&& ( this.targets[i].vector.z == target.vector.z ) ) {
			_append( this.targets[i].neighbours, target.neighbours );
			return this.targets[i]
		}
	}
	
	this.targets.push( target );
	return target;
}


function cruisingTarget( x, y, z, speed ) {	
	this.vector = new THREE.Vector3( x, y, z);
	this.speed = speed;
	this.neighbours = new Array();
}

cruisingTarget.prototype.initStep = function( position ) {
	var step = new THREE.Vector3();
	step.subVectors( this.vector, position );
	step.setLength( this.speed );
	return step;
}
	
cruisingTarget.prototype.addToScene = function( n, scene ) {
	this.coordSprite = makeTextSprite( " " + this.vector.x + "," + this.vector.z + " ", 
		{ fontsize: 20, fontColor: {r:200, g:200, b:0, a:0.8},  borderColor: {r:200, g:200, b:0, a:1}, backgroundColor: {r:40, g:40, b:0, a:0.5} } );
	this.coordSprite.position.copy ( this.vector ); 
	this.coordSprite.position.y += 100;	
	
	this.nameSprite = makeTextSprite( " TiNG " + n + " ", { fontsize: 52, borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:20, g:20, b:30, a:0.5} } );
	this.nameSprite.position.copy ( this.vector );
	this.nameSprite.position.y += 300;
	
	var ch = (n % 2 == 0) ? " ~ " : " x ";
	this.arrowSprite = makeTextSprite( ch , 
		{ fontsize: 80, fontface:"Webdings", fontColor: {r:200, g:200, b:0, a:0.8},  borderColor: {r:200, g:200, b:0, a:1}, backgroundColor: {r:40, g:40, b:0, a:0.5} } );
	this.arrowSprite.position.copy ( this.vector ); 
	this.arrowSprite.position.y += 700;	
	
	scene.add( this.nameSprite );
	scene.add( this.coordSprite );		
	scene.add( this.arrowSprite );		
}	
	