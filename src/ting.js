/* GLOBALS */
var WIDTH, HEIGHT, ASPECT, DELTA, DEBUG_MODE;
var clouds, skybox, mountains, airplane, eagles, cockpit;
var audio, camera, clock, hud, loader, renderer, scene;
var controls, navigation, mouse;
var inspector, stats;

var animated = [];
var current_n = 0;

function OnDocumentMouseDown( event ) {
	var x = ( event.clientX / window.innerWidth ) * 2 - 1;
	var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	mouse.mouseDown( x, y, camera, scene);
}

function OnDocumentMouseMove( event ) {
	controls.onMouseMove( event );
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
			audio.song.stop();
			break;
		case 114 /* R */: 
			resetTing(1);
			break;
	}
	
	return false;
}

function animationFrame() {	
	if (stats) stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	
	if (!DEBUG_MODE) {
		for(var i = 0, max = animated.length; i < max; i++) { 
			animated[i].animationFrame(DELTA);
		}
	}
	
	switch (current_n) {
		case 1 :
			if (!DEBUG_MODE) {
				controls.animationFrame(DELTA);
			}
			navigation.animationFrame(DELTA);
			break;
		case 2 :	
			navigation.animationFrame(DELTA);
			break;
	}	
	
	//skybox.position.set(camera.position.x, camera.position.y - 1000, camera.position.z);
	renderer.render( scene, camera );	
	if (stats) stats.end();
};

function resetTing(n) {
	current_n = n;
	switch ( n ) {
		case 0:
			DEBUG_MODE = true;
			controls.constrainVertical = false;		
			break;
		case 1:
			controls.vertSpeed = 0.025;
			controls.vertMin = -15;
			controls.vertMax = 15;
			controls.horizSpeed = 0.025;
			controls.horizMin = 25;
			controls.horizMax = 65;
			mouse.enabled = true;
			camera.position.set(0,350,-500);
			controls.reset();
			skybox.rotation.set(0, 0.2, 0 );
			skybox.position.set(camera.position.x + 10000, camera.position.y - 12000, camera.position.z);
			airplane.cruising.reset();
			eagles.cruising.reset();
			if (!DEBUG_MODE) {
				audio.song.play();
			}
			DEBUG_MODE = false;
		break;
	}
}

function Loaded() {

	DEBUG_MODE = true;
	
	if (DEBUG_MODE) {
		inspector = new tingInspector({});
		inspector2 = new tingInspector({});
		inspector.inspectObject3D( camera, 'Camera', 10, true );
		inspector.inspectObject3D( skybox, 'Skybox', 100 );
		inspector.inspectObject3D( airplane, 'Airplane', 10 );
		scene.selectable.push(skybox);
		
		/* stats */
		stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms

		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.body.appendChild( stats.domElement );
	}			
	
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
	var container = $('#container');	
	container.append(renderer.domElement);
	hud = $('#hud');
	loader = new tingLoader( $("#ting-loader", hud), Loaded, Start );
	renderScene();
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	hud.bind( 'mousedown', OnDocumentMouseDown );
	hud.bind( 'mousemove', OnDocumentMouseMove );
		
});




				