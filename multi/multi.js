/*
	multiplayer = new tingMultiplayer( {
		car_geometry:geometry, car_material:carMaterial, 
		scene:scene, animated:animated 
	} );
	
	multiplayer.registerAJAX();
*/

function tingMultiplayer( params ) {
	
	this.car_geometry = params.car_geometry;
	this.car_material = params.car_material;
	this.players = [];
	this.scene = params.scene;
	this.animated = params.animated;
	if (this.animated) this.animated.push( this );
	this.active = false;
	
	/* OUR HERO */
	var car = new tingCar( {geometry:this.car_geometry, material:this.car_material, scene:this.scene, animated:this.animated } );
	this.hero = new tingPlayer( {id:0, car:car} );	
	
	this.target_diff_x = 0;
	this.target_diff_z = 0;	
	this.distanceToTarget = 1;
	
}

tingMultiplayer.prototype.addPlayer = function ( params ) {
	var car = new tingCar({geometry:this.car_geometry, material:this.car_material, scene:this.scene, animated:this.animated } );
	var p = new tingPlayer( {id:params.id, car:car});
	this.players[params.id] = p;
	return p;
}


tingMultiplayer.prototype.animationFrame = function( delta ) {
		/*
	if (camera.position.y < 100) {	
		camera.position.y = 100;
	}

	if (camera.position.y > 3000) {
		camera.position.y = 3000;
	}

	this.distanceToTarget = ( camera.position.y / 50 );
	this.target_diff_x = controls.target.x - camera.position.x;
	this.target_diff_z = controls.target.z - camera.position.z;
	this.hero.car.wrapper.position.x = camera.position.x + (this.target_diff_x * this.distanceToTarget);
	this.hero.car.wrapper.position.z = camera.position.z + (this.target_diff_z * this.distanceToTarget);
	this.hero.car.wrapper.lookAt(new THREE.Vector3( this.hero.car.wrapper.position.x + this.target_diff_x, 0, this.hero.car.wrapper.position.z + this.target_diff_z));
	*/
}

tingMultiplayer.prototype.resetGame = function ( ) {
	$.get("multi/multi.php?id=-1", multiplayer.sendAJAX );
}

tingMultiplayer.prototype.registerAJAX = function ( ) {
	$.get("multi/multi.php?json=" + JSON.stringify( this.hero.getJSON() ) + "&id=0", multiplayer.registerPlayer );
}

tingMultiplayer.prototype.registerPlayer = function( data ) {
	if (data.id) {
		multiplayer.hero.id = data.id;
		this.active = false;
		multiplayer.sendAJAX();
	}
}

tingMultiplayer.prototype.sendAJAX = function () {	
	$.get("multi/multi.php?json=" + JSON.stringify( this.hero.getJSON() ) + "&id=" + this.hero.id, function ( data ) { multiplayer.updatePlayers( data ); } );
}

tingMultiplayer.prototype.updatePlayers = function ( data ) {
	
	var player, p_json;
	for (var i = 0, max = data.players.length; i < max; i++ ) {
		p_json = data.players[i];
		player = this.players[p_json.id];
		if (!player) {
			player = this.addPlayer( p_json );
		}
		
		player.updateFromJSON( JSON.parse( p_json.json ) );
		
	}
	
	if (this.active) this.sendAJAX();
}


/* PLAYER */
function tingPlayer( params ) {
	this.id = parseInt(params.id);
	this.car = params.car;	
}

tingPlayer.prototype.updateFromJSON = function( json ) {
	this.car.wrapper.position.x = parseFloat(json.x);
	this.car.wrapper.position.z = parseFloat(json.z);
	this.car.wrapper.rotation.x = parseFloat(json.rx);
	this.car.wrapper.rotation.y = parseFloat(json.ry);
	this.car.wrapper.rotation.z = parseFloat(json.rz);
}

tingPlayer.prototype.getJSON = function() {
	return { x:Math.round(this.car.wrapper.position.x), z:Math.round(this.car.wrapper.position.z), 
			rx:Math.round(this.car.wrapper.rotation.x * 100) / 100, ry:Math.round(this.car.wrapper.rotation.y * 100) / 100, rz:Math.round(this.car.wrapper.rotation.z * 100) / 100};
}

tingPlayer.prototype.animationFrame = function( delta ) {

	if (camera.position.y < 100) {	
		camera.position.y = 100;
	}
/*
	if (camera.position.y > 3000) {
		camera.position.y = 3000;
	}
*/
	this.distanceToTarget = ( camera.position.y / 50 );
	this.target_diff_x = controls.target.x - camera.position.x;
	this.target_diff_z = controls.target.z - camera.position.z;
	this.car.wrapper.position.x = camera.position.x + (this.target_diff_x * this.distanceToTarget);
	this.car.wrapper.position.z = camera.position.z + (this.target_diff_z * this.distanceToTarget);
	this.car.wrapper.lookAt(new THREE.Vector3( this.car.wrapper.position.x + this.target_diff_x, 0, this.car.wrapper.position.z + this.target_diff_z));			
}
