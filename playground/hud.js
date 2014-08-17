var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light;
var animated = [];
var hud;
	
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
	hud.OnResize( {"width":WIDTH, "height":HEIGHT} );
}
		
function OnKeyPress(e) {
	
	if (true) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		
		console.log("key:" + key);
		
		switch ( key ) {

			case 108 /* L */: light.visible = !light.visible;break;
			case 116 /* T */: hud.warning("Beep. TEST.");break;
			case 103 /* G */: 
				hud.specialMessage( {image:"../images/characters/monkey.png",text:"Hello! My name is Monkey. I am a superhero. Special message for you."});
				
			break;
		
		}
	}
	
	return false;
}

/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x202020 );
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
	
	/* HUD */
	hud = new tingHUD( {"element":$("#hud"), "width":WIDTH, "height":HEIGHT} );
	hud.warning("Hello! This a test of H.U.D. messages.");
	hud.error("No Error this time you lucky bastard.");
	hud.message("Press \"T\" or \"G\" for test.");
	
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




				