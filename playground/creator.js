var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, controls, clock, stats, resources, animated = [];
var hud, hud_loading, hud_menu, hud_resources, hud_resource;
	
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
		//hud.error("Error: " + data);
		var ax = new axis({scene:scene.scene});	
		animationFrame();
	}).always( function (data) {
		hud_menu = new hudMenu( { 	links: [
									{ title:"Resources", onclick:openResourcesInHUD}
									
								], 
								hud:hud,
								css:{padding:"2px 10px", width:(hud.width-300)+"px", left:"150px"}
							} 
						);		
		hud.removeContainer("Loading");
	});
}

function openResourcesInHUD() {
	if (hud_resources) {
		hud_resources.show();
	} else {
		hud_resources = new hudResources({});
	}
}
	
function loadResources( sceneID ) {
	$.getJSON( '../creator/php/loadResources.php', {scene_id: _coalesce(sceneID, 0) })
		.done(function( resources_json ) { 
			resources = new tingResources();
			resources.loadFromJSON( resources_json );
			resources.initialize();
		})
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
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight - 5;
	hud = new tingHUD( {"element":$("#hud"), "width":WIDTH, "height":HEIGHT} );
	
	var loading_width = 350;
	var loading_height = 60;
	hud_loading = hud.addContainer("Loading", {top:Math.round((hud.height-loading_height)/2) + "px", left:Math.round((hud.width-loading_width)/2) + "px", height:loading_height+"px", width:loading_width+"px", textAlign:"center", lineHeight:loading_height+"px"});
	hud_loading.html("Loading...");
	
	/* SCENE */
	
	scene = new tingScene( {} );
	startLoadingScene (1);
	
	loadResources();
	
	var model = new modelResource();
	model.json.path = "../models/Sparrow-body.js";
	//saveResource( model )
	
	/* CONTROLS	*/
	
	controls = new tingControls({ "camera":scene.camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 500;
	controls.lookEnabled = controls.movementEnabled = false;
	//animated.push( controls );
	
	
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




				