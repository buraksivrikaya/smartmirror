$(document).ready(function() {

	var $navigationElements = $('.navigationElement');
	var index = 0;
	var faceDetected = 0;
	const FaceUtilAddon = require('../build/Release/FaceUtilAddon');

	FaceUtilAddon.loadFaceDetector("data/lbpcascade_frontalface.xml");

	FaceUtilAddon.trainFaceModel("data/csv.csv");
    FaceUtilAddon.saveFaceModel("data/trained.data");
	//FaceUtilAddon.loadFaceModel("data/trained.data");
	$($('.navigationElement')[index]).addClass('highlighted');

	$('#contentArea').append(getHtml($($('.navigationElement')[index]).data("type")));

	gest.start();
	console.log("gest started");
	//gest.options.debug(true);


	setTimeout(function() {
    	FaceUtilAddon.onDetected(80, function(msg) {	// buradaki sayı 100-x = emin olma yüzdesi ne kadar düşük olursa o kadar emin olduğu zaman çağırır
	        console.log(msg);
	        faceDetected = 1;
	        FaceUtilAddon.stopListening();
	        //bunu kaldırırsan surekli dinler
			window.setTimeout(function(a){
	       		gest.start();
			},150);
	    });
    }, 100);

	gest.options.subscribeWithCallback(function(gesture) {
		var dir = gesture.direction;
		//console.log(dir);
		if(faceDetected == 0 && dir ==="Right"){
			console.log("faceDetection geç");
			gest.stop();
			window.setTimeout(function(a){
				console.log(a);
				FaceUtilAddon.startListening();
			},150);
		}
		else if(faceDetected == 1){
			window.setTimeout(function() {
			  if(dir == 'Right' || dir == 'Left') {
			    dir == 'Right' ? index++ : index --;

			    if(index >= $navigationElements.length){
			      index = 0;
			    }
			    else if(index < 0){
			      index = $navigationElements.length - 1;
			    }
			    $($('.navigationElement')[index]).click();
			  }
			}, 1500);
		}
		//gest.stop();
	});

	$('.navigationElement').on('click', function(){
		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');
		$('#contentArea').append(getHtml($(this).data("type")));
        $($('#contentArea').children(":first")).fadeOut(250, function(){
        	this.remove();
        	$($('#contentArea').children(":last")).fadeIn(500);
        });

	})
});
/*$( "#book" ).fadeOut( "slow", function() {
    // Animation complete.
  });*/
