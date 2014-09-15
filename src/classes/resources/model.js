function tingModel() {
	this.json = { "type":"model" };
}

tingModel.prototype.loadFromJSON = function ( json ) {
	this.json = json;	
}

tingModel.prototype.getJSON = function ( ) {
	return JSON.stringify( this.json );	
}

tingModel.prototype.getGUI = function () {

	if (this.gui) {
		this.gui.destroy();
		this.gui = false;
	}
	this.gui = new dat.GUI();
	
	var folder1 = this.gui.addFolder("Dungeon drawing");
	folder1.add( this, 'defaultTileTypeStr', [ "Floor", "Ceiling", "Wall" ] ).name('Type');
	folder1.add( this, 'defaultMaterialID' ).name('Material').listen();
	folder1.add( this, 'selectMaterial' ).name('Select material');
	folder1.add( this, 'insertTile' ).name('Save');
	folder1.add( this, 'mainMenu' ).name('Cancel');
	folder1.open();
}		