function tingClouds ( params ) {

	this.AMOUNTX = _coalesce(params.amountX, 50);
	this.AMOUNTY = _coalesce(params.amountY, 50);
	this.SEPARATION = _coalesce(params.separation, 100);
	this.x = _coalesce(params.x, 0);
	this.y = _coalesce(params.y, 0);
	this.z = _coalesce(params.z, 0);
	this.speed = _coalesce(params.speed, 1);
	this.scale = _coalesce(params.scale, 1);
	this.amplitude = _coalesce(params.amplitude, 150); 
	this.count = 1.5;
	this.paused = false;
	this.clouds = new Array();
	this.wrapper = new THREE.Object3D();

	var i = 0, cloud;
	for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {
			cloud = new tingCloud( {
				scale:this.scale,
				material: params.material,
				geometry: params.geometry,
				x: this.x + ((Math.random()*100) - 50) + ( ix * this.SEPARATION ),
				y: this.y + ( Math.sin( ( ix + this.count ) * 0.5 ) * this.amplitude ) + ( Math.sin( ( iy + this.count ) * 0.5 ) * this.amplitude ),
				z: this.z + ((Math.random()*100) - 50) + ( iy * this.SEPARATION ) }
			);
			this.wrapper.add( cloud.particle );				
			this.clouds.push( cloud );	
		}
	}
		
	this.addToScene = function (scene) {			
		scene.add(this.wrapper);	
	}
	
	this.animationFrame = function (delta) {
		if (!this.paused) {
			var i = 0;
			this.count += (delta * this.speed);
			for ( var ix = 0; ix < this.AMOUNTX; ix ++ ) {
				for ( var iy = 0; iy < this.AMOUNTY; iy ++ ) {					
					cloud = this.clouds[ i++ ];
					if (cloud.active) {
						if (cloud.animationStarted) {
							if (cloud.particle.material.opacity <= 0) {
								this.wrapper.remove(cloud.particle);
								_remove( scene.selectable, cloud.particle );
								cloud.active = false;
							} else {
								cloud.particle.material.opacity -= 0.05;
								cloud.particle.scale.set( cloud.particle.scale.x + (this.scale/6), cloud.particle.scale.y + (this.scale/6), 1);							
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
	//this.particle = new THREE.Sprite( params.material );				
	this.particle = new THREE.Mesh( params.geometry, params.material );	
	this.scale = params.scale + ( params.scale * Math.random() * 2 );
	this.particle.scale.set( this.scale, this.scale, this.scale );	
	this.particle.position.x = _coalesce(params.x, 0);
	this.particle.position.y = _coalesce(params.y, 0);
	this.moveY = _coalesce(params.y, 0);
	this.particle.position.z = _coalesce(params.z, 0);
	this.particle.cloud = this;
	this.animationStarted = false;
	this.active = true;
}

tingCloud.prototype.tingClick = function() {
	if (!this.animationStarted) {
		this.particle.material = this.particle.material.clone();
		this.animationStarted = true;		
	}
}