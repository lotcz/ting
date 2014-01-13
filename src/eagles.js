function tingEagles(geometry, materials) {
	this.eagles = new THREE.Object3D();
	this.position = this.eagles.position;
	this.material = new THREE.MeshLambertMaterial( materials );
	this.material.morphTargets = true;
	this.material.vertexColors = THREE.FaceColors;
	this.speed = 40;

	this.cruising = new tingCruising(this.eagles);
	this.cruising.addTarget(0,0, -300, this.speed);
	this.cruising.addTarget(10000, 100, 600, this.speed);

	var eagle = new THREE.MorphAnimMesh( geometry, this.material );	
	eagle.duration = 2;
	this.eagles.add(eagle);
	
	eagle = new THREE.MorphAnimMesh( geometry, this.material );	
	eagle.position.set(200,-10,-500);
	eagle.duration = 2;
	eagle.time = 0.5;
	this.eagles.add(eagle);
		
	eagle = new THREE.MorphAnimMesh( geometry, this.material );	
	eagle.position.set(-200,10,-600);
	eagle.duration = 2;
	eagle.time = 1.5;
	this.eagles.add(eagle);
		
	this.eagles.scale.set(0.2,0.2,0.2);
	
	this.addToScene = function (scene) {
		this.eagles.position.copy(this.cruising.targets[0].vector);
		scene.add( this.eagles );
	}
	
	this.animationFrame = function(delta) {
		for (var i = 0; i < this.eagles.children.length; i++) {
			this.eagles.children[i].updateAnimation(delta);
		}
		this.cruising.animationFrame(delta);		
	}
	
}

