function tingAudio( onloaded ) {

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	var finishedLoading = function( bufferList )  {

		this.source1 = context.createBufferSource();
		//var source2 = context.createBufferSource();
		this.source1.buffer = bufferList[0];
		//source2.buffer = bufferList[1];

		this.source1.connect(context.destination);
		//source2.connect(context.destination);
		this.source1.start(0);
		//source2.start(0);

		onloaded();
	}
	
	bufferLoader = new BufferLoader(
		context,
		[
		  /*'sound/a2.wav',*/
		  'sound/ktpd.mp3',
		],
		finishedLoading
	);

	bufferLoader.load();
}

