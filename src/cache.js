function tingCache( params ) {
	this.geometries = new Array();
	this.materials = new Array();	
	this.delimiter = 0; /* between scrapers and buildings */
}

tingCache.prototype.add = function( geometry, material ) {
	this.geometries.push( geometry );
	this.materials.push( material );
	return this.geometries.length - 1;
}

tingCache.prototype.getMesh = function( index ) {
	return new THREE.Mesh( this.geometries[index], this.materials[index] );
}

tingCache.prototype.getMaterial = function( index ) {
	return this.materials[index];
}

tingCache.prototype.getGeometry = function( index ) {
	return this.geometries[index];
}