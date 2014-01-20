function tingControls( params ) {

	this.camera = params.camera;
	this.element = _coalesce( params.element, document );
	this.vertSpeed = _coalesce( params.vertSpeed, 0.1 );
	this.horizSpeed = _coalesce( params.horizSpeed, 0.1 );
	this.target = _coalesce( params.target, new THREE.Vector3( 0, 0, 0 ) );
	this.vertMin = _coalesce( params.vertMin, -15 );
	this.vertMax = _coalesce( params.vertMax, 15 );
	this.horizMin = _coalesce( params.horizMin, -45 );
	this.horizMax = _coalesce( params.horizMax, 45 );
	this.viewHalfX = 0;
	this.viewHalfY = 0;
	this.mouseX = 0;
	this.mouseY = 0;
	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;
	
	this.handleResize = function () {
		if ( this.element === document ) {
			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;
		} else {
			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;
		}
	}
	
	this.onMouseMove = function( event ) {
		if ( this.element === document ) {
			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
		} else {
			this.mouseX = event.pageX - this.element.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.element.offsetTop - this.viewHalfY;
		}
		//this.mouseX = Math.pow( this.mouseX, 4 );
		//this.mouseY = Math.pow( this.mouseY, 4 );
	}
	
	this.animationFrame = function( delta ) {
		
		this.lat -= this.mouseY * this.vertSpeed * delta;
		this.lat = Math.max( this.vertMin , Math.min( this.vertMax, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );
		
		this.lon += this.mouseX * this.horizSpeed * delta;
		this.lon = Math.max( this.horizMin , Math.min( this.horizMax, this.lon ) );
		this.theta = THREE.Math.degToRad( this.lon );

		this.target.x = this.camera.position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		this.target.y = this.camera.position.y + 100 * Math.cos( this.phi );
		this.target.z = this.camera.position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.camera.lookAt( this.target );
		
	}
		
	this.reset = function() {
		this.lat = this.vertMin + ( (this.vertMax - this.vertMin) / 2 );
		this.lon = this.horizMin + ( (this.horizMax - this.horizMin) / 2 );
		this.animationFrame( 0 );
	}
	
	this.handleResize();
}