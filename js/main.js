var mouseX = 0;
var mouseY = 0;

var context = 0;
var canvas = 0;

var game = 0;

var speed = 7;
var isPlay = false;
var isPress = false;
var showGrid = true;

function play() {
	game.step();
	if (isPlay)
		setTimeout(play, (10 - speed) * 100);
}

function resizeCanvas() {
	if ($(window).width() < 600)
		context.canvas.width = $("#menu").width() - 10;
	else
		context.canvas.width = $("#menu").width() - 10;
	if ($(window).height() < 400)
		context.canvas.height = 400;
	else
		context.canvas.height = $(window).height() - 135;
}

function openLink(param){
	var regex = "^#[0-9][0-9]*(,[0-9][0-9]*)*$";	
	if (param.match(regex)) {
		var values = param.replace("#","").split(",");				
		if(values.length%2 == 0){
			game.addValue(values);
		}else
			console.log("fail!");
	}
}

$(function() {
	canvas = document.getElementById('canvasGame');
	context = canvas.getContext('2d');

	resizeCanvas();
	
	game = new GameOfLife(context, context.canvas.height, context.canvas.width);
	game.drawGrid();
	
	
	openLink(location.hash);

	$("#sliderSpeed").slider({
		range : "min",
		value : 7,
		min : 1,
		max : 10,
		step : 1,
		slide : function(event, ui) {
			speed = ui.value;
			$("#labelSpeed").text("Speed: " + ui.value);
		}
	});
	
	$(document).bind("contextmenu",function(e){
        return false;
	});	

	$("#labelButtonGrid").addClass("ui-state-active");
	$("#dialog:ui-dialog").dialog("destroy");

	$("#dialog-modal").dialog({
		autoOpen : false,
		height : 350,
		show : "drop",
		hide : "drop",
		width : 550,
		modal : true,
		buttons : {
			Close : function() {
				$(this).dialog("close");
			}
		}
	});

	$("#anchorOpenHelp").click(function() {
		$("#dialog-modal").dialog("open");
	});
	
	$("#dialog-share").dialog({
		autoOpen : false,
		height : 180,
		show : "drop",
		hide : "drop",
		width : 550,
		modal : true,
		buttons : {
			Close : function() {
				$(this).dialog("close");
			}
		}
	});
	
	$("#input-link-share").focus(function(){
	    this.select();	    
	});
	
	$("#buttonShare").click(function() {
		$("#input-link-share").val(location.hostname+"/gameoflife/"+game.getLink());
		$("#input-link-share").focus();
		$("#dialog-share").dialog("open");
	});
	
	$("#buttonGrid").button({
		icons : {
			primary : "ui-icon-calculator"
		}
	});

	$("#buttonPlay").button({
		icons : {
			primary : "ui-icon-play"
		}
	});

	$("#buttonStop").button({
		icons : {
			primary : "ui-icon-stop"
		}
	});

	$("#buttonStep").button({
		icons : {
			primary : "ui-icon-seek-end"
		}
	});

	$("#buttonClear").button({
		icons : {
			primary : "ui-icon-trash"
		}
	});
	
	$("#buttonShare").button({
		icons : {
			primary : "ui-icon-link"
		}
	});

	$(window).resize(function(e) {

	});

	$("#canvasGame").mousemove(function(e) {
		if (e.offsetX) {
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		} else if (e.layerX) {
			mouseX = e.layerX;
			mouseY = e.layerY;
		} else if (e.clientX) { // Firefox
			mouseX = e.clientX - $("#canvasGame").offset().left;
			mouseY = e.clientY - $("#canvasGame").offset().top;
		}

		if (isPress) {
			game.liveByPosition(mouseX, mouseY);
		}
	});

	$("#canvasGame").click(function(e) {
		// if(!isPlay && !isPress)
		// game.toggleStatus(mouseX, mouseY);
	});

	$("#buttonClear").click(function(e) {
		if (!isPlay) {
			game.clear();
		}
	});
	
	$("#buttonGrid").click(function(e) {
		
		showGrid = ! showGrid;
		if(showGrid){
			$("#labelButtonGrid").addClass("ui-state-active");
			game.drawGrid();
		}else{
			game.removeGrid();
			$("#labelButtonGrid").removeClass("ui-state-active");
		}
	});

	$("#buttonStep").click(function(e) {
		if (!isPlay)
			game.step();
	});

	//    
	$("#buttonPlay").click(function() {
		isPlay = !isPlay;
		if (isPlay) {
			$("#buttonStep").fadeTo("fast", .4);
			$("#buttonClear").fadeTo("fast", .4);
			options = {
				label : "Pause",
				icons : {
					primary : "ui-icon-pause"
				}
			};
			play();
		} else {
			$("#buttonStep").fadeTo("fast", 1.9);
			$("#buttonClear").fadeTo("fast", 1.9);
			options = {
				label : "Play",
				icons : {
					primary : "ui-icon-play"
				}
			};
		}
		$(this).button("option", options);
	});

//	$("#canvasGame").mouseup(function() {
//		isPress = !isPress;
//
//	});

	$(document).mouseup(function() {
		isPress = false;

	});

	$("#canvasGame").mousedown(function() {
		isPress = true;
		game.toggleStatus(mouseX, mouseY);
	});

});
