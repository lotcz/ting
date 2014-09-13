function tingHUD( params ) {
	this.element = params.element;
	this.width = params.width;
	this.height = params.height;
	this.messageQueue = [];
	this.element.css( { position:"fixed", backgroundColor:"transparent", fontSize:"36px"} );
	
	this.containers = [];
	
	this.messages = $( "<div id=\"messages\"></div>" )
					.css( { position:"fixed", overflow:"hidden", fontFamily:"messagesFont", lineHeight:"50px" } )
					.appendTo( this.element );
					
	this.OnResize( params );
	
}

tingHUD.prototype.OnResize = function ( params ) {
	this.width = params.width;
	this.height = params.height;		
	this.element.css( {top:"0px", left:"0px", width: this.width + "px", height: this.height + "px"} );
	
	this.messagesWidth = params.width - 400;
	this.messages.css( { 	top:(this.height*0.66) + "px",
							left:((this.width-this.messagesWidth)/2) + "px",
							width:this.messagesWidth + "px",
							height:(this.height*0.33) + "px"
						} );

}

tingHUD.prototype.processMessage = function ( params ) {
	var _this = this;
	var message = $("<div></div>").append( params.text );
	if (params.image) {
		if (params.image.length > 0) {
			this.loadImage(params.image, 50, 50, message);			
		}
	}
	message.css( {"color": params.color, border:"2px solid #2a2a40", opacity:0, backgroundColor:"#000015", padding:"5px 15px", marginTop:"5px"} ).hide()
	.prependTo( this.messages )
	.slideDown( 200, function() {
		$(this).animate( { opacity:0.91 }, 400, function() {
			_this.messageProcessed();
		}).delay(5000).fadeOut( 500, function () {
			$(this).remove();
		});
	});
}

tingHUD.prototype.messageProcessed = function ( ) {
	if (this.messageQueue.length > 0) {
		this.messageQueue.splice(0,1);
		if (this.messageQueue.length > 0) {
			this.processMessage( this.messageQueue[0] );		
		}
	}
}

tingHUD.prototype.enqueueMessage = function ( params ) {
	var messages = this.messageQueue.length
	this.messageQueue.push( params );	
	if (messages == 0) {		
		this.processMessage( params );
	}
}

tingHUD.prototype.message = function ( text, color ) {
	this.enqueueMessage( { "text":text, "color":_coalesce( color, "#D0D0D0") } );
}

tingHUD.prototype.error = function ( text ) {
	this.enqueueMessage( { "text":text, "color":"#FF0000" } );
}

tingHUD.prototype.warning = function ( text ) {
	this.enqueueMessage( { "text":text, "color":"#FD9B00" } );
}

tingHUD.prototype.specialMessage = function ( params ) {
	this.enqueueMessage( { "text":params.text, "color":_coalesce( params.color, "#D0D0D0"), "image":_coalesce(params.image, "")} );
}

tingHUD.prototype.loadImage = function (path, width, height, target) {
    $('<img src="'+ path +'">').load(function() {
      $(this).width(width).height(height).css( {marginTop:"10px", marginRight:"20px", "float":"left", display:"inline-block"} ).prependTo(target);
    });
}

/* CONTAINERS */

tingHUD.prototype.addContainer = function( name, css ) {
	this.containers[name] = $( "<div id=\"" + name + "\"></div>" )
					.css( { position:"fixed", overflow:"hidden", fontFamily:"messagesFont",top:"10px", left:"100px", width:"150px", height:"50px",color: "#e0e6e0", border:"2px solid #2a2a40", opacity:0.92, backgroundColor:"#105515", padding:"5px 15px", marginTop:"5px" } )
					.css( _coalesce( css, {} ))
					.appendTo( this.element );
}

tingHUD.prototype.updateContainer = function ( name, content ) {
	this.containers[name].html( content );
}

tingHUD.prototype.removeContainer = function ( name ) {
	this.containers[name].remove();
}

tingHUD.prototype.getContainer = function ( name ) {
	return this.containers[name];
}

