/* GLOBALS */
var MAX_ANISOTROPY;
var WIDTH, HEIGHT, ASPECT, DELTA, DEBUG_MODE;
var clouds, skybox, mountains, airplane, eagles, cockpit, city1, city2, bridge;
var audio, camera, clock, hud, loader, renderer, scene;
var controls, navigation, mouse;
var inspector, stats;
var buildings_cache;
var animated = [];
var game_level = 0;
var _golden = 1.518;

function OnMouseDown( event ) {
	var x = ( event.clientX / window.innerWidth ) * 2 - 1;
	var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	mouse.mouseDown( x, y, camera, scene);
}

function OnMouseMove( event ) {
	
}

function OnWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight - 5;
	ASPECT = WIDTH / HEIGHT;
	renderer.setSize( WIDTH, HEIGHT );
	camera.aspect = ASPECT;
	camera.updateProjectionMatrix();	
	controls.handleResize();
	//cockpit.scale.set(WIDTH,HEIGHT,1);
}

function OnKeyPress(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	
	//console.log("key:" + key);
	
	switch ( key ) {

		case 102 /* F */: DEBUG_MODE = !DEBUG_MODE;break;
		case 107 /* K */: ambient_light.visible = !ambient_light.visible;break;
		case 108 /* L */: console.log("x:" + camera.position.x + " y:" + camera.position.y + " z:" + camera.position.z + " rotation:" + camera.rotation.x + "," + camera.rotation.y + "," + camera.rotation.z);break; 
		case 109 /* M */: 
			var array =  Array.prototype.slice.call( mountains.data );
			$("#txt1").val(array.toString());
			break;
		case 111 /* O */: 
			//audio.source1.pause();
			resetTing(0);
			//audio.song.stop();
			break;
		case 114 /* R */: 
			resetTing(1);
			break;
	}
	
	return false;
}

function OnKeyDown( e ) {
	//controls.OnKeyDown( e );
}

function OnKeyUp( e ) {
	//controls.OnKeyUp( e );
}

function animationFrame() {	
	if (stats) stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	
	for(var i = 0, max = animated.length; i < max; i++) { 
		animated[i].animationFrame(DELTA);
	}
		
	//renderer.clear();
	renderer.render( scene, camera );	
	if (stats) stats.end();
};

function resetTing(level) {
	
	game_level = level;
	
	switch ( game_level ) {
		case 0:
			DEBUG_MODE = true;			
			controls.resetToDefault();
			controls.reset(-20, 75);
			controls.driveBuggy = true;
			camera.position.set(0,1000,0);
			break;
		case 1:
			DEBUG_MODE = false;			
			controls.vertSpeed = 0.1;
			controls.vertLockEnabled = true;
			controls.vertMin = -25;
			controls.vertMax = 15;
			controls.horizSpeed = 0.1;
			controls.horizLockEnabled = true;
			controls.horizMin = 33;
			controls.horizMax = 100;
			controls.lookEnabled = true;
			controls.movementEnabled = false;
			
			
			controls.reset();			
			
			mouse.enabled = true;
						
			camera.position.set(0,50000,0);
			
			skybox.rotation.set(0, 0.2, 0 );
			skybox.position.set(camera.position.x + 10000, camera.position.y - 10000, camera.position.z);
			//airplane.cruising.reset();
			//eagles.cruising.reset();
			if (audio.song) {
				audio.song.play();
			}			
		break;
	}
}

function Loaded() {
	/*
	inspector = new tingInspector({});
	inspector2 = new tingInspector({});
	inspector.inspectObject3D( camera, 'Camera', 10, true );
	inspector.inspectObject3D( skybox, 'Skybox', 100 );
	inspector.inspectObject3D( airplane, 'Airplane', 10 );
	scene.selectable.push(skybox);
	*/
	
	
	resetTing(1);	
}

function Start() {
	clock = new THREE.Clock(true);	
	animationFrame();		
	hud.animate({opacity:0}, 500 );		
}

	
/* INIT */	
$( function () {

	renderer = new THREE.WebGLRenderer();
	MAX_ANISOTROPY = renderer.getMaxAnisotropy();
	var container = $('#container');	
	container.append(renderer.domElement);
	hud = $('#hud');
	loader = new tingLoader( $("#ting-loader", hud), Loaded, Start );
	renderScene();
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	document.addEventListener( 'keydown', OnKeyDown, false );
	document.addEventListener( 'keyup', OnKeyUp, false );
	hud.bind( 'mousedown', OnMouseDown );
	hud.bind( 'mousemove', OnMouseMove );
		
});




				