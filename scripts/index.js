$(document).ready(function() {
	console.log("ready");

	const FaceUtilAddon = require('../build/Release/FaceUtilAddon');

	FaceUtilAddon.loadFaceDetector("data/lbpcascade_frontalface.xml");
	//FaceUtilAddon.trainFaceModel("data/csv.csv");
    //FaceUtilAddon.saveFaceModel("data/trained.data");
	FaceUtilAddon.loadFaceModel("data/trained.data");

	gest.start();
	//gest.options.debug(true);
	gest.options.subscribeWithCallback(function(gesture) {
		console.log(gesture.direction);
		if(gesture.direction == "Right") {
			gest.stop();

		    setTimeout(function() {
		    	FaceUtilAddon.onDetected(80, function(msg) {
			        if(msg == "can") {
			        	console.log("welcome can");
			        }
			        FaceUtilAddon.stopListening();
			        FaceUtilAddon.close();
			    });
			    FaceUtilAddon.startListening();
		    }, 500);

		}
	});

});