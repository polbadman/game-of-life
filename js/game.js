
function Cell(i,j){
	this.x = j;
	this.y = i;	
}

function GameOfLife(context,height,width){

	this.getMatrix = function(){
		var matrix = new Array(this.height);
		for(i=0;i<height;i++)
			matrix[i] = new Array(this.width);
	
		for(y=0;y<height;y++)
			for(x=0;x<width;x++)
				matrix[y][x] = 0;
				
		return matrix;
	};
	
	this.context = context;
	this.squad_size = 15;
	this.width = width;
	this.height = height;
	this.matrix = this.getMatrix();
	this.matrixNeighbour = this.getMatrix();
	this.listToDie = new Array();
	this.listToLive = new Array();
	this.generation = 0;
	this.dead = 0;
	this.alive = 0;
		
	this.isLive = function(y,x){
		return this.matrix[y][x] == 1;
	};
	
	this.activeStatus = function(posX,posY){
		var x = Math.floor(posX/15);
		var y = Math.floor(posY/15);		
		
		if(x > this.width || y > this.height)
			return;			
		
		this.matrix[y][x] = 1;
	};
	
	this.toggleStatus = function(posX,posY){
		var x = Math.floor(posX/15);
		var y = Math.floor(posY/15);		
		
		if(x > this.width || y > this.height)
			return;			
		
		if(this.matrix[y][x] == 0)
			this.matrix[y][x] = 1;
		else
			this.matrix[y][x] = 0;		
	};	
	
	this.drawGrid = function(){
		for(y=0;y<height;y++){
			for(x=0;x<width;x++){
				this.context.fillStyle = "rgb(255,255,255)";
				this.context.strokeRect (x*this.squad_size, y*this.squad_size, this.squad_size, this.squad_size); 
			}
		}
		this.context.fill();
		this.context.stroke();
	};
	
	this.clear = function(){
		for(y=0;y<height;y++)		
			for(x=0;x<width;x++)			
				this.matrix[y][x] = 0;
		this.paint();				
	};
	
	this.paint = function(){		
		for(y=0;y<this.height;y++){
			for(x=0;x<this.width;x++){
				if(this.matrix[y][x] == 1)
					this.context.fillStyle = "rgb(46, 110, 258)";  					
				else
					this.context.fillStyle = "rgb(255,255,255)";  					
				
				this.context.fillRect (x*this.squad_size+1, y*this.squad_size+1, this.squad_size-2, this.squad_size-2);			
			}
		}	
		
		this.context.fill();
		this.context.stroke();
	};
	
	this.neighbour = function(y,x){
		var amount = 0;		
		for(var i=y-1;i<=y+1;i++){
			for(var j=x-1;j<=x+1;j++){
				if(i != y || j != x)
					if(i >=0 && i < this.height && j>=0 && j<this.width )
						if(this.matrix[i][j] == 1)
							amount++;
			}			
		}		
		return amount;
	};
	
	this.updateNeighbour = function(){
		for(y=0;y<height;y++){
			for(x=0;x<width;x++){
				this.matrixNeighbour[y][x] = this.neighbour(y,x);
				var status = this.applyRule(y,x);
				if(status != 1){
					if(this.isLive(y,x) && status == 0)
						this.listToDie.push(new Cell(y,x));
					if(! this.isLive(y,x) && status == 2)
						this.listToLive.push(new Cell(y,x));
				}
			}
		}
	};
	
	this.applyRule = function(y,x){
		var amount = this.matrixNeighbour[y][x];
		if(amount <=1 || amount >= 4)	//Die
			return 0; 
		if(amount == 2){				//Nothing
			return 1;
		}
		if(amount == 3)					//Live
			return 2; 		
	};
	
	this.step = function(){
		this.updateNeighbour();
		
		while(this.listToDie.length != 0){
			var cell = this.listToDie.pop();
			this.matrix[cell.y][cell.x] = 0;
			this.dead++;
		}
		while(this.listToLive.length != 0){
			var cell = this.listToLive.pop();
			this.matrix[cell.y][cell.x] = 1;		
			this.alive++;
		}
		this.generation++;
	}
}
