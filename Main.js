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
var boardVertexPositionBuffer = null;		// Board
var boardVertexIndexBuffer = null;
var boardVertexColorBuffer = null;

var slotsVertexPositionBuffer = [];			// Slots
var slotsVertexIndexBuffer =  [];
var slotsVertexColorBuffer = [];

var draughtsVertexPositionBuffer = [];		// Draughts
var draughtsVertexIndexBuffer = [];
var draughtsVertexColorBuffer = [];

// The global transformation parameters ################################################################################

// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees
var angleXX = 40;
var angleYY = 0.0;
var angleZZ = 0.0;

// The scaling factors
var sx = 0.13;
var sy = 0.13;
var sz = 0.13;

// Animation controls
var rotationXX_ON = 0;
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;

var rotationYY_ON = 0;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 0;
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;

var primitiveType = null;	// To allow choosing the way of drawing the model triangles
var projectionType = 1;		// To allow choosing the projection type

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

// Handling the Buffers
function initBuffers() {
	initBuffersBoard();
	initBuffersSlots();
	initBuffersDraughts();
}

function initBuffersBoard() {
	// Coordinates
	var vertices = board.getVertices();
	var colors = board.getColors();
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

	// Colors
	boardVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boardVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	boardVertexColorBuffer.itemSize = 3;
	boardVertexColorBuffer.numItems = vertices.length / 3;

	// Vertex indices
	boardVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boardVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boardVertexIndices), gl.STATIC_DRAW);
	boardVertexIndexBuffer.itemSize = 1;
	boardVertexIndexBuffer.numItems = 36;
}

function initBuffersSlots() {
	for (var i = 0; i < 8; i++) {			// For each line (we have 8 x 8 = 8^2 slots)
		var line = slots[i];

		for (var j = 0; j < line.length; j++) {					// For each column
			// Slot
			var slot = line[j];

			// Coordinates
			var vertices = slot.getVertices();
			var colors = slot.getColors();
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

            // Colors
            var slotVertexColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, slotVertexColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            slotVertexColorBuffer.itemSize = 3;
            slotVertexColorBuffer.numItems = vertices.length / 3;

			// Vertex indices
			var slotVertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, slotVertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(slotVertexIndices), gl.STATIC_DRAW);
			slotVertexIndexBuffer.itemSize = 1;
			slotVertexIndexBuffer.numItems = 36;

			slotsVertexPositionBuffer.push(slotVertexPositionBuffer);
            slotsVertexColorBuffer.push(slotVertexColorBuffer);
			slotsVertexIndexBuffer.push(slotVertexIndexBuffer);
		}
	}
}

function initBuffersDraughts() {
	for (var i = 0; i < 24; i++) {

		// Slot
		var draught = draughts[i];

		// Coordinates
		var vertices = draught.getVertices();
		var colors = draught.getColors();
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

		// Colors
        var draughtVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, draughtVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        draughtVertexColorBuffer.itemSize = 3;
        draughtVertexColorBuffer.numItems = vertices.length / 3;

        // Vertex indices
		var draughtVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, draughtVertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(draughtVertexIndices), gl.STATIC_DRAW);
		draughtVertexIndexBuffer.itemSize = 1;
		draughtVertexIndexBuffer.numItems = 3072;

		draughtsVertexPositionBuffer.push(draughtVertexPositionBuffer);
        draughtsVertexColorBuffer.push(draughtVertexColorBuffer);
		draughtsVertexIndexBuffer.push(draughtVertexIndexBuffer);
	}
}
//----------------------------------------------------------------------------

// Drawing the model
function drawModel( modelVertexPositionBuffer,
                    modelVertexColorBuffer,
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
	/* gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, modelVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    */

	// Colors
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, modelVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

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
	
	// Instantiating the models

	// Board Model
	drawModel( boardVertexPositionBuffer,
		       boardVertexColorBuffer,
		       boardVertexIndexBuffer,
		       angleXX, angleYY, angleZZ,
	           sx, sy, sz,
	           tx, ty, tz,
	           mvMatrix,
	           primitiveType );

	// Slots Models
	for (var i = 0; i < slotsVertexPositionBuffer.length; i++) {
		drawModel(  slotsVertexPositionBuffer[i],
					slotsVertexColorBuffer[i],
					slotsVertexIndexBuffer[i],
					angleXX, angleYY, angleZZ,
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType );
	}

	// Draughts Models
	for (var j = 0; j < draughtsVertexPositionBuffer.length; j++) {
		drawModel(  draughtsVertexPositionBuffer[j],
                    draughtsVertexColorBuffer[j],
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
		/* gl.enable( gl.CULL_FACE );
		gl.cullFace( gl.BACK );*/
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