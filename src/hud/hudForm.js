function hudForm( container, data, onsave ) {
	this.name = "Form-" + _random(0,99);
	this.container = container;	
	this.data = data;
	this.onsave = onsave;
}

hudForm.prototype.hide = function() {
	this.container.hide();
}

hudForm.prototype.renderProperties = function ( container, data) {
	this.container = _coalesce(container, this.container);	
	this.data = _coalesce(data, this.data);
	
	this.container.empty();
	
	this.items = $("<div class=\"form-items\"></div>");
	
	for (var property in this.data) {
		var item = $("<div class=\"form-item\"></div>");
		item.append("<label for=\"" + property + "\">" + property + "</label>");
		
		(function( _data, _property) {
			var input = $("<input type=\"text\" value=\"" + _data[_property] + "\"></input>")
				.change( function() { 
					//this.data[prop] = 
					_data[_property] = $( this ).val();
					//alert(_data[_property]);
					//str += $( this ).text() + " ";
				});
			item.append(input);
			}
		)(this.data, property);
		
		this.items.append(item);
	}
		
	this.container.append(this.items);
	
}

hudForm.prototype.renderSaveButton = function ( container, onclick ) {
	this.container = _coalesce(container, this.container);	
	var saveButton = new hudLink( {title:"Save", onclick: onclick} );
	this.container.append( saveButton.render() );
	var cancelButton = new hudLink( {title:"Cancel", onclick: null} );
	this.container.append( cancelButton.render() );
}