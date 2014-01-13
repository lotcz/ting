function tingMountains() {

	this.generateHeight = function ( width, height ) {

		var size = width * height, data = new Float32Array( size ),
		perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

		for ( var i = 0; i < size; i ++ ) {

			data[ i ] = 0

		}

		for ( var j = 0; j < 4; j ++ ) {

			for ( var i = 0; i < size; i ++ ) {

				var x = i % width, y = ~~ ( i / width );
				data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

			}

			quality *= 5;

		}

		return data;

	}

	this.generateTexture = function ( data, width, height ) {

		var canvas, canvasScaled, context, image, imageData,
		level, diff, vector3, sun, shade;

		vector3 = new THREE.Vector3( 0, 0, 0 );

		sun = new THREE.Vector3( 1, 1, 1 );
		sun.normalize();

		canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		context = canvas.getContext( '2d' );
		context.fillStyle = '#000';
		context.fillRect( 0, 0, width, height );

		image = context.getImageData( 0, 0, canvas.width, canvas.height );
		imageData = image.data;

		for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

			vector3.x = data[ j - 2 ] - data[ j + 2 ];
			vector3.y = 2;
			vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
			vector3.normalize();

			shade = vector3.dot( sun );

			imageData[ i ] = ( 96 + shade * 128 ) * ( 0.0 + data[ j ] * 0.001 );
			imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.0 + data[ j ] * 0.001 );
			imageData[ i + 2 ] = ( shade * 96 ) * ( 0.0 + data[ j ] * 0.001 );
		}

		context.putImageData( image, 0, 0 );

		// Scaled 4x

		canvasScaled = document.createElement( 'canvas' );
		canvasScaled.width = width * 4;
		canvasScaled.height = height * 4;

		context = canvasScaled.getContext( '2d' );
		context.scale( 4, 4 );
		context.drawImage( canvas, 0, 0 );

		image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
		imageData = image.data;

		for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

			var v = ~~ ( Math.random() * 5 );

			imageData[ i ] += v;
			imageData[ i + 1 ] += v;
			imageData[ i + 2 ] += v;

		}

		context.putImageData( image, 0, 0 );

		return canvasScaled;

	}
	
	this.addToScene = function(scene) {
		
		var worldWidth = 256, worldDepth = 256;
		var worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

		//this.data = this.generateHeight( worldWidth, worldDepth );
		this.data = getMountainData();

		var geometry = new THREE.PlaneGeometry( 200000, 200000, worldWidth - 1, worldDepth - 1 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
			geometry.vertices[ i ].y = this.data[ i ] * 1000;
		}

		texture = new THREE.Texture( this.generateTexture( this.data, worldWidth, worldDepth ), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
		texture.needsUpdate = true;
		mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture} ) );

		//mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color:0x010105} ) );
		
		mesh.position.set(0,-20000,0);
		scene.add( mesh );
	}
	
}