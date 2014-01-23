function tingCity( params ) {
	this.startX = _coalesce( params.startX, 0 );
	this.startY = _coalesce( params.startY, 0 );
	this.startZ = _coalesce( params.startZ, 0 );
	this.blocksA = _coalesce( params.blocksA, 12 );
	this.blocksB = _coalesce( params.blocksB, 12 );	
	this.blockSize = _coalesce( params.blockSize, 16 );	
	this.scale = _coalesce( params.scale, 500 );
	this.wrapper = new THREE.Object3D();
	this.wrapper.position.set ( this.startX, this.startY, this.startZ );
	if (params.scene) params.scene.add( this.wrapper );
	this.speed = 1500;
	this.cruisetargs = new cruisingTargets();	
	
	/* buildings cache */
	this.cache = new Array();
	this.cache.delimiter = 2; /* how many scrapers */	
	for (var i = 0, max = 10; i < max; i++ ) { 
		
		if (i < scrapers) {
			bwidth = this.scale + ( Math.random() * this.scale * 4 );
			blength = this.scale + ( Math.random() * this.scale * 6 );
			bheight = (this.scale*10) + ( Math.random() * this.scale * 20 )
		} else {
			bwidth = this.scale + ( Math.random() * this.scale * 8 );
			blength = this.scale + ( Math.random() * this.scale * 8 );
			bheight = this.scale + ( Math.random() * this.scale * 4 )
		}
		
		this.cache.push( new tingBuilding( {			
			width:bwidth, length:blength, height:bheight,
			windowSizeX:70, windowSizeY:50, amount: 0.1 + (Math.random()*0.2),
			minColor:new THREE.Color( 0xB0B0B0 ),
			maxColor:new THREE.Color( 0xFFFFFF ),
		}));
	}
	
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
					ground_material: params.ground_material, cache:this.cache
				} );
				
				/* Cruising targets */
				tA = new cruisingTarget( bx + half, 0, bz + half, this.speed );
				tB = new cruisingTarget( bx + (bsa*this.scale) - half, 0, bz + half, this.speed );
				tC = new cruisingTarget( bx + (bsa*this.scale) - half, 0, bz + (bsb*this.scale) - half, this.speed );
				tD = new cruisingTarget( bx + half, 0, bz + (bsb*this.scale) - half, this.speed );
				
				_append( tA.neighbours, [tB,tD] );
				_append( tB.neighbours, [tA,tC] );
				_append( tC.neighbours, [tB,tD] );
				_append( tD.neighbours, [tA,tC] );
				this.cruisetargs.add( tA );
				this.cruisetargs.add( tB );
				this.cruisetargs.add( tC );
				this.cruisetargs.add( tD );
				
				if ( (a+bsizeA) < this.blocksA ) {
					tM = new cruisingTarget( bx + (bsa*this.scale) + half, 0, bz + half, this.speed );
					_append( tM.neighbours, [tB] );
					_append( tB.neighbours, [tM] );
					this.cruisetargs.add( tM );
					tN = new cruisingTarget( bx + (bsa*this.scale) + half, 0, bz + (bsb*this.scale) - half, this.speed );
					_append( tN.neighbours, [tC] );
					_append( tC.neighbours, [tN] );
					this.cruisetargs.add( tN );
				}
				
				if ( (b+bsizeB) < this.blocksB ) {
					tO = new cruisingTarget( bx + (bsa*this.scale) - half, 0, bz + (bsb*this.scale) + half, this.speed );
					_append( tO.neighbours, [tC] );
					_append( tC.neighbours, [tO] );
					this.cruisetargs.add( tO );
					tP = new cruisingTarget( bx + half, 0, bz + (bsb*this.scale) + half, this.speed );
					_append( tP.neighbours, [tD] );
					_append( tD.neighbours, [tP] );
					this.cruisetargs.add( tP );
				}

			}
			a += ( bsizeA - 1 );
		}
		
		b += ( bsizeB - 1 );
	}
	
	/* add cars */
	for (var i = 0, max = this.cruisetargs.targets.length; i < max; i++ ) {
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