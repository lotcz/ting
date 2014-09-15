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
	
	light = new THREE.PointLight(0xFFFFFF);
	light.position.set( 0, 15000, 0 );
	scene.add(light);
	
	var light2 = new THREE.AmbientLight(0xf0f0f0);
	scene.add(light2);
	
	controls = new tingControls({ "camera":camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 500;
	//controls.lookEnabled = false;
	//controls.movementEnabled = false;
	animated.push( controls );
		
	/* AXIS */
	
	var ax = new axis( { scene:scene } );
		
	hud = new tingHUD( {"element":$("#hud"), "width":WIDTH, "height":HEIGHT} );
	hud.addContainer( 'speed', { top: "1px", height:"40px", width:"150px", backgroundColor:"#101020", textAlign:"center" } );
	//animated.push( hud );
	
	/* PLAY!!! */
	
	/* DRIVE!! */
	var loader = new THREE.JSONLoader();
	loader.load( "../models/ferrambo.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.y = 0;
			mesh.position.x = 0;
			mesh.position.z = 0;
			scene.add( mesh );
			
			var driver = new tingDriver( {mesh:mesh, camera:camera, element:document} );
			animated.push( driver );
			
		}
	);
	
	
	/* OTHER CARS */
	var loader = new THREE.JSONLoader();
	loader.load( "../models/van.js",  
		function ( geometry, materials ) {			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.x = -2000;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/airplane.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 1000, 1000, 1000 );
			mesh.position.x = -3500;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/trabant.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.x = -1600;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/Sparrow.js",  
		function ( geometry, materials ) {	
			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 50, 50, 50 );
			mesh.position.y = 4000;
			mesh.position.x = 4000;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/buggy.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 500, 500, 500 );
			mesh.position.x = -1600;
			mesh.position.z = 2200;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/HoverTrain_swap.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 500, 500, 500 );
			mesh.position.x = 3200;
			scene.add( mesh );
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




				