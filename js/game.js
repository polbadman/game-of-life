var Game = function(){
	
	this.cells = null;
	this.maxColumns = 200;
	this.maxLines = 100;
	
	//Callbacks
	this.onChange = null;
	this.onInit = null;
	
	this.init = function(){
		this.cells = createMatrix(this.maxLines,this.maxColumns);
		if(this.onInit != null){
			this.onInit();
		}
	};
	
	this.born = function(line,column){
		this.cells[line][column] = 1;
		if(this.onChange != null){
			this.onChange(line,column,"alive");
		}
	};
	
	this.kill = function(line,column){
		this.cells[line][column] = 0;
		if(this.onChange != null){
			this.onChange(line,column,"dead");
		}
	};
	
	this.isAlive = function(line,column){
		return this.cells[line][column] == 1;
	};
	
	// retorna quantos vizinhos vivos esta celula tem
	this.getNumberOfAliveNeighbors = function(line,column){
		var count = 0;
		
		for(var i=line-1;i<=line+1;i++){
			for(var j=column-1;j<=column+1;j++){
				if(i != -1 && j != -1 && i != this.maxLines && j != this.maxColumns){
					if(i != line || j != column){
						if(this.isAlive(i,j)){
							count++;
						}
					}
				}
			}
		}
		
		return count;
	}
	
	this.step = function(){
		var nextState = new Array();
		for(var i=0;i<this.maxLines;i++){
			for(var j=0;j<this.maxColumns;j++){
				var nAliveNeighbors = this.getNumberOfAliveNeighbors(i,j);
				//1 - Qualquer célula viva com menos de dois vizinhos vivos morre de solidão.
				if(this.isAlive(i,j) && nAliveNeighbors < 2){
					nextState.push({line:i,column:j,next:"dead"});					
				}
				//2 - Qualquer célula viva com mais de três vizinhos vivos morre de superpopulação.
				else if(this.isAlive(i,j) && nAliveNeighbors > 3){
					nextState.push({line:i,column:j,next:"dead"});
				}
				//3 - Qualquer célula com exatamente três vizinhos vivos se torna uma célula viva.
				else if(nAliveNeighbors == 3){
					nextState.push({line:i,column:j,next:"alive"});
				}
				//3 - Qualquer célula com dois vizinhos vivos continua no mesmo estado para a próxima geração.
				else if(nAliveNeighbors == 2){
					//Stay state
				}
			}
		}
		var that = this;
		nextState.forEach(function(state) {
			if(state.next == "dead"){
				that.kill(state.line,state.column);
			}else if(state.next == "alive"){
				that.born(state.line,state.column);
			}
			if(that.onChange != null){
				that.onChange(state.line,state.column,state.next);
			}
		});
	};
	
	this.init();
};	