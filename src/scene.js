function renderScene() {

	loader.add('Scene initialization');

	var scale = 500;
	
	scene = new THREE.Scene();
	scene.selectable = [];
	
	camera = new THREE.PerspectiveCamera( 45, 1, 10, scale * 1200 );
	scene.add(camera);
	
	/* CONTROLS */
			
	controls = new tingControls({ "camera":camera/*, "element": hud.element*/ });
	animated.push( controls );
	
	resetTing(0);
	
	mouse = new mouseSelect();
	
	/* AUDIO */	
	
	if (false) {
		loader.add('Audio tracks');
		audio = new tingAudio( function () { loader.notify('Audio tracks'); } );
	}
	
	/* SKYBOX */
	var imagePrefix = "images/grim-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( scale * 1000, scale * 1000, scale * 1000 );	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide,
			color: 0xe0e0e0
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skybox = new THREE.Mesh( skyGeometry, skyMaterial );	
	scene.add( skybox );
	
	/* LIGHT */
	var light2 = new THREE.AmbientLight(0xf0f0f0);
	scene.add(light2);
	
	/* MOUNTAINS */
	/*
	mountains = new tingMountains();
	mountains.addToScene(scene);
	*/
	
	/* THE CITY */
	
	if (true) {
		loader.add('The City');
		var jsonCarLoader = new THREE.JSONLoader();
		jsonCarLoader.load( "models/trabant.js", 
			function ( geometry, materials ) {
				for (var m = 0, maxm = materials.length; m < maxm; m++) {
					materials[m].side = THREE.DoubleSide;
				}
				var car_material = new THREE.MeshFaceMaterial( materials );	
				var car_geometry = geometry;

				/* OUR HERO */
				if (false) {
					var car = new tingCar( {geometry:car_geometry, material:car_material, scene:scene, animated:animated } );
					var hero = new tingPlayer( {id:0, car:car} );
					controls.buggy = hero.car;
				}
							
				if (true) {
					THREE.ImageUtils.loadTexture( "images/ground3.jpg" , undefined, 
						function ( texture ) {
							buildings_cache = tingBuildingGenerateCache({});
							var ground_material = new THREE.MeshBasicMaterial( { map:texture } );	
							city1 = new tingCity( {startX:0, startY:0, startZ:28500, blocksA: 15, blocksB:2, "ground_material":ground_material, "car_material":car_material, "car_geometry":car_geometry, "animated":animated, "scene":scene } );
							city2 = new tingCity( {startX: city1.startX, startY:0, startZ: (city1.startZ+city1.width), blocksA: 15, blocksB:2, ground_material:ground_material, car_material:car_material, car_geometry:car_geometry, animated:animated, scene:scene } );
							loader.notify('The City');
					} );
				}
						
			} 
		);
	}

	/* BRIDGE */
	/*
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
	*/
	/* AIRPLANE */
	/*
	loader.add('Airplane model');
	var jsonAirplaneLoader = new THREE.JSONLoader();
	jsonAirplaneLoader.load( "models/airplane.js", function ( geometry, materials ) {
		airplane = new tingAirplane(250,0,0, geometry, materials );
		navigation = new tingNavigation(camera, airplane);
		airplane.addToScene( scene );		
		animated.push( airplane );
		loader.notify('Airplane model');
	} );
		*/
	/* EAGLES */
	/*
	loader.add('Roaming eagles');
	var jsonEaglesLoader = new THREE.JSONLoader();
	jsonEaglesLoader.load( "models/eagle.js", function ( geometry, materials ) {
		eagles = new tingEagles( geometry, materials );
		eagles.addToScene( scene );
		animated.push( eagles );
		loader.notify('Roaming eagles');
	} );
	*/
	
	/* CLOUDS */
	
	if (false) {
		loader.add('Clouds');
		THREE.ImageUtils.loadTexture( "images/cloud256.png" , undefined, 
			function ( texture ) {
				var material = new THREE.SpriteMaterial( { map: texture, opacity: 1 } );
				clouds = new tingClouds( {x:-50000, y:15000, z:43000, scale:11000, amountX: 20, amountY:20, separation: 9000, amplitude:2000, speed:1, material:material } );
				clouds.addToScene(scene);
				_append(scene.selectable, clouds.wrapper.children );	
				animated.push(clouds);
				var clouds2 = new tingClouds( {x:-50000, y:18000, z:-4000, scale:11000, amountX: 20, amountY:4, separation: 9000, amplitude:2000, speed:1, material:material } );
				clouds2.addToScene(scene);
				loader.notify('Clouds');
			} 
		);
	}
	
	/* NAVIGATION LIGHTS */
	if (true) {
		var light_start1 = new tingLight(0, 0, 0, 0xFF0000, [0.3,10], scene)
		animated.push( light_start1);
		var light_start2 = new tingLight(0, 600, 0, 0x00FF00, [1,1], scene)
		animated.push( light_start2);
		/*
		var light_finish1 = new tingLight(10000, 0, -600, 0xFF0000, [1], scene)
		var light_finish2 = new tingLight(10000, 0, 600, 0x00FF00, [1], scene)
		*/
	}
	
	/* COCKPIT */
	/*
	loader.add('Cockpit');
	var cockpitimage = THREE.ImageUtils.loadTexture( "images/cockpit.png" );		
	var cockpitmaterial = new THREE.SpriteMaterial( { map: cockpitimage, opacity: 1, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft  } );
	cockpit = new THREE.Sprite( cockpitmaterial );	
	scene.add( cockpit );
	loader.notify('Cockpit');
	*/
	
	/* STATS */
	
	if (false) {
		stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.body.appendChild( stats.domElement );
	}
	
	OnWindowResize();
	
	loader.notify('Scene initialization');
	
}
