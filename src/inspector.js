function tingInspector( params ) {

	if (params.gui) {
		this.gui = params.gui;
	} else {
		this.reset();
	}
	
	this.steps = _coalesce( params.steps, 100 );
}

tingInspector.prototype.reset = function ( name ) {
	if (this.gui) {
		this.gui.destroy();
	}
	this.gui = new dat.GUI();		
}

tingInspector.prototype.inspectNumber = function( parent, propertyName, step, folder ) {
	
	var max = parent[propertyName] + (this.steps * step);
	var min = parent[propertyName] - (this.steps * step);
	
	folder.add( parent, propertyName ).name(propertyName).min(min).max(max).step(step).listen();
	//.listen().onChange(function(value) { editor.updateEditedMapObject(); });

}

tingInspector.prototype.inspectVector3 = function( parent, propertyName, step, folder ) {
	var folderVector = folder.addFolder( propertyName + " (Vector3)");
	this.inspectNumber( parent[propertyName], 'x', step, folderVector);	
	this.inspectNumber( parent[propertyName], 'y', step, folderVector);	
	this.inspectNumber( parent[propertyName], 'z', step, folderVector);	
	folderVector.open();
}

tingInspector.prototype.inspectEuler = function( parent, propertyName, folder, open ) {
	var folderEuler = folder.addFolder( propertyName + " (Vector3)");
	var step = 2 * (Math.PI/this.steps);
	this.inspectNumber( parent[propertyName], 'x', step, folderEuler);	
	this.inspectNumber( parent[propertyName], 'y', step, folderEuler);	
	this.inspectNumber( parent[propertyName], 'z', step, folderEuler);	
	if (open) {
		folderEuler.open();
	}
}

tingInspector.prototype.inspectObject3D = function( object3D, name, scale, open ) {
	var folder = this.gui.addFolder( name + " (Object3D)");
	this.inspectVector3( object3D, 'position', scale, folder );
	if ( object3D.rotation ) {
		this.inspectVector3( object3D, 'rotation', 0.013, folder );
	}
	
	if ( open ) {
		folder.open();
	}
}



