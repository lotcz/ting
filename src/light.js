var sphere_geometry = new THREE.SphereGeometry( 40, 16, 8 );

function tingLight(x, y, z, light_color, blink_delays, scene) {

	this.blink_delays = blink_delays;
	this.blink_phase = 0;
	this.last_blinked = 0;
	this.light_on = false;
	this.position = new THREE.Vector3(x, y, z);
	this.light_color = light_color;
	
	this.addToScene = function(scene) {
		this.light = new THREE.PointLight(this.light_color, 2, 100);
		this.ball = new THREE.Mesh( sphere_geometry, new THREE.MeshBasicMaterial( { color: this.light_color } ) );
		this.ball.position = this.position;
		this.light.position = this.position;
		scene.add(this.ball);
		scene.add(this.light);
	}
	
	if (scene) {
		this.addToScene(scene);
	}
	
	this.on = function () {
		this.light.visible = true;
		this.ball.visible = true;
		this.light_on = true;
	}

	this.off = function() {
		this.light.visible = false;
		this.ball.visible = false;
		this.light_on = false;
	}
	
	this.blink = function() {
		if (this.light_on) {
			this.off();
		} else {
			this.on();
		}
		this.last_blinked = 0;
		this.blink_phase++;
		if (this.blink_phase >= this.blink_delays.length) this.blink_phase = 0;
	}
	
	this.animationFrame = function( delta ) {
		this.last_blinked += delta;
		if (this.last_blinked > this.blink_delays[this.blink_phase]) {
			this.blink();
		}
	}

}