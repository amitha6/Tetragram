//InitDemo();

function InitDemo() {
	console.log('This is working');

	var canvas1 = document.getElementById('surface');
	var gl1 = canvas1.getContext('webgl');

	if (!gl1) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl1 = canvas1.getContext('experimental-webgl');
	}

	if (!gl1) {
		alert('Your browser does not support WebGL');
	}

	gl1.clearColor(1, 1, 1, 1.0);
	gl1.clear(gl1.COLOR_BUFFER_BIT | gl1.DEPTH_BUFFER_BIT);

	var vertexShaderText = `
	precision mediump float;
	attribute vec2 vertPosition;
	attribute vec3 vertColor;
	varying vec3 fragColor;
	void main()
	{
	 fragColor = vertColor;
	 gl_Position = vec4(vertPosition, 0.0, 1.0);
	}`
	;
	
	
	var fragmentShaderText =`
	
	precision mediump float;
	varying vec3 fragColor;
	void main()
	{
	  gl_FragColor = vec4(fragColor, 1.0);
	}`
	;
	//
	// Create shaders
	// 
	var vertexShader = gl1.createShader(gl1.VERTEX_SHADER);
	var fragmentShader = gl1.createShader(gl1.FRAGMENT_SHADER);

	gl1.shaderSource(vertexShader, vertexShaderText);
	gl1.shaderSource(fragmentShader, fragmentShaderText);

	gl1.compileShader(vertexShader);
	if (!gl1.getShaderParameter(vertexShader, gl1.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl1.getShaderInfoLog(vertexShader));
		return;
	}

	gl1.compileShader(fragmentShader);
	if (!gl1.getShaderParameter(fragmentShader, gl1.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl1.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl1.createProgram();
	gl1.attachShader(program, vertexShader);
	gl1.attachShader(program, fragmentShader);
	gl1.linkProgram(program);
	if (!gl1.getProgramParameter(program, gl1.LINK_STATUS)) {
		console.error('ERROR linking program!', gl1.getProgramInfoLog(program));
		return;
	}
	gl1.validateProgram(program);
	if (!gl1.getProgramParameter(program, gl1.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl1.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var cx = 0.0;
    var cy = 0.0;
    var l = 1;
	var triangleVertices = 
	[ // X, Y,       R, G, B
		//orange
		cx+(l/2), cy+(l/2),    1.0, 0.67, 0.0,
		cx, cy,  1.0, 0.67, 0.0,
		cx-(l/2), cy+(l/2),  1.0, 0.67, 0.0,
		//blue
		cx+(l/2), cy+(l/2),  0.0, 0.0, 1.0,
        cx, cy,  0.0, 0.0, 1.0,
        cx+(l/2), cy-(l/2), 0.0, 0.0, 1.0,
		//yellow
		cx+(l/4), cy-(l/4),  1.0, 1.0, 0.0,
        cx, cy-(l/2),  1.0, 1.0, 0.0,
        cx+(l/2), cy-(l/2), 1.0, 1.0, 0.0,
		//red square
		cx+(l/4), cy-(l/4),  1.0, 0.0, 0.0,
        cx, cy-(l/2),  1.0, 0.0, 0.0,
        cx, cy, 1.0, 0.0, 0.0,
		cx-(l/4), cy-(l/4),  1.0, 0.0, 0.0,
        cx, cy-(l/2),  1.0, 0.0, 0.0,
        cx, cy, 1.0, 0.0, 0.0,
		//green
		cx, cy-(l/2), 0.0, 1.0, 0.0,
		cx-(l/2), cy,  0.0, 1.0, 0.0,
		cx-(l/2), cy-(l/2), 0.0, 1.0, 0.0,
        //cyan
		cx, cy, 0, 1,1 ,
		cx-(l/4), cy-(l/4),0, 1,1 ,
		cx-(l/4), cy+(l/4), 0, 1,1 ,
		//purple
		cx-(l/2),cy+(l/2),1, 0, 1,
		cx-(l/4),cy-(l/4), 1, 0, 1,
		cx-(l/4), cy+(l/4), 1, 0, 1,
		cx-(l/2),cy+(l/2),1, 0, 1,
		cx-(l/4),cy-(l/4), 1, 0, 1,
		cx-(l/2), cy,1,0, 1

	];

	var triangleVertexBufferObject1 = gl1.createBuffer();
	gl1.bindBuffer(gl1.ARRAY_BUFFER, triangleVertexBufferObject1);
	gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(triangleVertices), gl1.STATIC_DRAW);

	var positionAttribLocation1 = gl1.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation1 = gl1.getAttribLocation(program, 'vertColor');
	gl1.vertexAttribPointer(
		positionAttribLocation1, // Attribute location
		2, // Number of elements per attribute
		gl1.FLOAT, // Type of elements
		gl1.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl1.vertexAttribPointer(
		colorAttribLocation1, // Attribute location
		3, // Number of elements per attribute
		gl1.FLOAT, // Type of elements
		gl1.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl1.enableVertexAttribArray(positionAttribLocation1);
	gl1.enableVertexAttribArray(colorAttribLocation1);

	//
	// Main render loop
	//
	

	gl1.useProgram(program);
   	//gl1.viewport(leftWidth, 0, rightWidth, height);
	  /*  var animate = function (){
		gl1.drawArrays(gl1.TRIANGLES, 0, triangleVertices.length/5);
		window.requestAnimationFrame( animate );  
	}
	requestAnimationFrame( animate );  */
	gl1.drawArrays(gl1.TRIANGLES, 0, triangleVertices.length/5);
};
