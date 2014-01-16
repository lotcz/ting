function tingAudio( onloaded ) {

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	this.context = new AudioContext();
	var _audio = this;
	
	this.finishedLoading = function( bufferList )  {

		_audio.song = new tingSound( _audio.context, bufferList[0], 1 );				
		_audio.cloud = new tingSound( _audio.context, bufferList[1], 0.03 );
		_audio.airplane = new tingSound( _audio.context, bufferList[2], 0.1 );
		_audio.eagle = new tingSound( _audio.context, bufferList[3], 1 );
		
		onloaded();
	}
	
	this.bufferLoader = new BufferLoader(
		this.context,
		[
		  'sound/ktpd.mp3',
		  'sound/cloud.mp3',
		  'sound/airplane.mp3',
		  'sound/eagle.mp3',
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