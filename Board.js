class Board {

	constructor(boardS=10.0, boardH=1.5, slotS=1.0, slotH=0.2, margin=0.001) {
		if(boardS<8*slotS || boardH<slotH) {
			// ALERT SIZE ERROR
		}
		// Material
		var materialConstants = materials.BRONZE;
		this.kAmbi = materialConstants.slice(0,3);
		this.kDiff = materialConstants.slice(3,6);
		this.kSpec = materialConstants.slice(6,9);
		this.nPhong = materialConstants[9];

		// Slots
		var baseVal = -3.5*slotS;
		var x = baseVal;
		var y = baseVal;
		var colorBool = true;
		this.slots = new Array(8);
		for (var i = 0; i < slots.length; i++) {
			slots[i] = new Array(8);
			for (var j = 0; j < slots[i].length; j++) {
				slots[i][j] = new Slot(color,x,y,0,slotS,slotH);
				colorBool = !colorBool;
				y++;
			}
			colorBool = !colorBool;
			x++;
			y = baseVal;
		}

		this.vertices = [	-boardS/2,	-margin,		-boardS/2,
							-boardS/2,	-margin,		boardS/2,
							boardS/2,	-margin,		boardS/2,
							boardS/2,	-margin,		-boardS/2,
							-boardS/2,	-margin-boardH,	-boardS/2,
							-boardS/2,	-margin-boardH,	boardS/2,
							boardS/2,	-margin-boardH,	boardS/2,
							boardS/2,	-margin-boardH,	-boardS/2];
		// Index logic:
		//	--,-+,++
		//	++,+-,--
		this.vertexIndices = [	5,1,2,	2,6,5,	// Front	(1, 2, 5, 6)
								4,0,3,	3,7,4,	// Back		(0, 3, 4, 7)
								2,0,1,	1,3,2,	// Top		(0, 1, 2, 3)
								6,4,5,	5,7,6,	// Bottom	(4, 5, 6, 7)
								6,2,3,	3,7,6,	// Right	(2, 3, 6, 7)
								4,0,1,	1,5,4];	// Left		(0, 1, 4, 5)
	}

	setMaterial(material) {
		// do something regarding the parameter material, then:
		// var materialConstants = ???;
		// this.kAmbi = materialConstants.slice(0,3);
		// this.kDiff = materialConstants.slice(3,6);
		// this.kSpec = materialConstants.slice(6,9);
		// this.nPhong = materialConstants[9];
	}

	getVertices() {
		return this.vertices;
	}

	getSlotVertices() {
		var verticesArray = new Array();
		for (var i = 0; i < slots.length; i++) {
			for (var j = 0; j < slots[i].length; j++) {
				retVal.push(slots[i][j].getVertices());
			}
		}
		return verticesArray;
	}

	getSlots() {
		return this.slots;
	}
}

class Slot {

	// colorBool is boolean for there are two and only two colors
	// x, y and z are idCoord (center of top face)
	// s is side
	// h is height
	constructor(color, x=0.0,y=0.0,z=0.0,s=1.0,h=0.5) {
		this.colorBool = color;
		this.idCoords = [x,y,z];
		this.vertices = [	x-s/2,	y,		z-s/2,
							x-s/2,	y,		z+s/2,
							x+s/2,	y,		z+s/2,
							x+s/2,	y,		z-s/2,
							x-s/2,	y-h,	z-s/2,
							x-s/2,	y-h,	z+s/2,
							x+s/2,	y-h,	z+s/2,
							x+s/2,	y-h,	z-s/2];
		// Index logic:
		//	--,-+,++
		//	++,+-,--
		this.vertexIndices = [	5,1,2,	2,6,5,	// Front	(1, 2, 5, 6)
								4,0,3,	3,7,4,	// Back		(0, 3, 4, 7)
								2,0,1,	1,3,2,	// Top		(0, 1, 2, 3)
								6,4,5,	5,7,6,	// Bottom	(4, 5, 6, 7)
								6,2,3,	3,7,6,	// Right	(2, 3, 6, 7)
								4,0,1,	1,5,4];	// Left		(0, 1, 4, 5)
	}

	getCoords() {
		return this.idCoords;
	}

	getColorBool() {
		return this.colorBool;
	}

	getVertices() {
		return this.vertices;
	}
}

const materials = {
	BRONZE =			[	0.21,0.13,0.05,		0.71,0.43,0.18,		0.39,0.27,0.17,		25.6	],
	POLISHED_BRONZE =	[	0.25,0.15,0.06,		0.40,0.24,0.10,		0.77,0.46,0.20,		76.8	],
	COPPER =			[	0.19,0.07,0.02,		0.70,0.27,0.08,		0.26,0.14,0.08,		12.8	],
	POLISHED_COPPER =	[	0.23,0.08,0.03,		0.55,0.21,0.07,		0.58,0.22,0.07,		51.2	],
	CHROMIUM =			[	0.25,0.25,0.25,		0.40,0.40,0.40,		0.77,0.77,0.77,		76.8	],
	BRASS =				[	0.33,0.22,0.03,		0.78,0.57,0.11,		0.99,0.94,0.81,		27.9	],
	GOLD =				[	0.25,0.20,0.07,		0.75,0.60,0.23,		0.63,0.56,0.37,		51.2	],
	POLISHED_GOLD =		[	0.25,0.22,0.06,		0.35,0.31,0.09,		0.80,0.73,0.21,		83.2	],
	POLISHED_SILVER =	[	0.23,0.23,0.23,		0.28,0.28,0.28,		0.77,0.77,0.77,		89.6	],
	RED_PLASTIC =		[	0.30,0.00,0.00,		0.60,0.00,0.00,		0.80,0.60,0.60,		32.0	],
	SHINY_BLUE =		[	0.00,0.00,0.50,		0.00,0.00,1.00,		1.00,1.00,1.00,		125.0	],
	GRAY =				[	0.10,0.10,0.10,		0.50,0.50,0.50,		0.70,0.70,0.70,		1.0		]	
}