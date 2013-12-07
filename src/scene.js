function renderScene() {

	loader.add('Scene initialization');

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 2000000 );
	camera.position.set( 1966, 128308, 171321 );
	scene.add(camera);
	//camera.lookAt(CITY_POSITION);
	
	controls = new THREE.FirstPersonControls( camera, renderer.domElement, CITY_POSITION );
	controls.movementSpeed = 16000;
	controls.lookSpeed = 0.15;
	
	
	/* AUDIO */	
	
	
	loader.add('Audio tracks');
	audio = new tingAudio( function () { loader.notify('Audio tracks'); } );
	
	
	/* SKYBOX */
	var imagePrefix = "images/grim-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 1000000, 1000000, 1000000 );	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide,
			color: 0x505050
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skybox = new THREE.Mesh( skyGeometry, skyMaterial );

	scene.add( skybox );
	
	/* MOUNTAINS */
	
	mountains = new tingMountains();
	mountains.addToScene(scene);
	
	
	/* THE CITY */
	
	CITY_POSITION = new THREE.Vector3( 4467, 83101, 59965 );
	var city = new tingCity( CITY_POSITION );
	city.addToScene( scene );
	animated.push( city );
	
	/* AIRPLANE */
	
	loader.add('Airplane model');
	var jsonAirplaneLoader = new THREE.JSONLoader();
	jsonAirplaneLoader.load( "models/airplane.js", function ( geometry, materials ) {
		var airplane = new tingAirplane( geometry, materials );
		airplane.addToScene( scene );
		animated.push( airplane );
		loader.notify('Airplane model');
	} );
	
	
	/* EAGLES */
	
	loader.add('Roaming eagles');
	var jsonEaglesLoader = new THREE.JSONLoader();
	jsonEaglesLoader.load( "models/eagle.js", function ( geometry, materials ) {
		var eagles = new tingEagles( geometry, materials );
		eagles.addToScene( scene );
		animated.push( eagles );
		loader.notify('Roaming eagles');
	} );
	
	/* CLOUDS */
	
	/*var clouds = new tingClouds();
	clouds.addToScene(scene);
	*/
	
	/* SWITCHABLE AMBIENT LIGHT */
	
	ambient_light = new THREE.AmbientLight(0x404040);	
	ambient_light.visible = false;
	scene.add(ambient_light);
		
	OnWindowResize();
	
	loader.notify('Scene initialization');
}
