function tingClouds ( AMOUNTX, AMOUNTY, SEPARATION ) {

	this.AMOUNTX = 10;
	this.AMOUNTY = 500;
	this.SEPARATION = 350;
	
	this.particles = new Array();
	this.count = 0;
	
	this.addToScene = function (scene) {		
		var map1 = THREE.ImageUtils.loadTexture( "../images/cloud256.png" );		
		var material = new THREE.SpriteMaterial( { map: map1, opacity: 1, useScreenCoordinates: false } );
		
		var particle;
		var i = 0;

		for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

			for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
				particle = this.particles[ i ++ ] = new THREE.Sprite( material );				
				particle.deformX = 1 + (Math.random()*0.5);
				particle.deformY = 1 + (Math.random());
				particle.position.x = ((Math.random()*1000) - 500) + ( ix * this.SEPARATION - ( ( this.AMOUNTX * this.SEPARATION ) / 2 ) );
				particle.position.z = ((Math.random()*1000) - 500) + ( iy * this.SEPARATION - ( ( this.AMOUNTY * this.SEPARATION ) / 2 ) );
				scene.add( particle );				
			}
		}
	}

	this.animationFrame = function () {
		var i = 0;

		for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

			for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
				particle = this.particles[ i++ ];
				particle.position.y = ( Math.sin( ( ix + this.count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + this.count ) * 0.5 ) * 50 );
				particle.scale.x = particle.deformX * ( 500 + ( ( Math.sin( ( ix + this.count ) * 0.3 ) + 1 ) * 4 + ( Math.sin( ( iy + this.count ) * 0.5 ) + 1 ) * 10 ));
				particle.scale.y = particle.deformY * ( 500 + ( ( Math.sin( ( ix + this.count ) * 0.3 ) + 1 ) * 4 + ( Math.sin( ( iy + this.count ) * 0.5 ) + 1 ) * 10 ));
			}

		}

		this.count += 0.1;
	}
}