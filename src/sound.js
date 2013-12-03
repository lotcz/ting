function tingSound( sources, radius, volume ) {

	this.position = new THREE.Vector3();
	this.audio = document.createElement( 'audio' );
	this.radius = radius;
	this.volume = volume;
	
	for ( var i = 0; i < sources.length; i ++ ) {
		var source = document.createElement( 'source' );
		source.src = sources[ i ];
		this.audio.appendChild( source );
	}

	this.play = function () {
		this.audio.play();
	}

	this.pause = function () {
		this.audio.pause();
	}
	
	this.animationFrame = function ( camera ) {
		if ( (this.radius > 0) && (this.volume > 0) ) {
			var distance = this.position.distanceTo( camera.position );

			if ( distance <= this.radius ) {
				this.audio.volume = this.volume * ( 1 - (distance / this.radius) );
			} else {
				this.audio.volume = 0;
			}
		}
	}

}