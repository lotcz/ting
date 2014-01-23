function tingCache( params ) {
	this.geometries = new Array();
	this.materials = new Array();	
	this.delimiter = 0; /* between scrapers and buildings */
}

tingCache.prototype.add( geometry, material ) {
	this.geometries.push( geometry );
	this.materials.push( material );
	return this.geometries.length - 1;
}

tingCache.prototype.getMesh( index ) {
	return new THREE.Mesh( this.geometries[index], this.materials[index] );
}

tingCache.prototype.getMaterial( index ) {
	return this.materials[index];
}

tingCache.prototype.getGeometry( index ) {
	return this.geometries[index];
}