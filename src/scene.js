function renderScene() {

	loader.add('Scene initialization');

	scene = new THREE.Scene();
	scene.selectable = [];
	
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 2000000 );
	scene.add(camera);
		
	controls = new THREE.FirstPersonControls( camera, renderer.domElement, new THREE.Vector3(1,0,0) );
	controls.movementSpeed = 1600;
	controls.lookSpeed = 0.11;
	
	
	/* AUDIO */	
	
	loader.add('Audio tracks');
	audio = new tingAudio( function () { loader.notify('Audio tracks'); } );
	
	
	/* SKYBOX */
	var imagePrefix = "images/grim-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 100000, 100000, 100000 );	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide,
			color: 0x909090
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skybox = new THREE.Mesh( skyGeometry, skyMaterial );
	skybox.rotation.set(0, 2.4, 0);
	scene.add( skybox );
	
	/* MOUNTAINS */
	/*
	mountains = new tingMountains();
	mountains.addToScene(scene);
	*/
	
	/* THE CITY */
	
	CITY_POSITION = new THREE.Vector3( 3000, -1400, -600 );
	var city = new tingCity( CITY_POSITION );
	city.wrapper.rotation.set(0, 1.55, 0);
	city.addToScene( scene );
	animated.push( city );
	
	CITY_POSITION2 = new THREE.Vector3( 6000, -1400, 600 );
	var city2 = new tingCity( CITY_POSITION2 );
	city2.wrapper.rotation.set(0, -1.55, 0);
	city2.addToScene( scene );	
	animated.push( city2 );
	
	/* AIRPLANE */
	
	loader.add('Airplane model');
	var jsonAirplaneLoader = new THREE.JSONLoader();
	jsonAirplaneLoader.load( "models/airplane.js", function ( geometry, materials ) {
		airplane = new tingAirplane(250,0,0, geometry, materials );
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
	var clouds = new tingClouds( {y:-150, z:-1800, amountX: 30, amountY:30, separation: 120, amplitude:40 } );
	clouds.addToScene(scene);
	animated.push(clouds);
	var clouds2 = new tingClouds( {x:3600, y:-150, z:-1200, amountX: 80, amountY:20, separation: 120, amplitude:40 } );
	clouds2.addToScene(scene);
	animated.push(clouds2);
	//clouds2.pauseAnimation = true;
	loader.notify('Clouds');
	
	/* NAVIGATION LIGHTS */
	/*
	var light_start1 = new tingLight(0, 0, -600, 0xFF0000, [1], scene)
	var light_start2 = new tingLight(0, 0, 600, 0x00FF00, [1], scene)
	var light_finish1 = new tingLight(10000, 0, -600, 0xFF0000, [1], scene)
	var light_finish2 = new tingLight(10000, 0, 600, 0x00FF00, [1], scene)
	*/
	
	/* COCKPIT */
	
	loader.add('Cockpit');
	var cockpitimage = THREE.ImageUtils.loadTexture( "images/cockpit.png" );		
	var cockpitmaterial = new THREE.SpriteMaterial( { map: cockpitimage, opacity: 1, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft  } );
	cockpit = new THREE.Sprite( cockpitmaterial );	
	
	scene.add( cockpit );
	loader.notify('Cockpit');
	
	OnWindowResize();
	
	loader.notify('Scene initialization');
}
