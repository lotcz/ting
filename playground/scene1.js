function tingScene1( params ) {
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
	
		this.skybox = new tingSkybox( {"name":"grim",camera:this.camera, size:600000} );
		this.scene.add( this.skybox.wrapper );
			
		this.car = new THREE.Mesh( params.resources['ferrambo_geometry'], params.resources['ferrambo_material'] );	
		this.car.scale.set( 30, 30, 30 );		
		this.scene.add( this.car );
		
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
		
		
	}

}