function tingClouds (x, y, z, AMOUNTX, AMOUNTY, SEPARATION ) {

	this.AMOUNTX = AMOUNTX;
	this.AMOUNTY = AMOUNTY;
	this.SEPARATION = SEPARATION;
	this.x = x;
	this.y = y;
	this.z = z;
	this.particles = new Array();
	this.count = 0;
	
	this.addToScene = function (scene) {		
		var map1 = THREE.ImageUtils.loadTexture( "images/cloud256.png" );		
		var material = new THREE.SpriteMaterial( { map: map1, opacity: 1, useScreenCoordinates: false } );
		
		var particle;
		var i = 0;

		for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

			for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
				particle = this.particles[ i ++ ] = new THREE.Sprite( material );				
				particle.scale.x = 100 + Math.random()*100;
				particle.scale.y = 100 + Math.random()*100;
				particle.moveY = this.y;
				particle.position.x = this.x + ((Math.random()*100) - 50) + ( ix * this.SEPARATION );
				particle.position.z = this.z + ((Math.random()*100) - 50) + ( iy * this.SEPARATION );
				scene.add( particle );				
			}
		}
	}

	this.animationFrame = function () {
		var i = 0;

		for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

			for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
				particle = this.particles[ i++ ];
				particle.position.y = particle.moveY + ( Math.sin( ( ix + this.count ) * 0.3 ) * 15 ) + ( Math.sin( ( iy + this.count ) * 0.5 ) * 15 );
			}

		}

		this.count += 0.05;
	}
}