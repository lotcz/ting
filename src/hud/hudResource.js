hudResource.prototype = new hudForm();
hudResource.prototype.constructor = hudResource;    

function hudResource( params ) {
	this.name = _coalesce(params.name, "Resource-" + _random(0,99));
	this.hud = _coalesce(params.hud, hud);	
	this.resource = params.resource;
	this.height = 250;
	this.width = 600;
	this.css = _coalesce(params.css, { top:(this.hud.height-this.height-40)+"px", left:"250px", height:this.height+"px", width:this.width+"px", backgroundColor:"#000800",padding:"5px 10px", opacity:0.7} );
	this.container = this.hud.addContainer(this.name, this.css);
}

hudResource.prototype.render = function ( onsave ) {
	this.container.empty();
	
	var typeSelector = $("<select id=\"type\" name=\"type\"><option></option></select>");
	
	(function ( _this, _typeSelector ) { 
		typeSelector.change(function() {
				var newType = $(this).val();
				if (_this.resource.json.type != newType) {
					_this.resource.json.type = newType;
					switch (newType) {
						case "model" :
							_this.resource = new modelResource();	
							break;
						case "texture" :
							_this.resource = new textureResource();
							break;
						default :
							_this.resource = new basicResource();
						break;
					}
					_this.renderResourceForm();
				}
			});				
	})(this, typeSelector);
		
	for (var i = 0; i < tingResources.prototype.availableResourceTypes.length; i++) {
		$("<option value=\"" + tingResources.prototype.availableResourceTypes[i] + "\">" + tingResources.prototype.availableResourceTypes[i] + "</option>").appendTo(typeSelector);
	}
		
	var item = $("<div class=\"form-item\"></div>");
	item.append("<label for=\"type\">Type</label>");
	item.append(typeSelector);
	this.container.append(item);
	
	this.items = $("<div class=\"form-items\"></div>").css({height:(this.height-80)+"px"});
	this.container.append(this.items);
	
	this.renderResourceForm();
			
	(function( _this ) {
		_this.renderSaveButton( _this.container, function (e) { _this.saveResource(_this) });		
	})(this);
}

hudResource.prototype.renderResourceForm = function ( ) {
	if (this.resource) {
		this.renderProperties( this.items, this.resource.json ); 
	}
}

hudResource.prototype.saveResource = function ( _this ) {
	var _this = _coalesce( _this, this);
	
	if (_this.resource) {
		$.post( "../creator/php/saveResource.php", 
			{ 
				"resource_id":_this.resource.id, 
				"resource_json":_this.resource.getJSON() 
			}, 
			function (data) { 
				hud.message("Resource saved:" + data);
				_this.hide();
			} 
		);
	}
}