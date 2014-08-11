function tingAudio( onloaded ) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.context = new AudioContext();
	var _audio = this;
	
	this.finishedLoading = function( bufferList )  {
				
		_audio.cloud = new tingSound( _audio.context, bufferList[0], 0.2 );
		/*	_audio.airplane = new tingSound( _audio.context, bufferList[1], 0.1 );
		_audio.eagle = new tingSound( _audio.context, bufferList[2], 1 );
		*/
		_audio.song = new tingSound( _audio.context, bufferList[1], 1 );	
		
		onloaded();
	}
	
	this.bufferLoader = new BufferLoader(
		this.context,
		[
		  'sound/cloud2.mp3',/*
		  'sound/airplane.mp3',
		  'sound/eagle.mp3',*/
		  'sound/ktpd.mp3',
		],
		this.finishedLoading
	);
	
	this.bufferLoader.load();
}

function tingSound( context, buffer, volume ) {
	this.context = context;
	this.buffer = buffer;	
	this.gainNode = context.createGain();
	this.gainNode.connect(context.destination);
	this.gainNode.gain.value = volume;
}

tingSound.prototype.play = function( ) {
	this.source = this.context.createBufferSource();		
	this.source.buffer = this.buffer;
	this.source.connect(this.gainNode);
	this.source.start(0);
}

tingSound.prototype.stop = function() {
	this.source.noteOff(0);
}