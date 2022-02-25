//draw();
/* var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform vec3 u_Translation;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = vec4(vertPosition, 0.0, 1.0) + vec4(vec3(u_Translation.x, u_Translation.y, 0.0), -u_Translation.z);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n'); */
function draw() {
	console.log('This is working');
	//console.log(centroid_x[0])
	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}
	//initBkgnd();
	//gl.clearColor(0.0, 0.0, 0.0, 1.0); 
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	//initBkgnd();
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var vertexShaderText = `
	precision mediump float;
	attribute vec2 vertPosition;
	attribute vec3 vertColor;
	varying vec3 fragColor;
	uniform vec3 u_Translation;
	uniform vec2 u_rotation;
	void main()
	{
	 vec2 rotatedPosition = vec2(
	 vertPosition.x * u_rotation.y + vertPosition.y * u_rotation.x,
	 vertPosition.y * u_rotation.y - vertPosition.x * u_rotation.x);
	 fragColor = vertColor;
	 gl_Position = vec4(rotatedPosition, 0.0, 1.0) + vec4(vertPosition, 0.0, 1.0)+ vec4(vec3(u_Translation.x, u_Translation.y, 0.0), -u_Translation.z);
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
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	//var cx = (x[0][0] + x[0][1] + x[0][2] + x[0][3] + x[0][4] + x[0][5] + x[0][6])/7;
    //var cy = (x[1][0] + x[1][1] + x[1][2] + x[1][3] + x[1][4] + x[1][5] + x[1][6])/7;
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

	var transx = 0;
	var transy = 0;
	var transz = 0;
	var rotation = [0, 1];
	var ui_value = 0;
	const bodyElement = document.querySelector("body");
	bodyElement.addEventListener("keydown", KeyDown, false);
	//bodyElement.addEventListener("keyUp", KeyUp, false);
	
	function KeyDown(event){
		if("ArrowUp" === event.key){
			transy += 0.1;
		}
		else if("ArrowDown" === event.key){
			transy -= 0.1;
		}
		else if("ArrowRight" === event.key){
			transx += 0.1;
		}
		else if("ArrowLeft" === event.key){
			transx -= 0.1;
		}
		else if("-" === event.key){
			transz -= 0.1;
		}
		else if("+" === event.key){
			transz += 0.1;
		}
		else if("/" === event.key){
			ui_value += -10;
		}
	}  
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	//
	// Main render loop
	//
	const {width, height} = gl.canvas;
    //const leftWidth = width / 2 | 0;
	gl.useProgram(program);

	
   // gl.viewport(leftWidth, 0, rightWidth, height);
	//gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length/5);
	 var animate = function (){
	   //gl.viewport(0, 0, width, height);
	   gl.clearColor(1, 1, 1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		gl.clearDepth(1.0);
	   var u_Translation = gl.getUniformLocation(program, 'u_Translation');
	   var rotationLocation = gl.getUniformLocation(program, "u_rotation");
	   //var rotation = [0,1];
	   var angleInDegrees = 360 - ui_value;
       var angleInRadians = angleInDegrees * Math.PI / 180;
       rotation[0] = Math.sin(angleInRadians);
       rotation[1] = Math.cos(angleInRadians); 
	   //rotation[0] =  3;
	   gl.uniform2fv(rotationLocation, rotation);
	   gl.uniform3f(u_Translation, transx,transy, transz);
	   gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length/5);
	   window.requestAnimationFrame( animate );  
   }
   requestAnimationFrame( animate ); 
};
