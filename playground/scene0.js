function tingScene0( params ) {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000000 );
	this.camera.position.set( -1000, 3000, -1000 );
	this.camera.lookAt( 0, 2000, 0);
	this.scene.add(this.camera);
	this.animated = [];
	this.pointLight = new THREE.PointLight(0xFFFFFF);
	this.pointLight.position.set( 0, 3000, 0 );
	this.scene.add(this.pointLight);
		
	this.ambientLight = new THREE.AmbientLight(0xf0f0f0);
	this.scene.add(this.ambientLight);
		
	this.initScene = function ( params ) {
	
		this.skybox = new tingSkybox( {"name":"abovesea",camera:this.camera, size:600000} );
		this.scene.add( this.skybox.wrapper );
		
		var water = new tingWater({ x:30000,y:-5000,z:-30000,sizeX:60000,sizeZ:60000,amplitude:300,speed:5, scene:scene, water_texture:resources['water_texture'], floor_texture:resources['floor_texture'], camera:this.camera });
		this.scene.add(water.wrapper);	
		this.animated.push(water);
	
		//this.monkey = new THREE.Mesh( params.resources["monkey_geometry"], params.resources["monkey_material"] );			
		//this.monkey.scale.set( 200, 200, 200 );
		//this.monkey.position.set( 0, 1000, 0 );
		//this.scene.add( this.monkey );
		
		this.city1 = new tingCity( {
							startX:0, startY:0, startZ:0, 
							blocksA: 4, blocksB:20, 
							"ground_material":params.resources['city_ground_material'], 
							"car_material":params.resources['trabant_material'], 
							"car_geometry":params.resources['trabant_geometry'],
							"street_texture":params.resources['city_street_texture'],
							buildings_cache:params.resources['city_buildings_cache'], 
							"animated":this.animated, "scene":this.scene } );
				
		this.car = new THREE.Mesh( params.resources['driver_geometry'], params.resources['driver_material'] );	
		this.car.scale.set( 30, 30, 30 );		
		this.scene.add( this.car );

		this.trabant = new THREE.Mesh( params.resources['trabant_geometry'], params.resources['trabant_material'] );	
		this.trabant.scale.set( 30, 30, 30 );		
		this.scene.add( this.trabant );
		
		this.sparrow = new tingChopper( {
				body_geometry:params.resources['sparrow_body_geometry'],
				body_material:params.resources['sparrow_body_material'], 
				rotor_geometry:params.resources['sparrow_rotor_geometry'], 
				rotor_material:params.resources['sparrow_rotor_material'],
				rotor2_geometry:params.resources['sparrow_rotor2_geometry'], 
				rotor2_material:params.resources['sparrow_rotor2_material'] 
			} 
		);				
		this.animated.push( this.sparrow );
		this.scene.add( this.sparrow.wrapper );
		
		//this.driver = new tingDriver( {mesh:this.trabant, camera:this.camera, element:document} );
		this.driver = new tingDriver( {
										cameraFixed:false,
										mesh:this.sparrow.wrapper, 
										camera:this.camera, 
										element:document} );
		this.animated.push( this.driver );
		
		hud.addContainer( 'speed', { top: "1px", height:"40px", width:"150px", backgroundColor:"#101020", textAlign:"center" } );
		hud.addContainer( 'alt', { top: "1px", left:"300px", height:"50px", width:"400px", backgroundColor:"#101020", textAlign:"center" } );
	}
	
	this.resetScene = function () {
		this.car.position.y = 0;
		this.car.position.x = 0;
		this.car.position.z = 0;
		
	}

}