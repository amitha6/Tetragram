//fine();
function fine() {
	console.log('This is working');

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
	//gl.clearColor(0.75, 0.85, 0.8, 1.0);
	//initBkgnd();
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var vertexShaderText = `
	precision mediump float;
	attribute vec2 vertPosition;
	uniform vec3 u_Translation;
	attribute vec3 vertColor;
	varying vec3 fragColor;
	uniform vec2 u_rotation;
	uniform mat4 M_matrix;
	void main()
	{
	 fragColor = vertColor;
	 gl_Position =  M_matrix * vec4(vertPosition, 0.0, 1.0) + vec4(vec3(u_Translation.x, u_Translation.y, 0.0), -u_Translation.z);
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
	//Multiple figures
	function drawA(type, vertices) {
        var n = initBuffers(vertices);
        if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
        }
        gl.drawArrays(type, 0, n);
    }

    function initBuffers(vertices) {
        var n = vertices.length / 5;

        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var vertPosition = gl.getAttribLocation(program, 'vertPosition');
		var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        if (vertPosition < 0) {
            console.log('Failed to get the storage location of aPosition');
            return -1;
        }
        
        gl.vertexAttribPointer(
			vertPosition, // Attribute location
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
		gl.enableVertexAttribArray(vertPosition);
		gl.enableVertexAttribArray(colorAttribLocation);
        //gl.uniform4f("uColor", color[0], color[1], color[2], color[3]);
        return n;
    }
	//
	// Create buffer
	//
	var m_matrix = gl.getUniformLocation(program, "M_matrix");
	var m1_matrix = gl.getUniformLocation(program, "M_matrix");
	var mov_matrix = [[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
					[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
					[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
					[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
					[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
					[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
					[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],];
	var mov = [[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
				[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]];
    function rotateZ(m, angle, x, y) {
            //console.log(angle);
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            //Width and Height of canvas are 3.0 and 3.0
            //rotating figures about their respective Centroids

            m[0] = c;
            m[4] = -s;
            m[12] = (x) - (x)*c + (y)*s;
            m[1] = s;
            m[5] = c;
            m[13] = (y) - (x)*s - (y)*c;

    }
	var l = 1;
	 
	var transx = 0.0;
	var transy = 0.0;
	var transz = 0.0;
	var countx = 0;
	var county = 0;
	var countz = 0;
	//var trans = Array(r).fill().map(()=>Array(c).fill(0));
	var trans = [
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0]
	];
	var ui_value = [0,0,0,0,0,0,0];
	var u = 0;
	var rotation = [0, 1];
	//console.log(countx);
	var centrex = [];
	var centrey = [];
	var m = 0;
	document.addEventListener('keydown', function(event) {
		if(event.keyCode == 77) {
			m++;
			console.log("count:", m);
		}
	});
	const bodyElement = document.querySelector("body");
	bodyElement.addEventListener("keydown", KeyDown, false);
	//bodyElement.addEventListener("keyUp", KeyUp, false);
	function KeyDown(event){
		for(let i =0;i<7;i++){
		if(m%4 == 1){
			if(event.keyCode == 38){
				//county = 0.1;
				//console.log("Hi");
				 if(k==i ){
					trans[i][1]+= 0.01;
					centroid_y[i]+= 0.01;
				} 
			}
			else if("ArrowDown" === event.key ){
				//county = -0.1;
				if(k==i  ){
					trans[i][1]-= 0.01;
					centroid_y[i]-= 0.01;
				}
			}
			else if("ArrowRight" === event.key){
				//countx = +0.1;
				if(k==i){
					trans[i][0]+= 0.01;
					centroid_x[i]+= 0.01;
				}
			}
			else if("ArrowLeft" === event.key){
				//countx = -0.1;
				if(k==i ){
					trans[i][0]-= 0.01;
					centroid_x[i]-= 0.01;
				}
			}
			else if("-" === event.key){
				//countz = -0.1;
				if(k==i ){
					trans[i][2]-= 0.01;
				}
			}
			else if("+" === event.key){
				//countz = 0.1;
				if(k==i ){
					trans[i][2]+= 0.01;
				}
			}
			 else if("9" === event.key){
				if(k==i ){
					ui_value[i] -= 1/20.0;
				}
			} 
			else if("0" === event.key){
				if(k==i ){
					ui_value[i] += 1/20.0;
				}
			} 
		}
		else if(m%4 == 2){
			if("ArrowUp" === event.key){
				//county = 0.1;
				 for(let k =0; k<7; k++){
					trans[k][1]+= 0.01;
					centroid_y[k]+= 0.01;
				} 
			}
			else if("ArrowDown" === event.key){
				//county = -0.1;
				for(let k =0; k<7; k++){
					trans[k][1]-= 0.01;
					centroid_y[k]-= 0.01;
				}
			}
			else if("ArrowRight" === event.key){
				//countx = +0.1;
				for(let k =0; k<7; k++){
					trans[k][0]+= 0.01;
					centroid_x[k]+= 0.01;
				}
			}
			else if("ArrowLeft" === event.key){
				//countx = -0.1;
				for(let k =0; k<7; k++){
					trans[k][0]-= 0.01;
					centroid_x[k]-= 0.01;
				}
			}
			else if("-" === event.key){
				//countz = -0.1;
				for(let k =0; k<7; k++){
					trans[k][2]-= 0.01;
				}
			}
			else if("+" === event.key){
				//countz = 0.1;
				for(let k =0; k<7; k++){
					trans[k][2]+= 0.01;
				}
			}
			else if("9" === event.key){
				//countz = 0.1;
				//u += 1/20.0;
				//console.log(u);
				for(let k =0; k<7; k++){
					ui_value[k] -= 1/20.0;
					rotx[k] =  0.0;
					roty[k] =  0.0;
				} 
				//u -= 1/20.0;
			}
			else if("0" === event.key){
				//countz = 0.1;
				//u += 1/20.0;
				//console.log(u);
				for(let k =0; k<7; k++){
					ui_value[k] += 1/20.0;
					rotx[k] = 0.0;
					roty[k] = 0.0;
				}
			}
		}
	}
	}
	
	
	//centrex[0] = Math.random();
	//centrey[0] = Math.random();
	for (let i = 0; i < 7; i++) {
		centrex[i] = (10 - Math.floor(Math.random()*21))/15;
		centrey[i] = (10 - Math.floor(Math.random()*21))/15;
	} 
	var orange =[
		centrex[0]+(l/2), centrey[0]+(l/2),    1.0, 0.67, 0.0,
		centrex[0],centrey[0] ,  1.0, 0.67, 0.0,
		centrex[0]-(l/2), centrey[0]+(l/2),  1.0, 0.67, 0.0
	];
	var blue = [
		centrex[1]+(l/2), centrey[1]+(l/2),  0.0, 0.0, 1.0,
        centrex[1], centrey[1],  0.0, 0.0, 1.0,
        centrex[1]+(l/2), centrey[1]-(l/2), 0.0, 0.0, 1.0
	];
	var yellow = [
		centrex[2]+(l/4), centrey[2]-(l/4),  1.0, 1.0, 0.0,
        centrex[2], centrey[2]-(l/2),  1.0, 1.0, 0.0,
        centrex[2]+(l/2), centrey[2]-(l/2), 1.0, 1.0, 0.0
	];
	var red = [
		centrex[3]+(l/4), centrey[3]-(l/4),  1.0, 0.0, 0.0,
        centrex[3], centrey[3]-(l/2),  1.0, 0.0, 0.0,
        centrex[3], centrey[3], 1.0, 0.0, 0.0,
		centrex[3]-(l/4), centrey[3]-(l/4),  1.0, 0.0, 0.0,
        centrex[3], centrey[3]-(l/2),  1.0, 0.0, 0.0,
        centrex[3], centrey[3], 1.0, 0.0, 0.0
	];
	var green = [
		centrex[4], centrey[4]-(l/2), 0.0, 1.0, 0.0,
		centrex[4]-(l/2), centrey[4],  0.0, 1.0, 0.0,
		centrex[4]-(l/2), centrey[4]-(l/2), 0.0, 1.0, 0.0
	];
	var cyan = [
		centrex[5], centrey[5], 0, 1,1 ,
		centrex[5]-(l/4), centrey[5]-(l/4),0, 1,1 ,
		centrex[5]-(l/4), centrey[5]+(l/4), 0, 1,1
	];
	var purple = [
		centrex[6]-(l/2),centrey[6]+(l/2),1, 0, 1,
		centrex[6]-(l/4),centrey[6]-(l/4), 1, 0, 1,
		centrex[6]-(l/4), centrey[6]+(l/4), 1, 0, 1,
		centrex[6]-(l/2),centrey[6]+(l/2),1, 0, 1,
		centrex[6]-(l/4),centrey[6]-(l/4), 1, 0, 1,
		centrex[6]-(l/2), centrey[6],1,0, 1
	];
	var white = [
		0,0,1,1,1,
		0,0,1,1,1,
		0,0,1,1,1
	];
	var centroid_x = [];
	var centroid_y = [];
	centroid_x[0] = centrex[0];
	centroid_y[0] = centrey[0]+ l/3;
	centroid_x[1] = centrex[1]+ l/3;
	centroid_y[1] = centrey[1];
	centroid_x[2] = centrex[2]+l/4;
	centroid_y[2] = centrey[2]- 5*l/12;
	centroid_x[3] = centrex[3];
	centroid_y[3] = centrey[3]- l/4;
	centroid_x[4] = centrex[4]- l/3;
	centroid_y[4] = centrey[4] - l/3;
	centroid_x[5] = centrex[5] - l/6;
	centroid_y[5] = centrey[5];
	centroid_x[6] = centrex[6] - 3*l/8;
	centroid_y[6] = centrey[6]+ 3*l/8
	/* 
	function KeyUp(event){
		
	} */

	var rotx = [];
	var roty = [];
	rotx.push(...centroid_x);
	roty.push(...centroid_y);
	var rx = rotx[0] + rotx[1] + rotx[2] + rotx[3] + rotx[4] + rotx[5] + rotx[6]/ 7;
	var ry = roty[0] + roty[1] + roty[2] + roty[3] + roty[4] + roty[5] + roty[6]/ 7;
	
	//
	// Main render loop
	//
	const {width, height} = gl.canvas;
    const leftWidth = width / 2 | 0;
	gl.useProgram(program);
	//gl.viewport(0, 0, width, height);
	var x_cood, y_cood;
	function getMousePosition(canvas, event) {
		let rect = canvas.getBoundingClientRect();
		let x = event.clientX - rect.left;
		let y = event.clientY - rect.top;
		console.log("Coordinate x: " + x, 
					"Coordinate y: " + y);
		x_cood = (x-250)/250;
		y_cood = -(y-250)/250;
		console.log(x_cood);
		console.log(y_cood);
		var min = getDistance(centroid_x[0], centroid_y[0], x_cood, y_cood);
		var k =0;
		for(let i =1; i<7;i++){
			var m = getDistance(centroid_x[i], centroid_y[i], x_cood, y_cood);
			if(min > m){
				min = m;
				k = i;
			}
		}
		console.log(k);
		return k;
	}
  
	let canvasElem = document.querySelector("canvas");
	console.log(centroid_x[0]);
	console.log(centroid_y[0]);
	function getDistance(x1, y1, x2, y2){
		let y = x2 - x1;
		let x = y2 - y1;
		
		return Math.sqrt(x * x + y * y);
	}
	var x =0, y =0, z= 0;
	var k;
	canvasElem.addEventListener("mousedown", function(e)
		{
			k = getMousePosition(canvasElem, e);
		});
	//var mov = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	var rotate = [0,1];
	var animate = function (){
	   //gl.viewport(0, 0, width, height);
	   gl.clearColor(1, 1, 1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		gl.clearDepth(1.0);
		var u_Translation = gl.getUniformLocation(program, 'u_Translation');
		//rotateZ(mov[0], u, 0.0, 0.0);
		//gl.uniformMatrix4fv(m1_matrix,false,  mov[0]);
		gl.uniform3f(u_Translation, trans[0][0],trans[0][1], trans[0][2]);
		rotateZ(mov_matrix[0], ui_value[0], rotx[0], roty[0]);
		gl.uniformMatrix4fv(m_matrix,false,  mov_matrix[0]);
		drawA(gl.TRIANGLES, orange);
		gl.uniform3f(u_Translation, trans[1][0],trans[1][1], trans[1][2]);
		rotateZ(mov_matrix[1], ui_value[1], rotx[1], roty[1]);
		gl.uniformMatrix4fv(m_matrix,false, mov_matrix[1]);
	   drawA(gl.TRIANGLES, blue);
	   gl.uniform3f(u_Translation, trans[2][0],trans[2][1], trans[2][2]);
	   rotateZ(mov_matrix[2], ui_value[2], rotx[2], roty[2]);
	   gl.uniformMatrix4fv(m_matrix,false, mov_matrix[2]);
	   drawA(gl.TRIANGLES, yellow);
	   gl.uniform3f(u_Translation, trans[3][0],trans[3][1], trans[3][2]);
	   rotateZ(mov_matrix[3], ui_value[3], rotx[3], roty[3]);
	   gl.uniformMatrix4fv(m_matrix,false, mov_matrix[3]);
	   drawA(gl.TRIANGLES, red);
	   gl.uniform3f(u_Translation, trans[4][0],trans[4][1], trans[4][2]);
	   rotateZ(mov_matrix[4], ui_value[4], rotx[4], roty[4]);
	   gl.uniformMatrix4fv(m_matrix,false, mov_matrix[4]);
	   drawA(gl.TRIANGLES, green);
	   gl.uniform3f(u_Translation, trans[5][0],trans[5][1], trans[5][2]);
	   rotateZ(mov_matrix[5], ui_value[5], rotx[5], roty[5]);
	   gl.uniformMatrix4fv(m_matrix,false, mov_matrix[5]);
	   drawA(gl.TRIANGLES, cyan);
	   gl.uniform3f(u_Translation, trans[6][0],trans[6][1], trans[6][2]);
	   rotateZ(mov_matrix[6], ui_value[6], rotx[6], roty[6]);
	   gl.uniformMatrix4fv(m_matrix,false, mov_matrix[6]);
	   drawA(gl.TRIANGLES, purple);
	   //gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length/5);
	   drawA(gl.TRIANGLES, white);
	   window.requestAnimationFrame( animate );   
   }
   requestAnimationFrame( animate ); 
   //drawA(gl.TRIANGLES, orange);
   //drawA(gl.TRIANGLES, green);
   //gl.clearRect(0, 0, width, height);
   //console.log(centroid_x);
   //console.log(centroid_y)
   //x = [centroid_x, centroid_y]
   //return x;
};
