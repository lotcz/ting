var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, controls, clock, stats, light;
var animated = [];
var hud, resources;
	
function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	for(var i = 0, max = scene.animated.length; i < max; i ++ ) { 
		scene.animated[i].animationFrame( DELTA );
	}
	for(var i = 0, max = animated.length; i < max; i ++ ) { 
		animated[i].animationFrame( DELTA );
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
				scene.ambientLight.visible = !scene.ambientLight.visible;			
				hud.warning("Light is <b>" + ((scene.ambientLight.visible) ? "On" : "Off") + "</b>.");
				break;
			case 116 /* T */: 
				hud.message("C est le message.");
				hud.warning("Beep. Lorem beep ipsum beep.");
				hud.error("This is a <b>TEST</b> of error. $%@##$!!");
			break;
			case 103 /* G */: 
				
				
			break;
		
		}
	}
	
	return false;
}

function startLoadingScene (sceneID) {
	$.getJSON( '../creator/php/loadScene.php', {scene_id: sceneID })
	.done(function( scene_json ) { 
		hud.message("C est le message: " + scene_json);
	})
	.fail(function( data ) {
		hud.error("Error: " + data);
		var ax = new axis({scene:scene.scene});	
		animationFrame();
	});
}

function saveResource( res ) {
	$.post("../creator/php/saveResource.php", { "resource_id":res.resource_id, "resource_json":res.getJSON() }, function (data) { hud.message("Resource saved:" + data); } );
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
	
		
	
	
	/* SCENE */
	
	
	resources = [];

	scene = new tingScene( {} );
	
	startLoadingScene (0);
	
	var res = new tingModel();
	res.json.path= "test";
	saveResource( res );
	
	/* CONTROLS	*/
	
	controls = new tingControls({ "camera":scene.camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 500;
	controls.lookEnabled = controls.movementEnabled = true;
	animated.push( controls );
	
	/* Sparrow */
	/*
	loader.add('Sparrow0');
	loader.add('Sparrow1');
	loader.add('Sparrow2');
	
	var models = [	{name:"sparrow_body", path:"../models/Sparrow-body.js"}, 
					{name:"sparrow_rotor", path:"../models/Sparrow-rotor.js"},
					{name:"sparrow_rotor2", path:"../models/Sparrow-rotor2.js"},
					{name:"ferrambo", path:"../models/ferrambo.js"}
				];
	var loaders = [];
	
	for (var i = 0; i < models.length; i++) {
		(function (i) {
			loaders[i] = new THREE.JSONLoader( );
			loaders[i].load( models[i].path, 
				function ( geometry, materials ) {
					for (var m = 0, maxm = materials.length; m < maxm; m++) {
						materials[m].side = THREE.DoubleSide;
					}
					resources[models[i].name + '_material'] = new THREE.MeshFaceMaterial( materials );	
					resources[models[i].name + '_geometry'] = geometry;									
					loader.notify('Sparrow' + i.toString());
				}
			);					
		}(i));
		
	}
			
	
	*/
	
	/* stats */
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
		
	OnWindowResize();
	clock = new THREE.Clock(true);
	//animationFrame();
		
});




				