$(document).ready(function() {
	console.log("ready");

	gest.start();
	//gest.options.debug(true);
	gest.options.subscribeWithCallback(function(gesture) {
		
		if(gesture.direction == "Right" || gesture.direction == "Left") {
			console.log(gesture.direction);
			gest.stop();
		}
	});
});