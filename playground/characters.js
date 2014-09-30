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

			case 108 /* L */: light.visible = !light.visible;break;
		
		}
	}
	
	return false;
}

/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x020202 );
	MAX_ANISOTROPY = renderer.getMaxAnisotropy();
	$container.append(renderer.domElement);
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 100000 );
	camera.position.set( 1000, 3000, 1000 );
	scene.add(camera);
	
	//scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );
	
	var light2 = new THREE.PointLight(0xFFFFFF);
	light2.position.set( 0, 3000, 0 );
	scene.add(light2);
	
	
	light = new THREE.AmbientLight(0xf0f0f0);
	scene.add(light);
	
	controls = new tingControls({ "camera":camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 500;
	animated.push( controls );
		
	/* AXIS */
	
	var ax = new axis( { scene:scene } );
		
	/* PLAY!!! */
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/monkey.js",  
		function ( geometry, materials ) {	
			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 200, 200, 200 );
			mesh.position.set( 0, 1000, 0 );
			scene.add( mesh );
						
			//animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/monkey_rig.js",  
		function ( geometry, materials ) {	
			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 200, 200, 200 );
			mesh.position.set( 2000, 1000, 0 );
			scene.add( mesh );
						
			//animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/monkey_drop.js",  
		function ( geometry, materials ) {	
			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 200, 200, 200 );
			mesh.position.set( -2000, 1000, 0 );
			scene.add( mesh );
						
			//animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/ROBOT.js",  
		function ( geometry, materials ) {	
			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 600, 600, 600 );
			mesh.position.set( 0, 0, 2000 );
			scene.add( mesh );
						
			//animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/ROBOT_walk.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
				materials[m].morphTargets = true;
				//materials[m].morphNormals = true;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			//material.vertexColors = THREE.FaceColors;
			var eagle = new animatedModel( { "geometry":geometry, "material":material, "duration": 2, "time":0	} );	
			//eagle.mesh.position.set(-2000,0,2000);				
			eagle.mesh.scale.set( 600, 600, 600 );				
			scene.add(eagle.mesh);
			animated.push(eagle);
			
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(-3000,0,5000, 300));
			cruising_targets.chain(new cruisingTarget(-3000,0,-5000, 300));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({mesh:eagle.mesh});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/ROBOT_run.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
				materials[m].morphTargets = true;
				//materials[m].morphNormals = true;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			//material.vertexColors = THREE.FaceColors;
			var eagle = new animatedModel( { "geometry":geometry, "material":material, "duration": 2, "time":0	} );	
			//eagle.mesh.position.set(-2000,0,2000);				
			eagle.mesh.scale.set( 600, 600, 600 );				
			scene.add(eagle.mesh);
			animated.push(eagle);
			
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(-4000,0,-4000, 600));
			cruising_targets.chain(new cruisingTarget(4000,0,-4000, 600));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({mesh:eagle.mesh,duration:0.1});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/octopus_rig.js",  
		function ( geometry, materials ) {	
			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 600, 600, 600 );
			mesh.position.set( 3500, 0, 3500 );
			scene.add( mesh );
						
			//animated.push(cruising);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/oct.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
				materials[m].morphTargets = true;
				//materials[m].morphNormals = true;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			//material.vertexColors = THREE.FaceColors;
			var eagle = new animatedModel( { "geometry":geometry, "material":material, "duration": 2, "time":0	} );	
			eagle.mesh.position.set(-4000,0,4000);				
			eagle.mesh.scale.set( 600, 600, 600 );				
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




				