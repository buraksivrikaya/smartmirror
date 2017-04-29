$(document).ready(function() {

	var $navigationElements = $('.navigationElement');
	var index = 0;
	var faceDetected = 0;
	var onMails = 0;
	var onMailList = 0;
	var mailReading = 0;
	const FaceUtilAddon = require('../build/Release/FaceUtilAddon');

	FaceUtilAddon.loadFaceDetector("data/lbpcascade_frontalface.xml");

	//FaceUtilAddon.trainFaceModel("data/csv.csv");
    //FaceUtilAddon.saveFaceModel("data/trained.data");
	FaceUtilAddon.loadFaceModel("data/trained.data");
	$($('.navigationElement')[index]).addClass('highlighted');

	$('#contentArea').append(getNavigationHtml($($('.navigationElement')[index]).data("type")));
	$('.contentAreaElement').show();
	gest.start();
	console.log("gest started");
	//gest.options.debug(true);


	FaceUtilAddon.onDetected(80, function(msg) {	// buradaki sayı 100-x = emin olma yüzdesi ne kadar düşük olursa o kadar emin olduğu zaman çağırır
        console.log(msg);
        faceDetected = 1;
        FaceUtilAddon.stopListening(); //bunu kaldırırsan surekli dinler
		window.setTimeout(function(a){
       		gest.start();
		},150);
    });

	gest.options.subscribeWithCallback(function(gesture) {
		var dir = gesture.direction;
		console.log(dir);
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
			    if((dir == 'Right' || dir == 'Left') && onMailList != 1 && mailReading != 1)  {
				    dir == 'Right' ? index++ : index --;
				    console.log("menu");
				    if(index >= $navigationElements.length){
				      index = 0;
				    }
				    else if(index < 0){
				      index = $navigationElements.length - 1;
				    }
				    $($('.navigationElement')[index]).click();

					if($($('.navigationElement')[index]).data("type")==='mails'){
					    	onMails = 1;
							console.log('MAIL USTUNDE');
							imap.connect();
					}
				    else{
				    	onMails = 0;
				    }
			    }
		  		else if(onMails == 1 && (dir == 'Long down'|| dir == 'Down')){
			    	onMailList = 1;
			    	onMails = 0;
			    	if($('.mail').length > 0){
			    		$($('.mail')[0]).click();
			    	}
						console.log('MAIL LISTESINE GIRDI');
		    	}
		    	else if(onMailList == 1 && mailReading == 0){
					console.log('MAIL LISTESINDE');
		    		var mailCount = $('.mail').length;
		    		console.log(mailCount);
		    		var mailIndex = $('.selected').data('mailindex');
		    		console.log(mailIndex);
		    		if(mailIndex < mailCount && (dir == 'Long down'|| dir == 'Down')){
		    			mailIndex ++;
		    		}
		    		else if(dir == 'Long up'|| dir == 'Up'){
		    			mailIndex --;
		    		}
		    		else if(dir == 'Right'){
		    			mailReading = 1;
		    			onMailList = 0;
						console.log('MAIL OKUYOR');
		    		}

		    		if(mailIndex < 0){
		    			onMailList = 0;
		    			onMails = 1;
		    			$('.selected').removeClass('selected');
						console.log('MAIL USTUNE GERI GIRDI');
		    		}
		    		$($('.mail')[mailIndex]).click();
		    	}
		    	else if(mailReading == 1 && dir == 'Left'){
						console.log('MAIL OKUMADAN CIKIS YAPTI');
		    		mailReading = 0;
		    		onMailList = 1;
		    		$('#mailModalCloseButton').click();
		    	}
			}, 1500);
		}
		//gest.stop();
	});

	$('.navigationElement').on('click', function(){
		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');
		$('#contentArea').append(getNavigationHtml($(this).data("type")));
        $($('#contentArea').children(":first")).fadeOut(150, function(){
        	this.remove();
        	$($('#contentArea').children(":last")).fadeIn(150), function(){
				if($('#contentArea').children().length > 1){
					for(var i = -1 ; i < $('#contentArea').children().length; i++ ){
						$($('#contentArea').children()[i]).remove();
					}
				}
        	};
        });
        if($(this).data("type") == "mails"){
        	$($('#mailList')[0]).html(getNavigationMails()).promise().done(function(){
				$('.mail').on('click', function(){
					console.log("MAİL CLICKED");
					if(mailReading == 1){
						$('#mailModal .modal-title').html($('.selected .mailFrom').html());
						$('#mailModal .modal-title-date').html($('.selected .mailDate').html());
						$('#mailModal .modal-body-subject').html($('.selected .mailSubject').html());
						//$('#mailModal .modal-body-content').html($('.selected').data('mailcontent'));
						$('#mailModal .modal-body-content').html(mailContentList[$('.selected').data('mailindex')]);
						$('#mailModal').modal('show');
					}
					else {
						$('.selected').removeClass('selected');
						$(this).addClass('selected');
					}
				});
        	});
        }
	});
});
/*$( "#book" ).fadeOut( "slow", function() {
    // Animation complete.
  });*/
