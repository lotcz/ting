function tingLoader( element, onloaded, onstart ) {

	this.toLoad = [];
	this.onstart = onstart;
	this.onloaded = onloaded;
	this.ready = false;
	this.elements_loaded = 0;
	this.element = element;
	
	if (this.element) {
		this.tableElement = $( ".item-table", this.element );	
		this.progressBarElement = $(".progress-bar", this.element);
	}
	
	this.add = function( name ) {	
		this.toLoad.push ( [false, name] );
		if (this.tableElement) {
			var html = "<tr class=\"loader-item-" + this.toLoad.length + "\"><td class=\"item-name\">" + name + "</td><td class=\"item-state\"><img src=\"images/ajax-loader.gif\"></td></tr>";
			this.tableElement.append( html );
			this.updateProgress();
		}
	}
	
	this.notify = function( name ) {		
		this.ready = true;
		this.elements_loaded = 0;
		
		for (var i = 0, j = this.toLoad.length; i < j; i++) {
			if (this.toLoad[i][1] == name) {
				this.toLoad[i][0] = true;
				if (this.tableElement) {
					$(".loader-item-" + i + " > .item-state", this.tableElement).html( "ok" );
				}
			}
			if (!this.toLoad[i][0]) {
				this.ready = false;				
			} else {
				this.elements_loaded++;
			}
		}		
		
		this.updateProgress();	

		if (this.ready) {			
			this.onloaded();
				
			if (this.element) {
				var _this = this;
				var _button = $(".ok-button", this.element).css( {display:"block", opacity:0} ).animate( {opacity:1}, 500 );
				_button.html ( "PLAY!" ).click( function () {
					_this.onstart();				
				} );
			}
			
		}
	}
		
	
	this.updateProgress = function(  ) {
		var percentage = Math.round( (this.elements_loaded / this.toLoad.length) * 100 );
		if (this.progressBarElement) {
			this.progressBarElement.css( {width: percentage.toString() + "%" } );
		}
	}
	
}