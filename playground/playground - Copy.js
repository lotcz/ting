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
	controls.update(DELTA);	
	for(var i = 0, max = animated.length; i < max; i ++ ) { 
		animated[i].animationFrame( DELTA );
	}			
	if (balim) {
		var time = Date.now() % duration;

		var keyframe = Math.floor( time / interpolation );

		if ( keyframe != currentKeyframe ) {

			balim.morphTargetInfluences[ lastKeyframe ] = 0;
			balim.morphTargetInfluences[ currentKeyframe ] = 1;
			balim.morphTargetInfluences[ keyframe ] = 0;

			lastKeyframe = currentKeyframe;
			currentKeyframe = keyframe;

			// console.log( mesh.morphTargetInfluences );

		}

		balim.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
		balim.morphTargetInfluences[ lastKeyframe ] = 1 - balim.morphTargetInfluences[ keyframe ];
	
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

function onDocumentMouseMove( event ) {
/*
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
	*/
}

function OnDocumentMouseDown( event ) {
	var x = ( event.clientX / window.innerWidth ) * 2 - 1;
	var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	mouse.mouseDown( x, y, camera, scene);
}
		
function OnKeyPress(e) {
	var key = e.keyCode ? e.keyCode : e.charCode;
	
	//console.log("key:" + key);
	
	switch ( key ) {

		case 102 /* F */: controls.freeze=!controls.freeze;break;
		case 108 /* L */: light.visible = !light.visible;break;
		case 114 /* R */: multiplayer.resetGame();break;
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
	$container.bind( 'mousedown', OnDocumentMouseDown );
	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 100000 );
	camera.position.set( 500, 500, 0 );
	scene.add(camera);
	
	light = new THREE.PointLight(0xFFFFFF);
	light.position.set( 0, 10000, 0 );
	scene.add(light);
	
	light = new THREE.AmbientLight(0xf0f0f0);
	scene.add(light);
	
	controls = new THREE.FirstPersonControls( camera, renderer.domElement, new THREE.Vector3(0,0,0) );
	controls.movementSpeed = 3600;
	controls.lookSpeed = 0.45;
	
	mouse = new mouseSelect();
	mouse.enabled = true;
	
	/*
	controls.constrainVertical = true;
	controls.verticalMin = 1.1;
	controls.verticalMax = 2.0;
	*/
	
	/* AXIS */
	
	
	function axis( params ) {
		this.minX = -100;
		this.maxX = 100;
		this.minY = -100;
		this.maxY = 0;
		this.minZ = -100;
		this.maxZ = 100;
		this.scale = 500;
		this.wrapper = new THREE.Object3D();
		if (params.scene) params.scene.add( this.wrapper );
		
		var geometry = new THREE.SphereGeometry();
		var material = new THREE.MeshBasicMaterial({color:0xffffff});
		
		var x, ball, text;
		
		for (var i = this.minX; i <= this.maxX; i++ ) {
				if ( i != 0 ) {
					x = i * this.scale;
					ball = new THREE.Mesh( geometry, material );
					ball.position.set( x, 0, 0 );
					this.wrapper.add(ball);
					text = makeTextSprite( x , { fontsize: 80, fontface:"Arial", fontColor: {r:200, g:200, b:255, a:1},  borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:40, g:40, b:80, a:0.5} } );
					text.position.set( x, 150, 0 ); 
					this.wrapper.add( text );
				}
		}	

		for (var i = this.minY; i <= this.maxY; i++ ) {
			if ( i != 0 ) {
				x = i * this.scale;
				ball = new THREE.Mesh( geometry, material );
				ball.position.set( 0, x, 0 );
				this.wrapper.add(ball);
				text = makeTextSprite( x , { fontsize: 80, fontface:"Arial", fontColor: {r:200, g:200, b:255, a:1},  borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:40, g:40, b:80, a:0.5} } );
				text.position.set( 150, x, 0 ); 
				this.wrapper.add( text );
			}
		}		
		
		for (var i = this.minZ; i <= this.maxZ; i++ ) {
			if ( i != 0 ) {
				x = i * this.scale;
				ball = new THREE.Mesh( geometry, material );
				ball.position.set( 0, 0, x );
				this.wrapper.add(ball);
				text = makeTextSprite( x , { fontsize: 80, fontface:"Arial", fontColor: {r:200, g:200, b:255, a:1},  borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:40, g:40, b:80, a:0.5} } );
				text.position.set( 0, 150, x ); 
				this.wrapper.add( text );
			}
		}	
		
	}
	
	var ax = new axis( { scene:scene } );
	
	var geometry = new THREE.Geometry();
	geometry.vertices.push( camera.position );
	geometry.vertices.push( new THREE.Vector3(1200,1200,1200) );
	var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( {color:0xF0F000} ) );
	scene.add( line );
		
	/* PLAY!!! */
	/*
	var loader = new THREE.ObjectLoader();
	loader.load("torus.json", 
		function ( object ) {
			object.scale.set( 100, 100, 100 );
			scene.add( object );
		}	
	);
	
	*/
	/*
	var loader = new THREE.JSONLoader();
	loader.load( "kaya.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var kaya = new THREE.Mesh( geometry, material );			
			kaya.scale.set( 100, 100, 100 );
			scene.add( kaya );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "monkey.js",  
		function ( geometry, materials ) {			
			//var material = new THREE.MeshFaceMaterial( materials );
			//material.morphTargets = true;
			var material = new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } );
			balim = new THREE.Mesh( geometry, material );
			balim.scale.set( 100, 100, 100 );
			balim.position.set( 0, 0, 0 );
			scene.add( balim );
		}
	);
	*/
	/*
	var loader = new THREE.SceneLoader();

	loader.addGeometryHandler( "binary", THREE.BinaryLoader );
	loader.addGeometryHandler( "ctm", THREE.CTMLoader );
	loader.addGeometryHandler( "vtk", THREE.VTKLoader );
	loader.addGeometryHandler( "stl", THREE.STLLoader );

	loader.addHierarchyHandler( "obj", THREE.OBJLoader );
	loader.addHierarchyHandler( "dae", THREE.ColladaLoader );
	loader.addHierarchyHandler( "utf8", THREE.UTF8Loader );

	loader.load( "ladybird.json",  
		function ( result ) {			
			loaded = result;

					handle_update( result, 1 );

					result.scene.traverse( function ( object ) {

						if ( object.userData.rotating === true ) {

							rotatingObjects.push( object );

						}

						if ( object instanceof THREE.MorphAnimMesh ) {

							morphAnimatedObjects.push( object );

						}

						if ( object instanceof THREE.SkinnedMesh ) {

							if ( object.geometry.animation ) {

								THREE.AnimationHandler.add( object.geometry.animation );

								var animation = new THREE.Animation( object, object.geometry.animation.name );
								animation.JITCompile = false;
								animation.interpolationType = THREE.AnimationHandler.LINEAR;

								animation.play();

							}

						}

					} );
		}
	);
	
	*/
	
	/*
	THREE.ImageUtils.loadTexture( "../images/water.png" , undefined, 
		function ( texture ) {
			var noise = texture ;	
			THREE.ImageUtils.loadTexture("../images/water.jpg", undefined,
				function ( texture ) {
					water = new ghobokWater( {startX:39500, startY:-1000, startZ:-4000, color:0x0000a0, tilesZ:10, scale:4000, noiseTexture:noise, mirrorTexture:texture});
					scene.add(water.wrapper);	
					//animated.push( water );
				}
			);
		}
	);	
	*/
	 /*
	var jsonPalmLoader = new THREE.OBJLoader();
	jsonPalmLoader.load( "ff/FF.obj", 
		function ( obj ) {		
			obj.scale.set(500, 500, 500);
			scene.add(obj);						
		}
	);
	*/
/* 
	var jsonLamboLoader = new THREE.ObjectLoader();
	jsonLamboLoader.load( "lambo.json", 
		function ( obj ) {
			while (obj.children.length > 0) {
				obj.children[0].scale.set(500, 500, 500);
				scene.add(obj.children[0]);
			}			
		}
	);
		
	var jsonCarLoader = new THREE.JSONLoader();
	jsonCarLoader.load( "../models/buggy.js", 	
		function ( geometry, materials ) {
		 
			var car_material = new THREE.MeshFaceMaterial( materials );	
			var car_geometry = geometry;			
		
			var car = new tingCar( {geometry:car_geometry, material:car_material, scene:scene, animated:animated } );
			var hero = new tingPlayer( {id:0, car:car} );
			animated.push( hero );
			
			THREE.ImageUtils.loadTexture( "../images/ground3.jpg" , undefined, 
				function ( texture ) {
					var ground_material = new THREE.MeshBasicMaterial( { map:texture } );	
					buildings_cache = tingBuildingGenerateCache({scale:500});
					var city = new tingCity( {startX:0, startY:0, startZ:-16000, blocksA: 5, blocksB:4, ground_material:ground_material, car_material:car_material, car_geometry:car_geometry, animated:animated, scene:scene } );				
					//var city2 = new tingCity( {startX:city.length + 40000, startY:0, startZ:-16000,blocksA: 5, blocksB:4, ground_material:ground_material, car_material:car_material, car_geometry:car_geometry, animated:animated, scene:scene } );
				} 
			);		
		} 
	);
	
	var jsonBridgeLoader = new THREE.JSONLoader();
	jsonBridgeLoader.load( "../models/bridge.js", function ( geometry, materials ) {
		var material = new THREE.MeshFaceMaterial( materials );
		var bridge = new THREE.Object3D();
		var mesh = new THREE.Mesh( geometry, material );		
		mesh.position.set( -810, -20, 245 );
		mesh.rotation.y = - 0.820;
		bridge.add( mesh );
		bridge.scale.set( 60, 60, 60 );
		bridge.position.set( 80000, 0, -1250 );
		scene.add( bridge );
	} );
	
	controls.freeze = false;
	*/
	/*
	clouds = new tingClouds({y:10000, separation:1500, scale:2000, amountX: 50, amountY:30, speed:2, amplitude:500});
	animated.push( clouds );
	clouds.addToScene( scene );	
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
	animationFrame();
		
});




				