function tingLoader( element, onchange ) {

	this.toLoad = [];
	this.onchange = onchange;
	this.element = element;
	this.ready = true;
	this.percentage = 0;
	this.elements_loaded = 0;
	
	this.add = function( name ) {
		this.toLoad.push ( [false, name] );
		this.ready = false;
	}
	
	this.notify = function( name ) {
			
		this.refresh( name );
		this.renderTable( this.element );
		this.onchange( this.ready );
		
	}
	
	this.refresh = function( name ) {
		
		this.ready = true;
		this.elements_loaded = 0;
		
		for (var i = 0, j = this.toLoad.length; i < j; i++) {
			if (this.toLoad[i][1] == name) {
				this.toLoad[i][0] = true;				
			}
			if (!this.toLoad[i][0]) {
				this.ready = false;				
			} else {
				this.elements_loaded++;
			}
		}
		
		this.percentage = Math.round( (this.elements_loaded / this.toLoad.length) * 100 );
		
	}
	
	this.renderTable = function ( element ) {
	
		var html = "<table class=\"ting-loader\">";
			
		for (var i = 0, j = this.toLoad.length; i < j; i++) {
			html += "<tr><td>" + this.toLoad[i][1] + "</td><td>" + ((this.toLoad[i][0]) ? "ready" : "<img src=\"images/ajax-loader.gif\">") + "</td></tr>";
		}

		html += "<tr><td colspan=\"2\"><div class=\"progress-bar-wrapper\"><div class=\"progress-bar\" style=\"width:" + this.percentage + "%\"></div></div></td></tr>";
		html += "<tr><td>" + this.percentage + "%</td><td>" + this.elements_loaded + " / " + this.toLoad.length + "</td></tr>";		
		html += "</table>";
		
		element.html( html );
		
	}
		
	this.renderTable( this.element );

}