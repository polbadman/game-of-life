var SIZE = 15;


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
	this.showGrid = true;

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
			if (size_height + SIZE+3 > this.heightScreen)
				break;
			this.lines++;
			size_height += SIZE+3;
		}
		while (size_width < this.widthScreen) {
			if (size_width + SIZE+3 > this.widthScreen)
				break;
			this.columns++;
			size_width += SIZE+3;
		}
		// Redimensiona o canvas novamente para caber todos os quadrados
		this.context.canvas.width = (SIZE+3) * this.columns;
		this.context.canvas.height = (SIZE+3) * this.lines;
	};
	
	this.zoom = function(value){
		SIZE = 16-value;
		var auxLines =this.lines;
		var auxColumns = this.columns;
		var beforeCenter = new Cell(Math.floor(auxLines/2),Math.floor(auxColumns/2));
		
		this.lines = 0;
		this.columns = 0;
		this.init();
		var auxMatrix = this.getMatrix(this.lines, this.columns);
		var afterCenter = new Cell(Math.floor(this.lines/2),Math.floor(this.columns/2));
		
		var varJ = afterCenter.j-beforeCenter.j;
		var varI = afterCenter.i-beforeCenter.i;
			
		for(var i=0;i<auxLines;i++){
			for(var j=0;j<auxColumns;j++){
				if(this.matrix[i][j] == 1){
					auxMatrix[i+varI][j+varJ] = 1;
					//this.drawCell(i+varI, j+varJ);
				}
			}
		}
		this.matrix = auxMatrix;
		this.drawGrid();
		for(var i=0;i<auxLines;i++){
			for(var j=0;j<auxColumns;j++){
				if(this.matrix[i][j] == 1){
					this.drawCell(i, j);
				}
			}
		}
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
	
	this.addValue = function(values){
		for(var pos=0;pos<values.length;pos +=2){
			var i = values[pos];
			var j = values[pos+1];				
			this.live(i,j);
		}
	};
	
	this.getLink = function(){
		var link = "";
		for ( var y = 0; y < this.lines; y++) {
			for ( var x = 0; x < this.columns; x++) {
				if(this.matrix[y][x] == 1){
					link += y+","+x+",";
				}
			}
		}
		return "#"+link.substr(0,link.length-1);
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
	
	this.live = function(i,j) {	
		if (i < 0 || i >= this.lines || j < 0 || j >= this.columns)
			return;
		
		this.matrix[i][j] = 1;
		this.drawCell(i,j);
	};
	
	this.liveByPosition = function(posX, posY) {
		var x = Math.floor(posX / (SIZE+3));
		var y = Math.floor(posY / (SIZE+3));

		if (x > this.widthScreen || y > this.heightScreen)
			return;
		
		this.matrix[y][x] = 1;	

		this.drawCell(y, x);
	};

	this.toggleStatus = function(posX, posY) {
		var x = Math.floor(posX / (SIZE+3));
		var y = Math.floor(posY / (SIZE+3));

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

		if (this.matrix[i][j] == 1){
			this.context.fillStyle = "rgb(0,0,0)"; // Preto
			this.context.fillRect(j * (SIZE+3) + 2, i * (SIZE+3) + 2,(SIZE-2), (SIZE-2));
			this.context.fill();
			this.context.stroke();
		}else{
			this.context.clearRect(j * (SIZE+3) + 2, i * (SIZE+3) + 2,(SIZE-2),(SIZE-2));			
		}		
	};

	this.drawGrid = function() {
		if(this.showGrid){
			for ( var y = 0; y < this.lines; y++) {
				for ( var x = 0; x < this.columns; x++) {
					this.context.fillStyle = "rgb(15,115,115)";
					this.context.strokeRect(x * (SIZE + 3) + 1, y * (SIZE + 3)
							+ 1, SIZE, SIZE);
					this.drawCell(y, x);
				}
			}
			this.context.fill();
			this.context.stroke();
		}
	};
	
	this.removeGrid = function() {
		this.context.clearRect(0,0,this.widthScreen,this.heightScreen);
		for ( var y = 0; y < this.lines; y++)
			for ( var x = 0; x < this.columns; x++)
				this.drawCell(y,x);
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