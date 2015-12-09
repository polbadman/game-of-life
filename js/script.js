var game = new Game();

$(function() {
	var mouseX = 0;
	var mouseY = 0;
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var animationSpeed = 90;
	var intervalID = 0;
	
	var maxWidth = 80;
	var minWidth = 6;
	var width = 20;
	
	var isPressedButton = false;
	var isPressedKey = false;
	var isRunning = false;
	var isShowGrid = true;
	var isShowingSettingsPanel = false;
	
	game.onChange = function(line,column,state){
		if(state == "alive"){
			drawCell(line,column,"black");
		}else if(state == "dead"){
			drawCell(line,column,"white");
		}		
	};
	
	game.onInit = function(){
		draw();
	};
		
	function drawCell(line,column,color){
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.rect(column*width,line*width,width-1,width-1);
		ctx.fill();
	}

	function drawLine(x0,y0,x1,y1,lineWidth,color){
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);			
		ctx.stroke();
	}
	
	function drawGrid(){
		for(var i=0;i<game.maxColumns;i++){
			drawLine(width+i*width,0,width+i*width,game.maxLines*width,1,"black");
		}
		
		for(var i=0;i<game.maxLines;i++){
			drawLine(0,width+i*width,game.maxColumns*width,width+i*width,1,"black");
		}
	}
	
	function drawCells(){
		for(var i=0;i<game.maxLines;i++){
			for(var j=0;j<game.maxColumns;j++){
				if(game.cells[i][j] == 1){
					drawCell(i,j,"black");
				}
				if(game.cells[i][j] == 0){
					drawCell(i,j,"white");
				}
			}
		}	
	}
	
	function draw(){		
		//Clear the screen before draw
		ctx.clearRect (0 , 0 , canvas.width,canvas.height );		
		
		if(isShowGrid){
			drawGrid();
		}
	
		drawCells();	
	}
	
	function enableAllButtons(){
		$(".action-button").removeAttr('disabled');		
	}

	function disableAllButtons(){
		$(".action-button").attr('disabled','disabled');		
	}
	
	function getClickPosition(){
		if(mouseX >= game.maxColumns*width){
			return ;
		}

		if(mouseY >= game.maxLines*width){
			return;
		}
		
		return {
			line: Math.floor(mouseY/width),
			column: Math.floor(mouseX/width)
		}
	}
	
	function toggleCell(line,column){
		if(game.isAlive(line,column)){
			game.kill(line,column);
		}else{
			game.born(line,column);			
		}
	}
	
	$( window ).resize(function() {
		resizeCanvas();		
	});
	
	//Remove context menu when user click with right button
	$(document).bind("contextmenu",function(e){
		return false;
	}).keydown(function(event) {
		//Pressing the CRTL KEY
		if(event.keyCode == 17){
			isPressedKey = true;
		}
		if(event.keyCode == 16){
			for(var i=0;i<game.maxLines;i++){
				for(var j=0;j<game.maxColumns;j++){
					if(game.cells[i][j] == 1){
						console.log("game.born("+i+","+j+");");
					}					
				}
			}	
		}
	}).keyup(function(event) {
		isPressedKey = false;
	}).click(function(e) {
        if(e.target.id=="close-speed-popover" ){
			$('#speed-popover').popover('hide');		
        }
	});
		
	$( "canvas" ).mousemove(function( event ) {
		var rect = canvas.getBoundingClientRect();
	
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
		
		if(isPressedButton && isPressedKey){
			var pos = getClickPosition();
				
			if(pos == null){
				return;
			}
			
			game.born(pos.line,pos.column);			
		}
	}).click(function(event) {
		event.preventDefault();
		
		var pos = getClickPosition();
		
		if(pos == null || isPressedKey){
			return;
		}
		
		toggleCell(pos.line,pos.column);
	}).mousedown(function(event) {
		event.preventDefault();
		isPressedButton = true;			
	}).mouseup(function(event) {
		event.preventDefault();		
		isPressedButton = false;
	}).bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta < 0) {
			zoomOut();
		}else {
			zoomIn();
		}		
	    //prevent page fom scrolling
	    return false;
	}).css('cursor','pointer');
	
	$("#about").click(function(event) {
		$('#myModal').modal('show');
	});

	$("#startAndStop").click(function(event) {
		isRunning = !isRunning;
	
		if(isRunning){
			$("#startAndStop").html("<span class=\"glyphicon glyphicon-stop\"></span> Stop");
			disableAllButtons();
			start();
		}else{
			$("#startAndStop").html("<span class=\"glyphicon glyphicon-play\"></span> Play");
			enableAllButtons();			
		}		
	});
	
	$("#zoom-in").click(function(event) {
		zoomIn();	
	});
	
	$("#zoom-out").click(function(event) {
		zoomOut();
	});
	
	$("#step").click(function(event) {
		game.step();	
	});

	$("#clear-all").click(function(event) {
		if(confirm("Are you sure?")){
			resetAll();
		}
	});
	
	$("#settings").click(function(event) {
		$("#settings-modal").modal("show");		
	});
	
	$("#show-grid-select" ).change(function() {
		if($( this ).val() == 1){
			isShowGrid = true;
		}else{
			isShowGrid = false;
		}
		draw();
	});
	
	$('#slider-speed').slider({
		min: 1,
		max: 100,
		step: 1,
		value: animationSpeed
	}).on('slide', function (ev) {
		animationSpeed = ev.value;		
    });
	
	function resizeCanvas() {
		canvas.width = $("#panel").width();
		canvas.height = $(window).height() - $("#navbar").height() - $(".sec-nav-bar").height()-60;
		draw();
	}
	
  	function resetAll(){
		game.init();
	}	

	function zoomIn(){
		//scroll up
		if(width <= maxWidth){
			width += 2;
		}
		draw();
	}
	
	function zoomOut(){
		//scroll down
		if(width >= minWidth){
			width -= 2;
		}
		draw();
	}

	function start(){
		clearInterval(intervalID);
		
		game.step();
				
		if(isRunning){
			intervalID = setInterval(start, (100-animationSpeed)*10);
		}
	}

	resizeCanvas();
});	