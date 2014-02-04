function tingCity( params ) {
	this.startX = _coalesce( params.startX, 0 );
	this.startY = _coalesce( params.startY, 0 );
	this.startZ = _coalesce( params.startZ, 0 );
	this.blocksA = _coalesce( params.blocksA, 12 );
	this.blocksB = _coalesce( params.blocksB, 12 );	
	this.blockSize = _coalesce( params.blockSize, 16 );	
	this.scale = _coalesce( params.scale, 500 );
	this.length = this.blocksA * this.blockSize * this.scale;
	this.width = this.blocksB * this.blockSize * this.scale;
	this.wrapper = new THREE.Object3D();
	this.wrapper.position.set ( this.startX, this.startY, this.startZ );
	if (params.scene) params.scene.add( this.wrapper );
	this.speed = 1500;
	this.cruisetargs = new cruisingTargets();	
		
	var block, bsizeA, bsizeB, half = this.scale/2, tA, tB, tC, tD, tM, tN, tO, tP;
		
	for ( var b = 0; b < this.blocksB; b++ ) {
		
		bsizeB = Math.round( Math.random() * 2 );
		if ( bsizeB > (this.blocksB - b) ) bsizeB = this.blocksB - b;
		
		for ( var a = 0; a < this.blocksA; a++ ) {	
			
			bsizeA = Math.round( Math.random() * 2 );
			if ( bsizeA > (this.blocksA - a) ) bsizeA = this.blocksA - a;
			
			if ( (bsizeA > 0) && (bsizeB > 0) ) {
			
				var bx = a * this.blockSize * this.scale;
				var bz = b * this.blockSize * this.scale;
				var bsa = bsizeA * this.blockSize;
				var bsb = bsizeB * this.blockSize;
				
				block = new tingCityBlock( {
					scene:this.wrapper,
					startX: bx,	startZ: bz, sideA: bsa, sideB: bsb,
					ground_material: params.ground_material, cache:buildings_cache
				} );
				
				/* Cruising targets */
				tA = new cruisingTarget( bx + half, 0, bz + half, this.speed );
				tA = this.cruisetargs.add( tA );
				tB = new cruisingTarget( bx + (bsa*this.scale) - half, 0, bz + half, this.speed );
				tB = this.cruisetargs.add( tB );
				tC = new cruisingTarget( bx + (bsa*this.scale) - half, 0, bz + (bsb*this.scale) - half, this.speed );
				tC = this.cruisetargs.add( tC );
				tD = new cruisingTarget( bx + half, 0, bz + (bsb*this.scale) - half, this.speed );
				tD = this.cruisetargs.add( tD );
				
				_append( tA.neighbours, [tB,tD] );
				_append( tB.neighbours, [tA,tC] );
				_append( tC.neighbours, [tB,tD] );
				_append( tD.neighbours, [tA,tC] );
								
				if ( (a+bsizeA) < this.blocksA ) {
					tM = new cruisingTarget( bx + (bsa*this.scale) + half, 0, bz + half, this.speed );
					tM = this.cruisetargs.add( tM );
					_append( tM.neighbours, [tB] );
					_append( tB.neighbours, [tM] );					
					tN = new cruisingTarget( bx + (bsa*this.scale) + half, 0, bz + (bsb*this.scale) - half, this.speed );
					tN = this.cruisetargs.add( tN );
					_append( tN.neighbours, [tC] );
					_append( tC.neighbours, [tN] );
					
				}
				
				if ( (b+bsizeB) < this.blocksB ) {
					tO = new cruisingTarget( bx + (bsa*this.scale) - half, 0, bz + (bsb*this.scale) + half, this.speed );
					tO = this.cruisetargs.add( tO );
					_append( tO.neighbours, [tC] );
					_append( tC.neighbours, [tO] );					
					tP = new cruisingTarget( bx + half, 0, bz + (bsb*this.scale) + half, this.speed );
					tP = this.cruisetargs.add( tP );
					_append( tP.neighbours, [tD] );
					_append( tD.neighbours, [tP] );					
				}
			}
			a += ( bsizeA - 1 );
		}
		
		b += ( bsizeB - 1 );
	}
	
	/* add cars */
	for (var i = 0, max = 9 /* this.cruisetargs.targets.length*/; i < max; i++ ) {
		var car = new tingCar( { geometry:params.car_geometry, /*material:params.car_material,*/ scene:this.wrapper } );
		car.mesh.rotation.y = Math.PI;
		car.cruising = new tingCruising( { mesh:car.wrapper } );
		car.cruising.set( this.cruisetargs.targets[i] );
		params.animated.push( car.cruising );
	}
	
	
	/* visualize cruising targets */
	
	for (var i = 0, max = this.cruisetargs.targets.length; i < max; i++ ) {
		this.cruisetargs.targets[i].addToScene( i, this.wrapper );
	}
	
	/*
	var cruising = new tingCruising( { mesh:camera } );
	cruising.set( this.cruisetargs.targets[0] );
	params.animated.push( cruising );
	*/
		
}