var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light;
var animated = [];
var eagle;
		
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
	renderer = new THREE.WebGLRenderer( { clearColor: 0xffffff, clearAlpha: 1 });
	MAX_ANISOTROPY = renderer.getMaxAnisotropy();
	$container.append(renderer.domElement);
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 200000 );
	camera.position.set( 1000, 3000, 1000 );
	scene.add(camera);
		
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
	loader.load( "../models/eagle.js",  
		function ( geometry, materials ) {	
			var material = new THREE.MeshLambertMaterial( materials );
			material.morphTargets = true;
			material.vertexColors = THREE.FaceColors;
			var eagle = new animatedModel( { "geometry":geometry, "material":material, "duration": 2, "time":0	} );	
			eagle.mesh.position.set(0,1000,100);				
			scene.add(eagle.mesh);
			animated.push(eagle);
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/vulture.js",  
		function ( geometry, materials ) {	
			var material = new THREE.MeshLambertMaterial( materials );
			material.morphTargets = true;
			material.vertexColors = THREE.FaceColors;
			var vulture = new animatedModel( { "geometry":geometry, "material":material, "duration": 2, "time":0.5	} );	
			vulture.mesh.position.set(100,1000,400);				
			scene.add(vulture.mesh);
			animated.push(vulture);
		}
	);
	
	
	/* FLOCK */
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/raven.js",  
		function ( geometry, materials ) {	
			var material = new THREE.MeshLambertMaterial( materials );
			material.morphTargets = true;
			material.vertexColors = THREE.FaceColors;
			var flock = new flockOfBirds( { "count":111, "geometry":geometry, "material":material, "duration": 1 } );	
			flock.wrapper.position.set(1000,1000,400);				
			scene.add(flock.wrapper);
			animated.push(flock);
			
			var cruising_targets = new cruisingTargets();
			cruising_targets.add(new cruisingTarget(-15000,0,-1500, 500));
			cruising_targets.chain(new cruisingTarget(15000,0,-1500, 500));
			cruising_targets.closeCircle();
			var cruising = new tingCruising({"mesh":flock.wrapper});			
			cruising.set(cruising_targets.targets[0]);
			animated.push(cruising);
		}
	);
		
	THREE.ImageUtils.loadTexture( "../images/cloud256.png" , undefined, 
		function ( texture ) {
			var material = new THREE.SpriteMaterial( { map: texture, opacity: 1 } );
			clouds = new tingClouds( {x:-40000, y:-20000, z:-40000, scale:10000, amountX: 20, amountY:60, separation: 6000, amplitude:1500, speed:1, material:material } );
			clouds.addToScene(scene);			
			animated.push(clouds);			
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




				