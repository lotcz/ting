var tingClouds = function ( x, y, z, length, width, height ) {

	var geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture( 'images/cloud256.png');

	var fog = new THREE.Fog( 0x5299d1, - 100, 3000 );

	var material = new THREE.ShaderMaterial( {
		uniforms: {

			"map": { type: "t", value:2, texture: texture },
			"fogColor" : { type: "c", value: fog.color },
			"fogNear" : { type: "f", value: fog.near },
			"fogFar" : { type: "f", value: fog.far }

		},
		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D map;",

			"uniform vec3 fogColor;",
			"uniform float fogNear;",
			"uniform float fogFar;",

			"varying vec2 vUv;",

			"void main() {",

				"float depth = gl_FragCoord.z / gl_FragCoord.w;",
				"float fogFactor = smoothstep( fogNear, fogFar, depth );",

				"gl_FragColor = texture2D( map, vUv );",
				"gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );",
				"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

			"}"

		].join("\n"),

		depthTest: false

	} );

	var plane_mat =  new THREE.Plane( 64, 64 );
	plane_mat.morphTargets = [];
	var plane = new THREE.Mesh( plane_mat );
		
	for ( var i = 0; i < 4000; i++ ) {

		plane.position.x = Math.random() * 1000 - 500;
		plane.position.y = - Math.random() * Math.random() * 200 - 15;

		plane.position.z = i;
		plane.rotation.z = Math.random() * Math.PI;
		plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

		GeometryUtils.merge( geometry, plane );

	}

	this.mesh = new THREE.Mesh( geometry, material );
	this.mesh2 = new THREE.Mesh( geometry, material );

	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	renderTargetClouds = new THREE.WebGLRenderTarget( 512, 512, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter } );
	renderTargetClouds.depthBuffer = false;
	renderTargetClouds.stencilBuffer = false;
	
	window.renderTargetClouds = renderTargetClouds;

	var postUniforms = {
	"tClouds": { type: "t", value: 0, texture: renderTargetClouds },
	"tFlamingos": { type: "t", value: 1, texture: renderTargetFlamingos },
	"width": { type: "f", value: window.innerWidth },
	"height": { type: "f", value: window.innerHeight },
	"fogColor" : {type: "c", value: fog.color}
	};

	this.postMaterial = new THREE.MeshShaderMaterial( {
        uniforms: postUniforms,
        vertexShader: [
          "varying vec2 vUv;",

          "void main() {",
              "vUv = vec2( uv.x, 1.0 - uv.y );",
              "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
          "}"

        ].join("\n"),

        fragmentShader: [
          "uniform sampler2D tClouds;",
          "uniform sampler2D tFlamingos;",
          "uniform vec3 fogColor;",
          "uniform float width;",
          "uniform float height;",
          "varying vec2 vUv;",

          "void main() {",
              "vec4 flamingos = vec4(0.);",
              "if (vUv.y > 0.5) {",
                  "flamingos += texture2D( tFlamingos, vUv );",
                  "flamingos += texture2D( tFlamingos, vUv+vec2(1./width,0.) );",
                  "flamingos += texture2D( tFlamingos, vUv+vec2(.0,1./height) );",
                  "flamingos += texture2D( tFlamingos, vUv+vec2(1./width,1./height) );",
                  "flamingos *= 1./4.;",
                  "flamingos.rgb = mix(flamingos.rgb, vec3(fogColor), 0.15*flamingos.a);",
              "}",

              "vec4 clouds = texture2D( tClouds, vUv );",
              "gl_FragColor = mix(flamingos, clouds, clouds.a);",
              "gl_FragColor.rgb *= 1./gl_FragColor.a;",

          "}"

        ].join("\n")
      } );
	

	this.addToScene = function(scene) {

		scene.addObject( new THREE.Mesh( new THREE.Plane( window.innerWidth, window.innerHeight ), this.postMaterial ) );

		mesh.position.z = - 4000;
		scene.addObject( mesh );

		mesh2.position.z = 0;
		scene.addObject( mesh2 );
		
	}


	this.animationFrame = function (delta) {

		
	};

}