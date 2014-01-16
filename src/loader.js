function tingLoader( element, onstart ) {

	this.toLoad = [];
	this.onstart = onstart;
	this.ready = false;
	this.elements_loaded = 0;
	
	this.add = function( name ) {		
		var html = "<tr class=\"loader-item-" + this.toLoad.length + "\"><td class=\"item-name\">" + name + "</td><td class=\"item-state\"><img src=\"images/ajax-loader.gif\"></td></tr>";
		this.toLoad.push ( [false, name] );
		this.tableElement.append( html );
		this.updateProgress();
	}
	
	this.notify = function( name ) {		
		this.ready = true;
		this.elements_loaded = 0;
		
		for (var i = 0, j = this.toLoad.length; i < j; i++) {
			if (this.toLoad[i][1] == name) {
				this.toLoad[i][0] = true;
				$(".loader-item-" + i + " > .item-state", this.tableElement).html( "ok" );
			}
			if (!this.toLoad[i][0]) {
				this.ready = false;				
			} else {
				this.elements_loaded++;
			}
		}		
		
		this.updateProgress();	

		if (this.ready) {
			var _vanish = $(".vanish", this.element);
			var _button = $(".ok-button", this.element).css( {display:"block", opacity:0} ).click( this.onstart );
			_vanish.animate( {opacity:0}, 2000, function() { 
				_vanish.hide(); 
				_button.animate( {opacity: 1}, 1000 );
			} );
		}
	}
	
	this.updateProgress = function(  ) {
		var percentage = Math.round( (this.elements_loaded / this.toLoad.length) * 100 );
		$(".progress-bar", this.element).animate({width: percentage.toString() + "%" }, 1000);
	}
	
	this.renderTable = function( element ) {	
		var html = "<div id=\"ting-loader\">";
		html += "<img class=\"title-image\" src=\"images/title.png\">";
		html += "<div class=\"vanish\"><table class=\"item-table\"></table>";
		html += "<div class=\"progress-bar-wrapper\"><div class=\"progress-bar\" ></div></div></div>";
		html += "<div class=\"ok-button\">PLAY</div>";
		html += "</div>";		
		this.element = $( html );	
		this.tableElement = $( ".item-table", this.element );	
		element.append( this.element );
	}
		
	this.renderTable( element );

}