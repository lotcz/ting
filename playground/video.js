var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light;
var animated = [];
var hud;
var video, videoImage, videoImageContext, videoTexture;
var video2, videoImage2, videoImageContext2, videoTexture2;

function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	controls.animationFrame(DELTA);	
	
	for(var i = 0, max = animated.length; i < max; i ++ ) { 
		animated[i].animationFrame( DELTA );
	}	

	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}
	
	if ( video2.readyState === video2.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext2.drawImage( video2, 0, 0, videoImage2.width, videoImage2.height );
		if ( videoTexture2 ) 
			videoTexture2.needsUpdate = true;
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
		
		//console.log("key:" + key);
		
		switch ( key ) {

			case 108 /* L */: light.visible = !light.visible;break;
			case 116 /* T */: 
				hud.message("C est le message.");
				hud.warning("Beep. Lorem beep ipsum beep.");
				hud.error("This is a <b>TEST</b> of error. $%@##$!!");
			break;
			case 103 /* G */: 
				
				hud.specialMessage( {image:"../images/characters/monkey.png",text:"Hello! My name is <b>Monkey</b>. I am a local superhero."});
				setTimeout(function () {
					hud.specialMessage( {image:"../images/characters/monkey.png",text:"Please help me defeat evil <b>TiNG corporation</b>."});
				}, 7000);
				
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
	hud.warning("Hello! This a test of <b>H.U.D.</b> messages.");
	hud.error("No Error this time you lucky bastard.");
	hud.message("Press \"<b>T</b>\" or \"<b>G</b>\" for test.");
	
	/* AXIS */
	
	var ax = new axis( { scene:scene } );
		
	/* PLAY!!! */
	
	// create the video element
	video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "../videos/wildlife.ogg";
	video.load(); // must call after setting/changing source
	video.play();
	
	// alternative method -- 
	// create DIV in HTML:
	// <video id="myVideo" autoplay style="display:none">
	//		<source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
	// </video>
	// and set JS variable:
	// video = document.getElementById( 'myVideo' );
	
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 1280;
	videoImage.height = 720;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(0,2500,5000);
	var scale = 30;
	movieScreen.scale.set(scale,scale,scale);
	//movieScreen.rotation.y = -Math.PI/2;
	scene.add(movieScreen);
	
	
	/* WEB CAMERA */
	
	
	video2 = document.getElementById( 'monitor' );
	
	videoImage2 = document.getElementById( 'videoImage' );
	videoImageContext2 = videoImage2.getContext( '2d' );
	// background color if no video present
	videoImageContext2.fillStyle = '#000000';
	videoImageContext2.fillRect( 0, 0, videoImage2.width, videoImage2.height );

	videoTexture2 = new THREE.Texture( videoImage2 );
	videoTexture2.minFilter = THREE.LinearFilter;
	videoTexture2.magFilter = THREE.LinearFilter;
	
	var movieMaterial2 = new THREE.MeshBasicMaterial( { map: videoTexture2, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry2 = new THREE.PlaneGeometry( 150, 100, 1, 1 );
	var movieScreen2 = new THREE.Mesh( movieGeometry2, movieMaterial2 );
	movieScreen2.position.set(0,2500,-5000);
	var scale2 = 40;
	movieScreen2.scale.set(scale2,scale2,scale2);
	scene.add(movieScreen2);
	
	/* MONKEYS */
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




				