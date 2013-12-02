var building_material = new THREE.MeshBasicMaterial({color:0xFFFFFF, vertexColors: THREE.FaceColors});

function tingBuilding(x, y, z, width, length, height, windows, scene) {
	
	if (windows) {
		this.windows = windows;
		if (!this.windows.color) this.windows.color = colors.window_ambient;
		if (!this.windows.amount) this.windows.amount = 0.02;
		this.windows.amount = 1 - this.windows.amount;
	}
	
	this.position = new THREE.Vector3(x, y, z);
	this.width = width;
	this.length = length;
	this.height = height;
	
	this.addToScene = function(scene) {
		
		if (this.windows) {
			var levels = Math.floor(this.height / 50);
			var windows_sideA = Math.floor(this.width / 50);
			var windows_sideB = Math.floor(this.length / 50);
		} else {
			var levels = 1;
			var windows_sideA = 1;
			var windows_sideB = 1;
		}
		
		var building_geometry = new THREE.CubeGeometry( this.width, this.height, this.length, windows_sideA, levels, windows_sideB );	
		var building = new THREE.Mesh(building_geometry, building_material);
		
		if (this.windows) {
			for (var i = 0; i < building.geometry.faces.length; i++) {
				if (Math.random() > this.windows.amount) {
					building.geometry.faces[i].color = this.windows.color;
				} else {
					building.geometry.faces[i].color = colors.black;
				} 
			}
		}
		
		building.position = this.position;
		scene.add(building);
	}
	
	if (scene) {
		this.addToScene(scene);
	}
}