var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light, cache;

var animated = [];
var buildings_cache, water, balim;

var duration = 1000;
var keyframes = 10, interpolation = duration / keyframes;
var lastKeyframe = 0, currentKeyframe = 0;
var mouse;
			
function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	for(var i = 0, max = animated.length; i < max; i ++ ) { 
		animated[i].animationFrame( DELTA );
	}		
	//renderer.clear();
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
	camera.position.set( -500, 500, -500 );
	scene.add(camera);
	
	light = new THREE.PointLight(0xFFFFFF);
	light.position.set( 0, 10000, 0 );
	scene.add(light);
	
	light = new THREE.AmbientLight(0xf0f0f0);
	scene.add(light);
	
	controls = new tingControls({ "camera":camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 1500;
	animated.push( controls );
	
	/* AXIS */
		
	var ax = new axis( { scene:scene } );
	
	/* PLAY!!! */
	
	var loader = new THREE.JSONLoader();
	loader.load( "cube.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.y = 100;
			scene.add( mesh );
		}
	);
	
	var tile_geometry = new THREE.PlaneGeometry( 10000, 10000 );
	var tile_texture = THREE.ImageUtils.loadTexture( "images/water2.jpg" );
	tile_texture.wrapS = tile_texture.wrapT = THREE.RepeatWrapping;
	tile_texture.repeat.set( 20, 20 );
	var tile_material = new THREE.MeshLambertMaterial( { color: 0xffffff, map: tile_texture, side: THREE.DoubleSide } );
	var tile = new THREE.Mesh( tile_geometry, tile_material );			
	tile.position.set( 0, 5000, 5000); 
	scene.add( tile );
	
	var tile_texture = THREE.ImageUtils.loadTexture( "images/floor-rock1.jpg" );
	tile_texture.wrapS = tile_texture.wrapT = THREE.RepeatWrapping;
	tile_texture.repeat.set( 10, 10 );
	var tile_material = new THREE.MeshLambertMaterial( { color: 0xffffff, map: tile_texture, side: THREE.DoubleSide } );
	var tile = new THREE.Mesh( tile_geometry, tile_material );			
	tile.position.set( 0, 5000, -5000); 
	scene.add( tile );
	
	var cube_texture = THREE.ImageUtils.loadTexture( "images/Tulips.jpg" );
	cube_texture.wrapS = cube_texture.wrapT = THREE.RepeatWrapping;
	cube_texture.repeat.set( 3, 3 );
	var cube_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: cube_texture, side: THREE.DoubleSide } );
	var cube_geometry = new THREE.CubeGeometry( 1000, 1000, 1000 );
	var cube = new THREE.Mesh( cube_geometry, cube_material );	
	//cube.scale.set(100, 100, 100);
	cube.position.set( 3000, 1000, 3000); 
	scene.add( cube );
	
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




				