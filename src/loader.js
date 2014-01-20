function tingLoader( element, onloaded, onstart ) {

	this.toLoad = [];
	this.onstart = onstart;
	this.onloaded = onloaded;
	this.ready = false;
	this.elements_loaded = 0;
	this.element = element;
	this.tableElement = $( ".item-table", this.element );	
	this.progressBarElement = $(".progress-bar", this.element);
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
			var _this = this;
			var _button = $(".ok-button", this.element).css( {display:"block", opacity:0} ).animate( {opacity:1}, 500 );
			this.onloaded();
			_button.html ( "PLAY!" ).click( function () {
				_this.onstart();				
			} );
			
		}
	}
		
	
	this.updateProgress = function(  ) {
		var percentage = Math.round( (this.elements_loaded / this.toLoad.length) * 100 );
		this.progressBarElement.css( {width: percentage.toString() + "%" } );
	}
	
}