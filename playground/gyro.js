var WIDTH, HEIGHT, MAX_WIDTH, MAX_HEIGHT;
var ball, ball_id;
var players = [];

function OnWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	hud.css( {"width":WIDTH+"px", "height":HEIGHT+"px"} );
	MAX_WIDTH = WIDTH-ball.width();
	MAX_HEIGHT = HEIGHT-ball.height();
	ball.css({top:(MAX_HEIGHT/2)+"px",left:((MAX_WIDTH)/2)+"px"});
}
		
function OnKeyPress(e) {
	
	if (true) {
		var key = e.keyCode ? e.keyCode : e.charCode;
		
		console.log("key:" + key);
		
		switch ( key ) {

			case 108 /* L */: light.visible = !light.visible;break;
			case 116 /* T */: 
                            resetGame();		
                            console.log("Game was reset.");				
			break;
			case 103 /* G */: 
				cleanGame();
			break;
		
		}
	}
	
	return false;
}


function cleanPlayers( data ) {
	var player, p_json;
    for (var i = 0, max = data.players.length; i < max; i++ ) {
		p_json = data.players[i];
		player = players[p_json.id];
		if (player) {						
			player.remove();
			players[p_json.id] = null;
		}
	}
}

function cleanGame() {
	$.get("/ting/multi/multi.php?op=clean", cleanPlayers );
}


function updatePlayer( data ) {
	ball_id = data.id;
	stats2.html( JSON.stringify(data) );
}
		
function registerPlayer ( data ) {	
	$.get("/ting/multi/multi.php?json=" + JSON.stringify( ball.position() ), updatePlayer );
}

function resetGame() {
	$.get("/ting/multi/multi.php?op=reset", registerPlayer );
}

function updatePlayers( data ) {
	var player, p_json, json;
    for (var i = 0, max = data.players.length; i < max; i++ ) {
		p_json = data.players[i];
		player = players[p_json.id];
		if (!player) {						
			player = $("<div></div>").css({position:"absolute",backgroundColor:"Black",width:"5mm",height:"5mm"});
			players[p_json.id] = player;
			hud.append( player );
		}					
		json = JSON.parse( p_json.json );
		player.css( {left: json.left * MAX_WIDTH, top: json.top * MAX_HEIGHT} );		 
	}
}

function play() {
	if (ball_id) {
		var position = ball.position();
		var json = {
			top: position.top / MAX_HEIGHT,
			left: position.left / MAX_WIDTH
		};

		$.get("/ting/multi/multi.php?json=" + JSON.stringify( json ) + "&id=" + ball_id, updatePlayers );
	}
	setTimeout( play, 100 );
}

/* INIT */	
$( function () {

	window.addEventListener('resize', OnWindowResize, false);
	document.addEventListener( 'keypress', OnKeyPress, false );
	
	/* HUD */
	hud = $("#hud").css({color:"Black",backgroundColor:"White"});
	ball = $("<div></div>").css({position:"absolute",backgroundColor:"Black",width:"5mm",height:"5mm"});

	hud.append( ball );
	stats = $("<div></div>");
	hud.append( stats );
	stats2 = $("<div></div>").css({position:"absolute",right:"0px"});
	hud.append( stats2 );
	
	registerPlayer();
	
	/*
	var winX = hud.addContainer("x", {width:"100%",height:"33.3%",position:"absolute",top:0,left:0} ).progressbar();
	var winY = hud.addContainer("y", {width:"100%",height:"33.3%",position:"absolute",top:"33.3%",left:0} ).progressbar();
	var winZ = hud.addContainer("z", {width:"100%",height:"33.3%",position:"absolute",top:"66.6%",left:0} ).progressbar();
*/
	window.ondevicemotion = function(event) {  
		var accelerationX = event.accelerationIncludingGravity.x;  
		var accelerationY = event.accelerationIncludingGravity.y;  
		var accelerationZ = event.accelerationIncludingGravity.z;
		
		stats.html("x:" + _round(accelerationX,4) + "<br/>y:" + _round(accelerationY,4) + "<br/>z:" + _round(accelerationZ,4));
		
		var position = ball.position();
		
		var left = position.left + ( accelerationY * 5 );		
		if (left<0) {
        	left = 0;
		} else if (left>MAX_WIDTH) {
			left = MAX_WIDTH;
		}
		var top = position.top + ( (accelerationX-6) * 5 );		
		if (top<0) {
        	top = 0;
		} else if (top>MAX_HEIGHT) {
			top = MAX_HEIGHT;
		}
		ball.css({left:left,top:top});
		
	}

	OnWindowResize();
	setTimeout(play, 100 );
	setTimeout(play, 10000 );
});




				