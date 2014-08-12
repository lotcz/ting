var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light, light2;
var animated = [];
var monkey, eagle, falling_down = false;
		
function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	controls.animationFrame(DELTA);	
	for(var i = 0, max = animated.length; i < max; i ++ ) { 
		animated[i].animationFrame( DELTA );
	}	
	if (falling_down) {
		camera.position.y -= DELTA * 200;
		monkey.position.y = camera.position.y;
		light2.position.y = camera.position.y + 1500;
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
		
function OnKeyPress(e) {
	
	var key = e.keyCode ? e.keyCode : e.charCode;
	
	//console.log("key:" + key);
	
	switch ( key ) {

		case 108 /* L */: light.visible = !light.visible;break;
		case 109 /* M */: 
			falling_down = false;
			controls.resetToDefault();
			controls.movementSpeed = 1500;
		break;
		case 111 /* O */: 
			controls.disableMovement();			
			controls.vertLockEnabled = true;
			controls.vertMin = -20;
			controls.vertMax = 20;
			camera.position.set( 0, 30000, 0 );
			monkey.position.set( 700, 30000, -700 );			
			falling_down = true;
		break;
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
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 200000 );
	camera.position.set( 1000, 3000, 1000 );
	scene.add(camera);
		
	light = new THREE.AmbientLight(0xa0a0a0);
	scene.add(light);
	
	light2 = new THREE.PointLight(0xFFFFFF);
	light2.position.set( 700, 30000, -700 );
	scene.add(light2);
	
	controls = new tingControls({ "camera":camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 1500;
	animated.push( controls );
		
	/* AXIS */
	
	//var ax = new axis( { scene:scene } );
		
	/* PLAY!!! */
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/eagle.js",  
		function ( geometry, materials ) {	
			var material = new THREE.MeshLambertMaterial( materials );
			material.morphTargets = true;
			material.vertexColors = THREE.FaceColors;
			var flock = new flockOfBirds( { "count":33, "geometry":geometry, "material":material, "duration": 2 } );	
			scene.add(flock.wrapper);
			animated.push(flock);
			
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(-1500,15000,-1500, 350));
			cruising_targets.chain(new cruisingTarget(1500,15000,1500, 350));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({"mesh":flock.wrapper});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/vulture.js",  
		function ( geometry, materials ) {	
			var material = new THREE.MeshLambertMaterial( materials );
			material.morphTargets = true;
			material.vertexColors = THREE.FaceColors;
			var flock = new flockOfBirds( { "count":111, "geometry":geometry, "material":material, "duration": 2.5 } );	
			scene.add(flock.wrapper);
			animated.push(flock);
			
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(-2500,25000,-2500, 400));
			cruising_targets.chain(new cruisingTarget(2500,25000,2500, 400));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({"mesh":flock.wrapper});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
		}
	);

	var loader = new THREE.JSONLoader();
	loader.load( "../models/raven.js",  
		function ( geometry, materials ) {	
			var material = new THREE.MeshLambertMaterial( materials );
			material.morphTargets = true;
			material.vertexColors = THREE.FaceColors;
			var flock = new flockOfBirds( { "count":111, "geometry":geometry, "material":material, "duration": 1 } );	
			scene.add(flock.wrapper);
			animated.push(flock);
			
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(-2500,17500,2500, 400));
			cruising_targets.chain(new cruisingTarget(4500,17500,-4500, 400));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({"mesh":flock.wrapper});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/monkey_par.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}			
			var material = new THREE.MeshFaceMaterial( materials );			
			monkey = new THREE.Mesh( geometry, material );			
			monkey.scale.set( 15, 15, 15 );
			scene.add( monkey );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/airplane.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 1000, 1000, 1000 );
			mesh.position.y = 2000;
			scene.add( mesh );
			
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(20000,40000,35000, 2500));
			cruising_targets.chain(new cruisingTarget(20000,40000,-35000, 2500));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({"mesh":mesh});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
		}
	);
	
	/* CLOUDS */
	
	geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( 'cloud10.png' );
	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	var fog = new THREE.Fog( 0xffffff, - 100, 200000 );

	material = new THREE.ShaderMaterial( {

		uniforms: {

			"map": { type: "t", value: texture },
			"fogColor" : { type: "c", value: fog.color },
			"fogNear" : { type: "f", value: fog.near },
			"fogFar" : { type: "f", value: fog.far },

		},
		vertexShader: document.getElementById( 'vs' ).textContent,
		fragmentShader: document.getElementById( 'fs' ).textContent,
		depthWrite: false,
		depthTest: true,
		transparent: true

	} );

	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );
/*
	var sizeX = 20000;
	var sizeY = 100000;
	var sizeZ = 10000;
	var amountOfClouds = 5000;
	
	for ( var i = 0; i < amountOfClouds; i++ ) {

		plane.position.x = _random( 0, sizeX );
		plane.position.y = _random( 0, sizeY ); //* (- Math.random() * Math.random() * 200 - 15);
		plane.position.z = _random( 0, sizeZ );
		plane.rotation.z = Math.random() * Math.PI;
		plane.scale.x = plane.scale.y = _random( 10, 40 );

		THREE.GeometryUtils.merge( geometry, plane );

	}

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	*/
	
	/* tubular clouds */
	var geometry2 = new THREE.Geometry();
	var diameterMin = 2000;
	var diameterMax = 75000;
	var height = 40000;	
	var amount = 1000;
	var angle;
	var diameter;
	
	for ( var i = 0; i < amount; i++ ) {
		angle = 2 * Math.random() * Math.PI;
		diameter = _random( diameterMin, diameterMax );
		plane.position.x = Math.sin(angle) * diameter;
		plane.position.y = _random( 0, height );
		plane.position.z = Math.cos(angle) * diameter;
		plane.rotation.y = angle - Math.PI;		
		plane.rotation.z = 2 * Math.random() * Math.PI;	
		if (diameter > (diameterMin+((diameterMax-diameterMin)*0.50))) {
			plane.scale.x = plane.scale.y = _random( 70, 300 );
		} else {
			plane.scale.x = plane.scale.y = _random( 40, 70 );
		}

		THREE.GeometryUtils.merge( geometry2, plane );

	}
	
	var mesh2 = new THREE.Mesh( geometry2, material );
	mesh2.position.set( 0, 0, 0 );
	scene.add( mesh2 );
	
	/* 
		stats 
	*/
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




				