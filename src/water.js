function tingWater ( params ) {

	this.AMOUNTX = _coalesce(params.amountX, 100);
	this.AMOUNTY = _coalesce(params.amountY, 100);
	this.SEPARATION = _coalesce(params.separation, 100);
	this.x = _coalesce(params.x, 0);
	this.y = _coalesce(params.y, 0);
	this.z = _coalesce(params.z, 0);
	this.speed = _coalesce(params.speed, 10);
	this.scale = _coalesce(params.scale, 1);
	this.amplitude = _coalesce(params.amplitude, 50); 
	this.count = 1.5;
	this.enabled = true;
	this.parts = new Array();
	this.wrapper = new THREE.Object3D();
	this.wrapper.position.set( this.x, this.y, this.z);
	
	this.sizeX = 10000;
	this.sizeZ = 10000;
	this.sizeY = 5000;
	
	/* floor */
	
	var floor_geometry = new THREE.PlaneGeometry( this.sizeX, this.sizeZ );	
	var floor_material = new THREE.MeshLambertMaterial( { color: 0xdfdfdf, map: params.floor_texture, side: THREE.DoubleSide } );
	var floor_mesh = new THREE.Mesh( floor_geometry, floor_material );			
	floor_mesh.rotation.x = Math.PI/2;	
	this.wrapper.add( floor_mesh );
	
	/* walls */
	
	var wall_geometry = new THREE.PlaneGeometry( this.sizeZ, this.sizeY );	
	var wall_material = new THREE.MeshLambertMaterial( { color: 0xafafaf, map: params.floor_texture, side: THREE.DoubleSide } );
	
	var wall_mesh = new THREE.Mesh( wall_geometry, wall_material );			
	wall_mesh.position.x = this.sizeX / 2;	
	wall_mesh.position.y = this.sizeY / 2;
	wall_mesh.rotation.y = Math.PI/2;
	this.wrapper.add( wall_mesh );
	
	var wall_mesh = new THREE.Mesh( wall_geometry, wall_material );			
	wall_mesh.position.x = - this.sizeX / 2;	
	wall_mesh.position.y = this.sizeY / 2;
	wall_mesh.rotation.y = Math.PI + Math.PI/2;
	this.wrapper.add( wall_mesh );
	
	wall_geometry = new THREE.PlaneGeometry( this.sizeX, this.sizeY );
	
	var wall_mesh = new THREE.Mesh( wall_geometry, wall_material );			
	wall_mesh.position.z = this.sizeZ / 2;	
	wall_mesh.position.y = this.sizeY / 2;
	this.wrapper.add( wall_mesh );
	
	var wall_mesh = new THREE.Mesh( wall_geometry, wall_material );			
	wall_mesh.position.z = - this.sizeZ / 2;	
	wall_mesh.position.y = this.sizeY / 2;
	wall_mesh.rotation.y = - Math.PI;
	this.wrapper.add( wall_mesh );
	
	/* water */
	
	var water_geometry = new THREE.PlaneGeometry( this.sizeX, this.sizeZ, this.AMOUNTX, this.AMOUNTY );	
	var water_material = new THREE.MeshLambertMaterial( { color: 0x000000, map: params.water_texture, opacity:0.95, transparent: true,side: THREE.DoubleSide } );
	this.mesh = new THREE.Mesh( water_geometry, water_material );			
	this.mesh.rotation.x = Math.PI/2;
	this.mesh.position.y = this.sizeY - (2 * this.amplitude);
	this.wrapper.add( this.mesh );
		
	this.fog = new THREE.FogExp2( 0x0007a0, 0 );
	params.scene.fog = this.fog;
	
	this.box = new THREE.Box3();
	this.box.setFromObject(this.wrapper);
	//this.box.max.y -= (2 * this.amplitude);
	
	this.animationFrame = function (delta) {
		if (this.enabled) {
			var i = 0, vertex;
			this.count += (delta * this.speed);
			for ( var ix = 0; ix <= this.AMOUNTX; ix ++ ) {
				for ( var iy = 0; iy <= this.AMOUNTY; iy ++ ) {					
					vertex = this.mesh.geometry.vertices[ i++ ];					
					vertex.z = ( Math.sin( ( ix + this.count ) * 0.5 ) * this.amplitude ) + ( Math.sin( ( iy + this.count ) * 0.5 ) * this.amplitude );
				}			
			}
			this.mesh.geometry.verticesNeedUpdate = true;
			
			if (this.box.containsPoint(camera.position)) {
				this.fog.density = ( 1.1 - ( 0.5 * Math.abs( camera.position.y - this.y ) / this.sizeY ) ) * 0.0005;
				console.log("in");
			} else {
				this.fog.density = 0;
				console.log("out");
			}
		}		
	}
	
}