function tingScene0( params ) {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 100000 );
	this.camera.position.set( -1000, 3000, -1000 );
	this.camera.lookAt( 0, 2000, 0);
	this.scene.add(this.camera);
	this.animated = [];
	this.pointLight = new THREE.PointLight(0xFFFFFF);
	this.pointLight.position.set( 0, 3000, 0 );
	this.scene.add(this.pointLight);
		
	this.ambientLight = new THREE.AmbientLight(0xf0f0f0);
	this.scene.add(this.ambientLight);
	
	var ax = new axis( { scene:this.scene } );
	
	this.initScene = function ( params ) {
		this.monkey = new THREE.Mesh( params.resources["monkey_geometry"], params.resources["monkey_material"] );			
		this.monkey.scale.set( 200, 200, 200 );
		this.monkey.position.set( 0, 1000, 0 );
		this.scene.add( this.monkey );
		
		this.city1 = new tingCity( {
							startX:0, startY:0, startZ:0, 
							blocksA: 15, blocksB:2, 
							"ground_material":params.resources['city_ground_material'], 
							"car_material":params.resources['trabant_material'], 
							"car_geometry":params.resources['trabant_geometry'],
							"street_texture":params.resources['city_street_texture'],
							buildings_cache:params.resources['city_buildings_cache'], 
							"animated":this.animated, "scene":this.scene } );
	}
	
	this.resetScene = function () {

	}

}