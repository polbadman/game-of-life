function Cell(i, j) {
	this.i = i;
	this.j = j;
}

function GameOfLife(context, height, width) {
	this.context;
	this.widthScreen;
	this.heightScreen;
	this.matrix;
	this.lines;
	this.columns;

	this.constructor = function(context, height, width) {
		this.context = context;
		this.widthScreen = width;
		this.heightScreen = height;
		this.lines = 0;
		this.columns = 0;
		this.init();
		this.matrix = this.getMatrix(this.lines, this.columns);
	};

	this.init = function() {
		var size_height = 0;
		var size_width = 0;

		while (size_height < this.heightScreen) {
			if (size_height + 18 > this.heightScreen)
				break;
			this.lines++;
			size_height += 18;
		}
		while (size_width < this.widthScreen) {
			if (size_width + 18 > this.widthScreen)
				break;
			this.columns++;
			size_width += 18;
		}
		// Redimensiona o canvas novamente para caber todos os quadrados
		this.context.canvas.width = 18 * this.columns;
		this.context.canvas.height = 18 * this.lines;
	};

	this.isAlive = function(y, x) {
		return this.matrix[y][x] == 1;
	};

	this.isDead = function(y, x) {
		return this.matrix[y][x] == 0;
	};

	this.clear = function() {
		for ( var y = 0; y < this.lines; y++){
			for ( var x = 0; x < this.columns; x++){
				this.matrix[y][x] = 0;
				this.drawCell(y,x);
			}
		}		
	};

	this.getMatrix = function(lines, columns) {
		var matrix = new Array(lines);
		for ( var i = 0; i < lines; i++)
			matrix[i] = new Array(columns);

		for ( var y = 0; y < lines; y++)
			for ( var x = 0; x < columns; x++)
				matrix[y][x] = 0;

		return matrix;
	};
	
	this.live = function(posX, posY) {
		var x = Math.floor(posX / 18);
		var y = Math.floor(posY / 18);

		if (x > this.widthScreen || y > this.heightScreen)
			return;
		
		this.matrix[y][x] = 1;	

		this.drawCell(y, x);
	};

	this.toggleStatus = function(posX, posY) {
		var x = Math.floor(posX / 18);
		var y = Math.floor(posY / 18);

		if (x > this.widthScreen || y > this.heightScreen)
			return;

		if (this.matrix[y][x] == 0)
			this.matrix[y][x] = 1;
		else
			this.matrix[y][x] = 0;

		this.drawCell(y, x);
	};

	this.drawCell = function(i, j) {
		if (i < 0 || i >= this.lines || j < 0 || j >= this.columns)
			return;

		if (this.matrix[i][j] == 1)
			this.context.fillStyle = "rgb(0,0,0)"; // Preto
		else
			this.context.fillStyle = "rgb(255,255,255)"; // Branco

		this.context.fillRect(j * 18 + 2, i * 15 + 2 + 3 * i, 13, 13);
		this.context.fill();
		this.context.stroke();
	};

	this.drawGrid = function() {
		for ( var y = 0; y < this.lines; y++) {
			for ( var x = 0; x < this.columns; x++) {
				this.context.fillStyle = "rgb(15,115,115)";
				this.context.strokeRect(x * 18 + 1, y * 18 + 1, 15, 15);
				this.drawCell(y,x);
			}
		}
		this.context.fill();
		this.context.stroke();
	};

	this.rule = function(amount) {
		if (amount <= 1 || amount >= 4) // Die
			return 0;
		if (amount == 2) { // Nothing
			return 1;
		}
		if (amount == 3) // Live
			return 2;
	};

	this.createNeighbour = function() {
		var neighbour = this.getMatrix(this.lines, this.columns);
		for ( var i = 0; i < this.lines; i++) {
			for ( var j = 0; j < this.columns; j++) {
				if (i > 0) {
					if (j > 0) {
						if (this.matrix[i - 1][j - 1] == 1)
							neighbour[i][j]++;
					}
					if (this.matrix[i - 1][j] == 1)
						neighbour[i][j]++;
					if (j < this.columns - 1) {
						if (this.matrix[i - 1][j + 1] == 1)
							neighbour[i][j]++;
					}
				}
				if (j > 0) {
					if (this.matrix[i][j - 1] == 1)
						neighbour[i][j]++;
				}
				if (j < this.columns - 1) {
					if (this.matrix[i][j + 1] == 1)
						neighbour[i][j]++;
				}
				if (i < this.lines - 1) {
					if (j > 0) {
						if (this.matrix[i + 1][j - 1] == 1)
							neighbour[i][j]++;
					}
					if (this.matrix[i + 1][j] == 1)
						neighbour[i][j]++;
					if (j < this.columns - 1) {
						if (this.matrix[i + 1][j + 1] == 1)
							neighbour[i][j]++;
					}
				}
			}
		}
		return neighbour;
	};

	this.applyRules = function(neighbour) {
		var listToDie = new Array();
		var listToLive = new Array();

		for ( var y = 0; y < this.lines; y++) {
			for ( var x = 0; x < this.columns; x++) {
				var status = this.rule(neighbour[y][x]);
				if (status != 1) {
					if (this.isAlive(y, x) && status == 0)
						listToDie.push(new Cell(y, x));
					if (this.isDead(y, x) && status == 2)
						listToLive.push(new Cell(y, x));
				}
			}
		}

		while (listToDie.length != 0) {
			var cell = listToDie.pop();
			this.matrix[cell.i][cell.j] = 0;
			this.drawCell(cell.i, cell.j);
		}
		while (listToLive.length != 0) {
			var cell = listToLive.pop();
			this.matrix[cell.i][cell.j] = 1;
			this.drawCell(cell.i, cell.j);
		}
	};

	this.step = function() {
		var neighbour = this.createNeighbour();
		this.applyRules(neighbour);
		// this.generation++;
	};

	this.constructor(context, height, width);
}