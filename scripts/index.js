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
		    	FaceUtilAddon.onDetected(80, function(msg) {	// buradaki sayı 100-x = emin olma yüzdesi ne kadar düşük olursa o kadar emin olduğu zaman çağırır
			        console.log(msg);
			        //FaceUtilAddon.stopListening();
			        //bunu kaldırırsan surekli dinler
			    });
			    FaceUtilAddon.startListening();
		    }, 100);

		}
	});

});