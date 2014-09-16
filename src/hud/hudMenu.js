function hudMenu( params ) {
	this.name = _coalesce(params.name, "Menu-" + _random(0,99));
	this.hud = _coalesce(params.hud, hud);	
	this.css = _coalesce(params.css, { top:"1px", left:"150px", height:"45px", backgroundColor:"#080000", opacity:0.7} );
	this.container = this.hud.addContainer(this.name, this.css);
	this.links = [];
	
	if (params.links) {
		for (var i = 0, max = params.links.length; i < max; i++) {
			this.addLink( params.links[i] );	
		}
		this.renderLinks();
	}	
}

function hudLink( params ) {	
	this.title = _coalesce( params.title, "Link-" + _random(0,99));
	this.onclick = params.onclick;
}

hudLink.prototype.render = function ( ) {
	var link = $("<div class=\"hud-menu-link\"></div>").append( this.title );
	if (this.onclick) {
		link.bind( "click", this.onclick);
	}
	return link;
}

hudMenu.prototype.addLink = function ( params ) {
	this.links.push ( new hudLink( params ) );
}

hudMenu.prototype.renderLinks = function ( ) {
	this.container.empty();
	for (var i = 0, max = this.links.length; i < max; i++) {
		this.container.append( this.links[i].render() );	
	}	
}
