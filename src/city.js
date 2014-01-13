function tingCity( position ) {

	this.wrapper = new THREE.Object3D();
	this.wrapper.scale.set(0.2,0.2,0.2);
	this.wrapper.position = position;
	this.lights = new Array();
	
	/* FLOOR */
	var floor = new THREE.Mesh(new THREE.CubeGeometry(20000, 100, 20000 ), new THREE.MeshPhongMaterial({color:colors.black}) );
	this.wrapper.add(floor);
	
	/* BUILDINGS */
	this.generateRandomBuildings = function(start, dir, count, start_height, height_modifier, bcolors ) {
		if (!bcolors) {
			bcolors = [colors.window_blue, colors.window_green, colors.window_ambient];
		}
		
		var wcolor, height;
		for (var i = 0; i < count; i++) {
			wcolor = bcolors[Math.round(Math.random()*(bcolors.length-1))];			
			start.add(dir);
			height = start_height + (Math.random()*4000);
			start_height += height_modifier;
			tingBuilding(start.x, height/2, start.z, 200 + (Math.random()*700), 500 + (Math.random()*500), height , {color:wcolor, amount: 0.001 + (Math.random()*0.05) }, this.wrapper);
		}
	}
	
	tingBuilding(0, 3500, 0, 500, 500, 7000, {color:colors.window_blue}, this.wrapper);
	tingBuilding(0, 11000, 0, 100, 100, 8000, {color:colors.window_blue}, this.wrapper);
	this.lights.push(new tingLight(0,15050, 0, 0xFF0000, [1], this.wrapper));
	this.generateRandomBuildings(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2000, 0, 0), 5, 5000, -500, [colors.window_blue]);
	this.generateRandomBuildings(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1500, 0, 0), 5, 4000, -400);
	this.generateRandomBuildings(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -2000), 5, 0, 0, [colors.window_ambient]);
	this.generateRandomBuildings(new THREE.Vector3(2500, 0, 0), new THREE.Vector3(0, 0, -2000), 5, 0, 0, [colors.window_ambient]);
	this.generateRandomBuildings(new THREE.Vector3(-2500, 0, 0), new THREE.Vector3(0, 0, -2000), 5, 0, 0, [colors.window_ambient]);
	
	tingBuilding(2500, 3250, 2500, 1000, 1000, 6500, {color:colors.window_blue}, this.wrapper);
	tingBuilding(2500, 7500,  2500, 100, 100, 2000, {color:colors.window_blue}, this.wrapper);
	this.lights.push(new tingLight(2500,8550, 2500, 0xFF0000, [1], this.wrapper));
	this.generateRandomBuildings(new THREE.Vector3(2500, 0, 2500), new THREE.Vector3(2000, 0, 0), 2, 5000, -2500);
	this.generateRandomBuildings(new THREE.Vector3(2500, 0, 2500), new THREE.Vector3(0, 0, 2000), 10, 5000, -450);
	
	
	
	
	this.addToScene = function ( scene ) {
		
		scene.add(this.wrapper);
		
	}
	
	this.animationFrame = function( delta ) {
		for (var i = 0; i < this.lights.length; i++ ) {
			this.lights[i].animationFrame( delta );
		}		
	}
	
	
}