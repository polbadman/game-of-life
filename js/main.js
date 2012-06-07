var mouseX = 0;
var mouseY = 0;
var context = 0;
var game = 0;
var isPlay = false;

function step(){
	game.step();
    game.paint();
   	updateInformation();
}

function play(){
	step();    
    if(isPlay)
		setTimeout(play,300);
}

function restart(){
	game.generation = 0;
	game.alive = 0;
	game.dead = 0;
	updateInformation();
}

function updateInformation(){
	 $("#spanGeneration").text("Generation: "+game.generation);
	 $("#spanAlive").text("Alive: "+game.alive);
	 $("#spanDead").text("Dead: "+game.dead);
}

$(function() {
  	var canvas = document.getElementById('canvasGame'),
    context = canvas.getContext('2d');
    
    var amount_y = 0;
    var amount_x = 0;
    var size_height = 0;
    var size_width = 0;
    
	var height = $(window).height()-$("#canvasGame").position().top-50;
	var width = $(window).width()-$("#canvasGame").position().left-60;
	
	while(size_height < height){
		amount_y++;
		size_height += 15;			
	}
	
	while(size_width < width){
		amount_x++;
		size_width += 15;			
	}
		
	canvas.height = size_height;
	canvas.width = size_width; 
    
	game = new GameOfLife(context,amount_y,amount_x);  	
    game.drawGrid();    
    game.paint(); 
    
    $("#buttonPlayStop").button({
    	icons: {
        	primary: "ui-icon-play"
        }
    });
    $("#buttonStep").button({
    	icons: {
			primary: "ui-icon-seek-end"
        }
    });
    $("#buttonClear").button({
    	icons: {
			primary: "ui-icon-trash"
        }
    });    	   
    
    $("#buttonPlayStop").click(function() { 
    	isPlay = ! isPlay;
   	   	if ( isPlay ) {
    		restart();
	    	$("#buttonStep").fadeTo("fast", .4); 
	    	$("#buttonClear").fadeTo("fast", .4); 
			options = {
				label: "Stop",
				icons: {
					primary: "ui-icon-stop"
				}
			};
			play();
		} else {
			$("#buttonStep").fadeTo("fast",1.9);
			$("#buttonClear").fadeTo("fast",1.9); 
			options = {
				label: "Play",
				icons: {
					primary: "ui-icon-play"
				}
			};
		}	
    	$( this ).button( "option", options );
    });     
    
	$("#buttonStep").click(function(e) { 
		if(!isPlay)
	    	step();
    }); 
    
    $("#buttonClear").click(function(e) { 
		if( ! isPlay){
			game.clear();
			restart();		
		}
    });       
	
	$("#canvasGame").click(function(e){
		if(! isPlay){
			game.toggleStatus(mouseX,mouseY);
			game.paint();
		}
	});
	
	$("#canvasGame").mouseup(function(){
		
	});
	
	$("#canvasGame").mousedown(function(){
		
	});
	
	$("#canvasGame").mousemove(function(e){
		if(e.offsetX) {
		    mouseX = e.offsetX;
		    mouseY = e.offsetY;
		}
		else if(e.layerX) {
		    mouseX = e.layerX;
		    mouseY = e.layerY;
		}else if(e.clientX){
			mouseX = e.clientX-$("#canvasGame").position().left-23;
			mouseY = e.clientY-$("#canvasGame").position().top-20;
		}
		//$("#mouseX").text("MouseX: "+mouseX);
		//$("#mouseY").text("MouseY: "+mouseY);
	});	
});






