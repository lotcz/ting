function tingClouds ( params ) {

	if (params == null) params = {};
	this.AMOUNTX = coalesce(params.amountX, 50);
	this.AMOUNTY = coalesce(params.amountY, 50);
	this.SEPARATION = coalesce(params.separation, 100);
	this.x = coalesce(params.x, 0);
	this.y = coalesce(params.y, 0);
	this.z = coalesce(params.z, 0);
	this.speed = coalesce(params.speed, 1);
	this.amplitude = coalesce(params.amplitude, 150); 
	this.clouds = new Array();
	this.count = 0;
	this.pauseAnimation = false;
	
	this.addToScene = function (scene) {		
		var map1 = THREE.ImageUtils.loadTexture( "images/cloud256.png" );		
		var material1 = new THREE.SpriteMaterial( { map: map1, opacity: 1, useScreenCoordinates: false } );
		var i = 0, cloud;
		this.scene = scene;

		for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {

			for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
				cloud = this.clouds[ i ++ ] = new tingCloud( {
					material: material1,
					x: this.x + ((Math.random()*100) - 50) + ( ix * this.SEPARATION ),
					y: this.y,
					z: this.z + ((Math.random()*100) - 50) + ( iy * this.SEPARATION ) }
				);
				scene.add( cloud.particle );				
			}
		}
	}
	
	this.animationFrame = function (delta) {
		if (!this.pauseAnimation) {
			var i = 0;
			this.count += (delta * this.speed);
			for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
				for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
					cloud = this.clouds[ i++ ];
					if (cloud.active) {
						if (cloud.animationStarted) {
							cloud.particle.material.opacity -= 0.1;
							cloud.particle.scale.set( cloud.particle.scale.x + 35, cloud.particle.scale.y + 35, 1);
							if (cloud.particle.material.opacity <= 0) {
								this.scene.remove(cloud.particle);
								cloud.active = false;
							}
						} else {
							cloud.particle.position.y = cloud.moveY + ( Math.sin( ( ix + this.count ) * 0.5 ) * this.amplitude ) + ( Math.sin( ( iy + this.count ) * 0.5 ) * this.amplitude );
						}
					}
				}
			}
		}		
	}
	
}

function tingCloud( params ) {
	this.particle = new THREE.Sprite( params.material );				
	this.particle.scale.x = 100 + Math.random()*100;
	this.particle.scale.y = 100 + Math.random()*100;
	this.particle.position.x = coalesce(params.x, 0);
	this.moveY = coalesce(params.y, 0);
	this.particle.position.z = coalesce(params.z, 0);
	this.particle.cloud = this;
	this.animationStarted = false;
	this.active = true;
}

tingCloud.prototype.tingClick = function() {
	if (!this.animationStarted) {
		this.particle.material = this.particle.material.clone();
		this.animationStarted = true;
		audio.laser.play();		
	}
}