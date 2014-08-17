function tingHUD( params ) {
	this.element = params.element;
	this.width = params.width;
	this.height = params.height;
	this.messageQueue = [];
	
	this.element.css( { position:"fixed", backgroundColor:"transparent", fontSize:"32px"} );
	
	this.messages = $( "<div id=\"messages\"></div>" )
					.css( { position:"fixed", overflow:"hidden" } )
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
			message.css( { lineHeight:60 + "px" });
		}
	}
	message.css( {"color": params.color, border:"2px solid #2a2a40", opacity:0.9, backgroundColor:"#000022", padding:"5px 10px", marginTop:"5px"} ).hide()
	.prependTo( this.messages )
	.slideDown( 300, function() {
		_this.messageProcessed();
		}
	).delay(8000).fadeOut( 1000, function () {
		$(this).remove();
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
      $(this).width(width).height(height).css( {padding:"5px", "float":"left", display:"inline-block"} ).prependTo(target);
    });
}