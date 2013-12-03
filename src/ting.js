/* GLOBALS */
var WIDTH, HEIGHT, ASPECT, CITY_POSITION, DELTA;
var skybox, ambient_light, mountains;
var renderer, scene, camera, controls, audio, clock, hud, loader;

var animated = [];
//var sounds = [];

var colors = {
	black:new THREE.Color(0x000000), 
	window_ambient:new THREE.Color(0x9090a0),
	window_blue:new THREE.Color(0xA0A0FF),
	window_green:new THREE.Color(0xA0FFA0) 
};

function animationFrame() {
	requestAnimationFrame(animationFrame);
	
	DELTA = clock.getDelta();
	
	controls.update(DELTA);
	
	for(animatedID in animated) { 
		animated[animatedID].animationFrame(DELTA);
	}
	
	/*
	for(soundID in sounds) { 
		sounds[soundID].animationFrame( camera );
	}
	*/
	//mouse.animationFrame(camera, scene);
	
	skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
		
	renderer.render( scene, camera );
};
	
/*	
function OnDocumentMouseMove(event) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function OnDocumentMouseDown( event ) {
	mouse.mouseDown();
}
*/

function OnWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight - 5;
	ASPECT = this.WIDTH / this.HEIGHT;
	renderer.setSize( this.WIDTH, this.HEIGHT );
	camera.aspect = this.ASPECT;
	camera.updateProjectionMatrix();	
	controls.handleResize();
}

function OnKeyPress(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	
	//console.log("key:" + key);
	
	switch ( key ) {

		case 102 /* F */: controls.freeze=!controls.freeze;break;
		case 107 /* K */: ambient_light.visible = !ambient_light.visible;break;
		case 108 /* L */: console.log("x:" + camera.position.x + " y:" + camera.position.y + " z:" + camera.position.z + " rotation:" + camera.rotation.x + "," + camera.rotation.y + "," + camera.rotation.z);break; 
		case 109 /* M */: 
			var array =  Array.prototype.slice.call( mountains.data );
			$("#txt1").val(array.toString());
			break;
		case 111 /* O */: 
			for(soundID in sounds) { 
				sounds[soundID].pause();
			}
			break;
	}
	
	return false;
}

function onLoaderChange( ready ) {

	if (ready) {
		clock = new THREE.Clock(true);
		animationFrame();
		hud.animate({opacity:0}, 3000,  function() { hud.hide(); } );
	}
	
}

	
/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	$container.append(renderer.domElement);
	//mouse = new mouseSelect();
		
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	//$container.bind( 'mousemove', OnDocumentMouseMove );
	//$container.bind( 'mousedown', OnDocumentMouseDown );
		
	hud = $('#hud');
	loader = new tingLoader( hud, onLoaderChange );
	
	renderScene();
	
			 
});




				