/* GLOBALS */
var WIDTH, HEIGHT, ASPECT, DELTA;
var skybox, mountains, navigation, airplane, eagles, cockpit;
var renderer, scene, camera, controls, audio, clock, hud, loader, stats;

var animated = [];
var current_n = 0;

var colors = {
	black:new THREE.Color(0x000000), 
	window_ambient:new THREE.Color(0x9090a0),
	window_blue:new THREE.Color(0xA0A0FF),
	window_green:new THREE.Color(0xA0FFA0) 
};

function animationFrame() {
	
	if (stats) stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	controls.update(DELTA);	
	for(var i = 0, max = animated.length; i < max; i++) { 
		animated[i].animationFrame(DELTA);
	}
	
	switch (current_n) {
		case 1 :
			navigation.animationFrame();
			break;
	}	
	
	skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
	renderer.render( scene, camera );	
	if (stats) stats.end();
};
	

function OnDocumentMouseDown( event ) {
	var x = ( event.clientX / window.innerWidth ) * 2 - 1;
	var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	mouse.mouseDown( x, y, camera, scene);
}

function resetTing(n) {
	current_n = n;
	switch ( n ) {
		case 0:
			controls.constrainVertical = false;		
			break;
		case 1:
			controls.constrainVertical = true;
			controls.verticalMin = 1.0;
			controls.verticalMax = 1.9;
			mouse.enabled = true;
			camera.position.set(0,0,0);
			camera.lookAt(new THREE.Vector3(1, 0, 0));
			airplane.cruising.reset();
			eagles.cruising.reset();
			navigation = new tingNavigation(camera, airplane);
			audio.song.play();
		break;
	}
}

function OnWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight - 5;
	ASPECT = WIDTH / HEIGHT;
	renderer.setSize( WIDTH, HEIGHT );
	camera.aspect = ASPECT;
	camera.updateProjectionMatrix();	
	controls.handleResize();
	cockpit.scale.set(WIDTH,HEIGHT,1);
	//cockpit.position.set(0, 0, 1);
}

function OnKeyPress(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	
	//console.log("key:" + key);
	
	switch ( key ) {

		case 102 /* F */: resetTing(0);break;
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

function Start() {
	clock = new THREE.Clock(true);
	resetTing(1);
	animationFrame();	
	hud.animate({opacity:0}, 2000,  function() { loader.element.hide(); } );		
}

	
/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	$container.append(renderer.domElement);
	mouse = new mouseSelect();
		
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	document.addEventListener( 'mousedown', OnDocumentMouseDown, false );
	//$container.bind( 'mousemove', OnDocumentMouseMove );
	
	hud = $('#hud');
	loader = new tingLoader( hud, Start );
	
	renderScene();
	
	/* stats */
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
				
});




				