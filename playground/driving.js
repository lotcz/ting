var MAX_ANISOTROPY, DEBUG_MODE = false;
var WIDTH, HEIGHT, ASPECT, DELTA;
var renderer, scene, camera, controls, clock, stats, light;
var animated = [];
var spotLight 
			
function animationFrame() {	
	stats.begin();	
	requestAnimationFrame(animationFrame);	
	DELTA = clock.getDelta();	
	controls.animationFrame(DELTA);	
	
	for(var i = 0, max = animated.length; i < max; i ++ ) { 
		animated[i].animationFrame( DELTA );
	}	
	
	if (spotLight.position.x < 5000) {
		spotLight.position.x += DELTA * 500;
	} else {
		spotLight.position.x = -5000;
	}
	spotLight.target.position.x = spotLight.position.x;
	
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
	
	if (false) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		
		//console.log("key:" + key);
		
		switch ( key ) {

			case 102 /* F */: controls.freeze=!controls.freeze;break;
			case 108 /* L */: light.visible = !light.visible;break;
			case 114 /* R */: multiplayer.resetGame();break;
		
		}
	}
	
	return false;
}

/* INIT */	
$( function () {

	var $container = $('#container');	
	renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	MAX_ANISOTROPY = renderer.getMaxAnisotropy();
	$container.append(renderer.domElement);
	
	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x020205, 1, 22000 );
	
	camera = new THREE.PerspectiveCamera( 45, 1, 1, 22000 );
	camera.position.set( 1000, 3000, 1000 );
	scene.add(camera);
	
	var light2 = new THREE.AmbientLight(0x202040);
	scene.add(light2);
	
	/* ! TRANSFORM CONTROLS ! */
	
	//control = new THREE.TransformControls( camera, renderer.domElement );

	
	controls = new tingControls({ "camera":camera, element: document });
	controls.resetToDefault();
	controls.movementSpeed = 500;
	//controls.lookEnabled = false;
	//controls.movementEnabled = false;
	animated.push( controls );
		
	/* AXIS */
	
	var ax = new axis( { scene:scene } );
		
	hud = new tingHUD( {"element":$("#hud"), "width":WIDTH, "height":HEIGHT} );
	hud.addContainer( 'speed', { top: "1px", height:"40px", width:"150px", backgroundColor:"#101020", textAlign:"center" } );
	hud.addContainer( 'alt', { top: "1px", left:"300px", height:"50px", width:"400px", backgroundColor:"#101020", textAlign:"center" } );
	//animated.push( hud );
	
	/* LIGHTS */
	
	var dirLight = new THREE.DirectionalLight(0xA0A0A0, 10);
	dirLight.castShadow = true;
	dirLight.shadowDarkness = 0.8;
	
	dirLight.shadowCameraNear = 500;
	dirLight.shadowCameraFar = 6000;
	dirLight.shadowCameraFov = 90;
	
	dirLight.shadowCameraRight = 50;
	dirLight.shadowCameraLeft = -50;
	dirLight.shadowCameraTop = 50;
	dirLight.shadowCameraBottom = -50;
	
	//scene.add(dirLight);
	
	spotLight = new THREE.SpotLight( 0xffffff, 15, 5500, 0.4 );
	spotLight.position.set( 100, 4000, 100 );

	//scene.add( new THREE.SpotLightHelper( spotLight, 15 ) );

	spotLight.castShadow = true;
	spotLight.shadowDarkness = 0.8;
	//spotLight.shadowCameraVisible = true;
	

	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;

	spotLight.shadowCameraNear = 500;
	spotLight.shadowCameraFar = 6000;
	spotLight.shadowCameraFov = 90;

	scene.add( spotLight );

	var llm = new THREE.MeshLambertMaterial({color:0xFFFFFF});
	var ll = new THREE.Mesh( new THREE.CylinderGeometry( 100, 500, 1000, 40, 5 ), llm );
	var scale = 5;
	ll.scale.set( scale, scale, scale );
	ll.position.set( 400, 1000, 0 );
	//scene.add( ll );
			
	/* STREET */
	
	THREE.ImageUtils.loadTexture( "../images/street.jpg" , undefined, 
		function ( texture ) {
			var street = new tingStreet( { startX:-50000,startZ:0,length:100, scale:4000, scene:scene, texture:texture} );
			street = new tingStreet( { startX:-50000,startZ:-4000,length:100, scale:4000, scene:scene, texture:texture} );			
		}
	);
	
	THREE.ImageUtils.loadTexture( "../images/water2.jpg" , undefined, 
		function ( texture ) {
			var material = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: texture, side: THREE.DoubleSide } );

			var objects = new THREE.Object3D();
			var scale = 10;
			objects.scale.set(scale, scale, scale);
			objects.position.set(6500,850,0);
			scene.add(objects);
			
			var object = new THREE.Mesh( new THREE.SphereGeometry( 75, 20, 10 ), material );
			object.position.set( -400, 0, 200 );
			objects.add( object );

			object = new THREE.Mesh( new THREE.IcosahedronGeometry( 75, 1 ), material );
			object.position.set( -200, 0, 200 );
			objects.add( object );

			object = new THREE.Mesh( new THREE.OctahedronGeometry( 75, 2 ), material );
			object.position.set( 0, 0, 200 );
			objects.add( object );

			object = new THREE.Mesh( new THREE.TetrahedronGeometry( 75, 0 ), material );
			object.position.set( 200, 0, 200 );
			objects.add( object );

			object = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
			object.position.set( -200, 0, 0 );
			object.castShadow = true;
			objects.add( object );

			object = new THREE.Mesh( new THREE.CylinderGeometry( 25, 75, 100, 40, 5 ), material );
			object.position.set( 400, 0, 0 );
			objects.add( object );

			//

			var points = [];

			for ( var i = 0; i < 50; i ++ ) {

				points.push( new THREE.Vector3( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, 0, ( i - 5 ) * 2 ) );

			}

			object = new THREE.Mesh( new THREE.LatheGeometry( points, 20 ), material );
			object.position.set( -400, 0, -200 );
			objects.add( object );

			object = new THREE.Mesh( new THREE.TorusGeometry( 50, 20, 20, 20 ), material );
			object.position.set( -200, 0, -200 );
			objects.add( object );

			object = new THREE.Mesh( new THREE.TorusKnotGeometry( 50, 10, 50, 20 ), material );
			object.position.set( 0, 0, -200 );
			objects.add( object );

		}
	);
				
	/* DRIVE!! */
	var loader = new THREE.JSONLoader();
	loader.load( "../models/ferrambo.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );			
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.y = 500;
			mesh.position.x = 0;
			mesh.position.z = 0;
			scene.add( mesh );
			
			var driver = new tingDriver( {mesh:mesh, camera:camera, element:document} );
			//animated.push( driver );
			
		}
	);
	
	
	/* OTHER CARS */
	var loader = new THREE.JSONLoader();
	loader.load( "../models/van.js",  
		function ( geometry, materials ) {			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.y = 500;
			mesh.position.x = -2000;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/airplane.js",  
		function ( geometry, materials ) {			
			var material = new THREE.MeshFaceMaterial( materials );
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.castShadow = true;
			mesh.scale.set( 1000, 1000, 1000 );
			mesh.position.x = -3500;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/trabant.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 100, 100, 100 );
			mesh.position.x = -1600;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/Sparrow.js",  
		function ( geometry, materials ) {	
			
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 50, 50, 50 );
			mesh.castShadow = true;
			mesh.position.y = 3000;
			mesh.position.x = 1000;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/buggy.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 500, 500, 500 );
			mesh.position.x = -1600;
			mesh.position.z = 2200;
			scene.add( mesh );
		}
	);
	
	var loader = new THREE.JSONLoader();
	loader.load( "../models/HoverTrain_swap.js",  
		function ( geometry, materials ) {	
			for (var m = 0, maxm = materials.length; m < maxm; m++) {
				materials[m].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials );
			
			var mesh = new THREE.Mesh( geometry, material );			
			mesh.scale.set( 500, 500, 500 );
			mesh.position.x = -1000;
			mesh.position.y = -400;
			mesh.position.z = 4000;
			mesh.rotation.y = -Math.PI/2;
			scene.add( mesh );
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




				