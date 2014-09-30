var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light;
var animated = [];
			
function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	controls.animationFrame(DELTA);	
	
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
		
function OnKeyPress(e) {
	
	if (false) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		
		//console.log("key:" + key);
		
		switch ( key ) {

			case 102 /* F */: controls.freeze=!controls.freeze;break;
			case 108 /* L */: light.visible = !light.visible;break;
			case 114 /* R */: multiplayer.resetGame();break;
		
		}
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
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 100000 );
	camera.position.set( 1000, 3000, 1000 );
	scene.add(camera);
	
	light = new THREE.PointLight(0xdFdFdF);
	light.position.set( 0, 10000, 0 );
	scene.add(light);
	
	var light2 = new THREE.AmbientLight(0xf0f0f0);
	scene.add(light2);
	
	controls = new tingControls({ "camera":camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 500;
	animated.push( controls );
		
	/* AXIS */
	
	//var ax = new axis( { scene:scene } );
		
	/* PLAY!!! */
	
	var water_texture = THREE.ImageUtils.loadTexture( "images/water2.jpg" );
	water_texture.wrapS = water_texture.wrapT = THREE.RepeatWrapping;
	water_texture.repeat.set( 50, 50 );
	var floor_texture = THREE.ImageUtils.loadTexture( "images/floor-rock1.jpg" );
	floor_texture.wrapS = floor_texture.wrapT = THREE.RepeatWrapping;
	floor_texture.repeat.set( 5, 5 );
	var water = new tingWater({ y:-3000, scene:scene, water_texture:water_texture, floor_texture:floor_texture });
	scene.add(water.wrapper);	
	animated.push(water);
		
	var loader = new THREE.JSONLoader();
	loader.load( "../models/boat3.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 200, 200, 200 );
			mesh.position.y = 1900;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/ChrisCraft.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.x = 1500;
			mesh.position.y = 2100;
			mesh.position.z = 1000;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/octopus_rig.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.x = 1500;
			mesh.position.y = -1100;
			mesh.position.z = 1000;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/octopus_swim.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
				materials[m].morphTargets = true;
				//materials[m].morphNormals = true;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			//material.vertexColors = THREE.FaceColors;
			var eagle = new animatedModel( { "geometry":geometry, "material":material, "duration": 2, "time":0	} );	
			eagle.mesh.position.set(1500,-1500,-1000);				
			eagle.mesh.scale.set( 100, 100, 100 );				
			scene.add(eagle.mesh);
			animated.push(eagle);
			/*
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(-4000,0,-4000, 600));
			cruising_targets.chain(new cruisingTarget(4000,0,-4000, 600));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({mesh:eagle.mesh,duration:0.1});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
			*/
		}
	);
	
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




				