function renderScene() {

	loader.add('Scene initialization');

	var scale = 500;
	
	scene = new THREE.Scene();
	scene.selectable = [];
	
	camera = new THREE.PerspectiveCamera( 35, 1, 1, scale * 10000 );
	scene.add(camera);
	
	/* CONTROLS */
			
	controls = new tingControls({ "camera":camera, element: hud.element });
	mouse = new mouseSelect();
	
	/* AUDIO */	
	
	loader.add('Audio tracks');
	audio = new tingAudio( function () { loader.notify('Audio tracks'); } );
	
	
	/* SKYBOX */
	var imagePrefix = "images/grim-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( scale * 500, scale * 500, scale * 500 );	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide,
			color: 0x909090
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skybox = new THREE.Mesh( skyGeometry, skyMaterial );	
	scene.add( skybox );
	
	/* MOUNTAINS */
	/*
	mountains = new tingMountains();
	mountains.addToScene(scene);
	*/
	
	/* THE CITY */
	
	var jsonCarLoader = new THREE.JSONLoader();
	jsonCarLoader.load( "models/buggy.js", 
		function ( geometry, materials ) {
		 
		var car_material = new THREE.MeshFaceMaterial( materials );	
		var car_geometry = geometry;
		
		/* OUR HERO */
		var car = new tingCar( {geometry:car_geometry, material:car_material, scene:scene, animated:animated } );
		var hero = new tingPlayer( {id:0, car:car} );
		animated.push( hero );
		
		THREE.ImageUtils.loadTexture( "images/ground3.jpg" , undefined, 
			function ( texture ) {
				buildings_cache = tingBuildingGenerateCache({});
				var ground_material = new THREE.MeshBasicMaterial( { map:texture } );	
				city1 = new tingCity( {startX:0, startY:0, startZ:-16000, blocksA: 5, blocksB:4, ground_material:ground_material, car_material:car_material, car_geometry:car_geometry, animated:animated, scene:scene } );
				city2 = new tingCity( {startX:city1.length + 40000, startY:0, startZ:-16000,blocksA: 5, blocksB:4, ground_material:ground_material, car_material:car_material, car_geometry:car_geometry, animated:animated, scene:scene } );
		} );
			
	} );

	/* BRIDGE */
	var jsonBridgeLoader = new THREE.JSONLoader();
	jsonBridgeLoader.load( "models/bridge.js", function ( geometry, materials ) {
		var material = new THREE.MeshFaceMaterial( materials );
		var bridge = new THREE.Object3D();
		var mesh = new THREE.Mesh( geometry, material );		
		mesh.position.set( -810, -20, 245 );
		mesh.rotation.y = - 0.820;
		bridge.add( mesh );
		bridge.scale.set( 60, 60, 60 );
		bridge.position.set( 80000, 0, -1250 );
		scene.add( bridge );
	} );
	
	/* AIRPLANE */
	
	loader.add('Airplane model');
	var jsonAirplaneLoader = new THREE.JSONLoader();
	jsonAirplaneLoader.load( "models/airplane.js", function ( geometry, materials ) {
		airplane = new tingAirplane(250,0,0, geometry, materials );
		navigation = new tingNavigation(camera, airplane);
		airplane.addToScene( scene );		
		animated.push( airplane );
		loader.notify('Airplane model');
	} );
	
	
	/* EAGLES */
	
	loader.add('Roaming eagles');
	var jsonEaglesLoader = new THREE.JSONLoader();
	jsonEaglesLoader.load( "models/eagle.js", function ( geometry, materials ) {
		eagles = new tingEagles( geometry, materials );
		eagles.addToScene( scene );
		animated.push( eagles );
		loader.notify('Roaming eagles');
	} );
	
	
	/* CLOUDS */
	
	loader.add('Clouds');
	clouds = new tingClouds( {x:-800, y:-220, z:-800, scale:2000, amountX: 30, amountY:30, separation: 250, amplitude:35, speed:1 } );
	clouds.addToScene(scene);
	animated.push(clouds);
	loader.notify('Clouds');
	
	/* NAVIGATION LIGHTS */
	/*
	var light_start1 = new tingLight(0, 0, -600, 0xFF0000, [1], scene)
	var light_start2 = new tingLight(0, 0, 600, 0x00FF00, [1], scene)
	var light_finish1 = new tingLight(10000, 0, -600, 0xFF0000, [1], scene)
	var light_finish2 = new tingLight(10000, 0, 600, 0x00FF00, [1], scene)
	*/
	
	/* COCKPIT */
	/*
	loader.add('Cockpit');
	var cockpitimage = THREE.ImageUtils.loadTexture( "images/cockpit.png" );		
	var cockpitmaterial = new THREE.SpriteMaterial( { map: cockpitimage, opacity: 1, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft  } );
	cockpit = new THREE.Sprite( cockpitmaterial );	
	scene.add( cockpit );
	loader.notify('Cockpit');
	*/
	
	OnWindowResize();
	
	loader.notify('Scene initialization');
	
}
