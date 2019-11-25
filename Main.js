//////////////////////////////////////////////////////////////////////////////
//
//  Main.js
//
//  Paulo Vasconcelos, Pedro Teixeira November 2019
//  Adapted J. Madeira - November 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//
// WebGL context #######################################################################################################
var gl = null;
var shaderProgram = null;

// Game Entities #######################################################################################################
var board	 = new Board();
var slots 	 = board.getSlots();
var draughts = board.getDraughts();

// Buffers #############################################################################################################
var boardVertexPositionBuffer = null;											// Board
var boardVertexIndexBuffer = null;
var boardVertexTextureCoordBuffer;

var slotsVertexPositionBuffer = new Array(board.getNumberOfSlots());			// Slots
var slotsVertexIndexBuffer =  new Array(board.getNumberOfSlots());
var slotsVertexTextureCoordBuffer;

var draughtsVertexPositionBuffer = new Array(board.getNumberOfDraughts());		// Draughts
var draughtsVertexIndexBuffer = new Array(board.getNumberOfDraughts());
var draughtsVertexTextureCoordBuffer;

// The global transformation parameters ################################################################################

// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;

// The scaling factors
var sx = 0.25;
var sy = 0.25;
var sz = 0.25;

// Animation controls
var rotationXX_ON = 1;
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;

var rotationYY_ON = 1;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 1;
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;

var primitiveType = null;	// To allow choosing the way of drawing the model triangles
var projectionType = 0;		// To allow choosing the projection type

// Local Transformations ###############################################################################################

// TODO translation vectors for each draught

//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Textures

// From www.learningwebgl.com

function handleLoadedTexture(texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


var webGLTexture;

function initTexture() {
	
	webGLTexture = gl.createTexture();
	webGLTexture.image = new Image();
	webGLTexture.image.onload = function () {
		handleLoadedTexture(webGLTexture);
	};

	webGLTexture.image.src = "rotate.jpg";
}

//----------------------------------------------------------------------------

// Handling the Buffers
function initBuffers() {
	initBuffersBoard();
	initBuffersSlots();
	initBuffersDraughts();
}

function initBuffersBoard() {
	// Coordinates
	var vertices = board.getVertices();
	var boardVertexIndices = board.getVerticesIndexes();

	boardVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boardVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	boardVertexPositionBuffer.itemSize = 3;
	boardVertexPositionBuffer.numItems = vertices.length / 3;

	// Textures
	/*boardVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boardVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	boardVertexTextureCoordBuffer.itemSize = 2;
	boardVertexTextureCoordBuffer.numItems = 24;*/

	// Vertex indices
	boardVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boardVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boardVertexIndices), gl.STATIC_DRAW);
	boardVertexIndexBuffer.itemSize = 1;
	boardVertexIndexBuffer.numItems = 36;
}

function initBuffersSlots() {
	for (var i = 0; i < Math.sqrt(slots.length); i++) {			// For each line (we have 8 x 8 = 8^2 slots)
		var line = slots[i];

		for (var j = 0; j < line.length; j++) {					// For each column
			// Slot
			var slot = line[j];

			// Coordinates
			var vertices = slot.getVertices();
			var slotVertexIndices = slot.getVerticesIndexes();

			var slotVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, slotVertexPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			slotVertexPositionBuffer.itemSize = 3;
			slotVertexPositionBuffer.numItems = vertices.length / 3;

			// Textures
			/*boardVertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, boardVertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
            boardVertexTextureCoordBuffer.itemSize = 2;
            boardVertexTextureCoordBuffer.numItems = 24;*/

			// Vertex indices
			var slotVertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, slotVertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(slotVertexIndices), gl.STATIC_DRAW);
			slotVertexIndexBuffer.itemSize = 1;
			slotVertexIndexBuffer.numItems = 36;

			slotsVertexPositionBuffer.push(slotVertexPositionBuffer);
			slotsVertexIndexBuffer.push(slotVertexIndexBuffer);
		}
	}
}

function initBuffersDraughts() {
	for (var i = 0; i < Math.sqrt(draughts.length); i++) {			// For each line
		var line = draughts[i];

		for (var j = 0; j < line.length; j++) {							// For each column
			// Slot
			var draught = line[j];

			// Coordinates
			var vertices = draught.getVertices();
			var draughtVertexIndices = draught.getVerticesIndexes();

			var draughtVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, draughtVertexPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			draughtVertexPositionBuffer.itemSize = 3;
			draughtVertexPositionBuffer.numItems = vertices.length / 3;

			// Textures
			/*boardVertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, boardVertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
            boardVertexTextureCoordBuffer.itemSize = 2;
            boardVertexTextureCoordBuffer.numItems = 24;*/

			// Vertex indices
			var draughtVertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, draughtVertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(draughtVertexIndices), gl.STATIC_DRAW);
			draughtVertexIndexBuffer.itemSize = 1;
			draughtVertexIndexBuffer.numItems = 36;

			draughtsVertexPositionBuffer.push(draughtVertexPositionBuffer);
			draughtsVertexIndexBuffer.push(draughtVertexIndexBuffer);
		}

		console.log(draughtsVertexPositionBuffer[0]);
		console.log(draughtsVertexIndexBuffer[0]);
	}
}


//----------------------------------------------------------------------------

// Drawing the model
function drawModel( modelVertexPositionBuffer,
					modelVertexTextureCoordBuffer,
					modelVertexIndexBuffer,
					angleXX, angleYY, angleZZ,
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {

    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, modelVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// NEW --- Textures
	gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, modelVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    
    // The vertex indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelVertexIndexBuffer);

	// Drawing the triangles
	gl.drawElements(gl.TRIANGLES, modelVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing with the background color
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// NEW --- Computing the Projection Matrix
	if( projectionType == 0 ) {
		// For now, the default orthogonal view volume
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		tz = 0;
	}
	else {
		// A standard view volume
		// Viewer is at (0,0,0)
		// Ensure that the model is "inside" the view volume
		pMatrix = perspective( 45, 1, 0.05, 10 );
		tz = -2.25;
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Instatiating the models

	// Board Models
	drawModel( boardVertexPositionBuffer,
		       boardVertexTextureCoordBuffer,
		       boardVertexIndexBuffer,
		       angleXX, angleYY, angleZZ,
	           sx, sy, sz,
	           tx, ty, tz,
	           mvMatrix,
	           primitiveType );

	// Slots Models
	for (var i = 0; i < slotsVertexPositionBuffer.length; i++) {
		drawModel(  slotsVertexPositionBuffer[i],
					slotsVertexTextureCoordBuffer[i],
					slotsVertexIndexBuffer[i],
					angleXX, angleYY, angleZZ,
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType );
	}

	// Draughts Models
	for (var j = 0; i < draughtsVertexPositionBuffer.length; j++) {
		drawModel(  draughtsVertexPositionBuffer[j],
					draughtsVertexTextureCoordBuffer[j],
					draughtsVertexIndexBuffer[j],
					angleXX, angleYY, angleZZ,
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType );
	}
}

//----------------------------------------------------------------------------
// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;

		// All rotations are
		if( rotationXX_ON ) {

			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationYY_ON ) {

			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationZZ_ON ) {

			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
	    }
	}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------
// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	// NEW --- Processing keyboard events 
	
	handleKeys();
	
	drawScene();
	
	animate();
}

//----------------------------------------------------------------------------
// User Interaction

function outputInfos(){
		
}

//----------------------------------------------------------------------------
// WebGL

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		// Some browsers still need "experimental-webgl"
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		primitiveType = gl.TRIANGLES;

		// Enable FACE CULLING and DEPTH TEST
		gl.enable( gl.CULL_FACE );
		gl.cullFace( gl.BACK );
		gl.enable( gl.DEPTH_TEST );

	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners( canvas );

	initBuffers();
	
	initTexture();
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}