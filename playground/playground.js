var MAX_ANISOTROPY;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light, cache;

var animated = [];
var buildings_cache;

function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	controls.update(DELTA);	
	for(var i = 0, max = animated.length; i < max; i ++ ) { 
		animated[i].animationFrame( DELTA );
	}				
	renderer.render( scene, camera );	
	stats.end();
};
	
function OnWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight - 5;
	ASPECT = WIDTH / HEIGHT;
	renderer.setSize( WIDTH, HEIGHT );
	camera.aspect = ASPECT;
	camera.updateProjectionMatrix();	
	controls.handleResize();
}

function onDocumentMouseMove( event ) {
/*
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
	*/
}
			
function OnKeyPress(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	
	//console.log("key:" + key);
	
	switch ( key ) {

		case 102 /* F */: controls.freeze=!controls.freeze;break;
		case 108 /* L */: light.visible = !light.visible;break;
		case 114 /* R */: multiplayer.resetGame();break;
	}
	
	return false;
}

/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	MAX_ANISOTROPY = renderer.getMaxAnisotropy();
	$container.append(renderer.domElement);
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 100000 );
	camera.position.set( 0, 500, 0 );
	scene.add(camera);
	
	light = new THREE.AmbientLight(0x808080);
	scene.add(light);
	
	controls = new THREE.FirstPersonControls( camera, renderer.domElement, new THREE.Vector3(0,0,0) );
	controls.movementSpeed = 3600;
	controls.lookSpeed = 0.45;
	
	controls.constrainVertical = true;
	controls.verticalMin = 1.1;
	controls.verticalMax = 2.0;
	
	/* BALL TO CHECK IF EVERYTHING IS OK */
	var ball = new THREE.Mesh( new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color:0xFFA00F}));
	ball.position.set(0,0,0);
	scene.add(ball);
	camera.lookAt( ball.position );

	/* PLAY!!! */
	
	
	var jsonCarLoader = new THREE.JSONLoader();
	jsonCarLoader.load( "../models/buggy.js", 
		function ( geometry, materials ) {
		 
		var car_material = new THREE.MeshFaceMaterial( materials );	
		var car_geometry = geometry;
		
	
		var car = new tingCar( {geometry:car_geometry, material:car_material, scene:scene, animated:animated } );
		var hero = new tingPlayer( {id:0, car:car} );
		animated.push( hero );
	/*	
		THREE.ImageUtils.loadTexture( "../images/ground3.jpg" , undefined, 
			function ( texture ) {
				var ground_material = new THREE.MeshBasicMaterial( { map:texture } );	
				buildings_cache = tingBuildingGenerateCache({scale:500});
				var city = new tingCity( {startX:0, startY:0, startZ:-16000, blocksA: 5, blocksB:4, ground_material:ground_material, car_material:car_material, car_geometry:car_geometry, animated:animated, scene:scene } );				
				var city2 = new tingCity( {startX:city.length + 40000, startY:0, startZ:-16000,blocksA: 5, blocksB:4, ground_material:ground_material, car_material:car_material, car_geometry:car_geometry, animated:animated, scene:scene } );
		} );
	*/	
	} );

	/*
	var jsonBridgeLoader = new THREE.JSONLoader();
	jsonBridgeLoader.load( "../models/bridge.js", function ( geometry, materials ) {
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
	controls.freeze = false;
	
	/*
	clouds = new tingClouds({y:10000, separation:1500, scale:2000, amountX: 50, amountY:30, speed:2, amplitude:500});
	animated.push( clouds );
	clouds.addToScene( scene );
	
	*/
	
	/* stats */
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
		
	OnWindowResize();
	clock = new THREE.Clock(true);
	animationFrame();
		
});




				