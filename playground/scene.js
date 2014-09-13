var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light;
var animated = [];
var hud, resources;
	
function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	//controls.animationFrame(DELTA);	
	
	for(var i = 0, max = scene.animated.length; i < max; i ++ ) { 
		scene.animated[i].animationFrame( DELTA );
	}			
		
	renderer.render( scene.scene, scene.camera );	
	stats.end();
};
	
function OnWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight - 5;
	ASPECT = WIDTH / HEIGHT;
	renderer.setSize( WIDTH, HEIGHT );
	scene.camera.aspect = ASPECT;
	scene.camera.updateProjectionMatrix();	
	controls.handleResize();
	hud.OnResize( {"width":WIDTH, "height":HEIGHT} );
}
		
function OnKeyPress(e) {
	
	if (true) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		
		//console.log("key:" + key);
		
		switch ( key ) {

			case 108 /* L */: 
				scene.ambientLight.visible = scene.pointLight.visible = !scene.ambientLight.visible; 
				hud.warning("Light is <b>" + ((scene.ambientLight.visible) ? "On" : "Off") + "</b>.");
				break;
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

function Loaded() {
	scene.initScene( { "resources":resources} );
}

function Start() {	
	loader.element.animate({opacity:0}, 500 );
	controls.lookEnabled = controls.movementEnabled = true;
	scene.resetScene();
	hud.warning("Hello! This a test of <b>Scene 0</b>.");	
}

/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x101010 );
	MAX_ANISOTROPY = renderer.getMaxAnisotropy();
	$container.append(renderer.domElement);
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );

	/* HUD */
	hud = new tingHUD( {"element":$("#hud"), "width":WIDTH, "height":HEIGHT} );
	
	loader = new tingLoader( $("#ting-loader", hud.element), Loaded, Start );
	
	scene = new tingScene0( {} );
		
	controls = new tingControls({ "camera":scene.camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 500;
	controls.lookEnabled = controls.movementEnabled = false;
	//animated.push( controls );
	
	
	/* SCENE */
	
	loader.add('Scene initialization');
	resources = [];

	loader.add('Monkey');
	var resLoader = new THREE.JSONLoader();
	resLoader.load( "../models/monkey.js",  
		function ( geometry, materials ) {				
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}			
			resources["monkey_material"] = new THREE.MeshFaceMaterial( materials );
			resources["monkey_geometry"] = geometry;
			loader.notify('Monkey');
		}
	);
	
	loader.add('Trabant');
	var jsonCarLoader = new THREE.JSONLoader();
	jsonCarLoader.load( "../models/trabant.js", 
		function ( geometry, materials ) {
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			resources['trabant_material'] = new THREE.MeshFaceMaterial( materials );	
			resources['trabant_geometry'] = geometry;
			loader.notify('Trabant');				
		}
	);
	
	loader.add('Driver');
	var jsonCarLoader = new THREE.JSONLoader();
	jsonCarLoader.load( "../models/ferrambo.js", 
		function ( geometry, materials ) {
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			resources['driver_material'] = new THREE.MeshFaceMaterial( materials );	
			resources['driver_geometry'] = geometry;
			loader.notify('Driver');				
		}
	);
	
	loader.add('City buildings');
	THREE.ImageUtils.loadTexture( "../images/ground3.jpg" , undefined, 
		function ( texture ) {
			resources['city_buildings_cache'] = tingBuildingGenerateCache({});
			resources['city_ground_material'] = new THREE.MeshBasicMaterial( { map:texture } );	
			loader.notify('City buildings');
		}
	);
	
	loader.add('Street texture');
	THREE.ImageUtils.loadTexture( "../images/street.jpg" , undefined, 
		function ( texture ) {
			resources['city_street_texture'] = texture;
			loader.notify('Street texture');
		}
	);

		
	loader.notify('Scene initialization');
	
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




				