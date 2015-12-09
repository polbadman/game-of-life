function createMatrix(lines, columns){
	var matrix = new Array(lines);
	for (var i = 0; i < lines; i++) {
		matrix[i] = new Array(columns);
		for(var j=0;j<columns;j++){
			matrix[i][j] = 0;		  			
		}
	}
	return matrix;
}