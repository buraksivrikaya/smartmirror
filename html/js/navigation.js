const User = require("../libs/User.js");
const GmailService = require("../libs/GmailService.js");
var renderMails;

$(document).ready(function () {

	var $navigationElements = $('.navigationElement');
	var index = 0;
	var faceDetected = 0;
	var onMails = 0;
	var onTwits = 0;
	var onQuit = 0;
	var onMailList = 0;
	var mailReading = 0;
	var mailInterval;
	let gs;
	let loggedUser;
	const FaceUtilAddon = require('../build/Release/FaceUtilAddon');

	FaceUtilAddon.loadFaceDetector("data/lbpcascade_frontalface.xml");

	FaceUtilAddon.trainFaceModel("data/csv.csv");
	FaceUtilAddon.saveFaceModel("data/trained.data");
	FaceUtilAddon.loadFaceModel("data/trained.data");
	$($('.navigationElement')[index]).addClass('highlighted');

	$('#contentArea').append(getNavigationHtml($($('.navigationElement')[index]).data("type")));
	$('.contentAreaElement').show();
	gest.start();
	console.log("gest started");
	//gest.options.debug(true);


	FaceUtilAddon.onDetected(80, function (msg) {	// buradaki sayı 100-x = emin olma yüzdesi ne kadar düşük olursa o kadar emin olduğu zaman çağırır
		//msg = "can1";	// for debug only 
		msg = "burak2";      
		console.log(msg);

		loggedUser = User.loadFrom("data/" + msg + ".json");
		console.log(loggedUser);
		setNotificationUserName(loggedUser.id);

		gs = new GmailService(loggedUser);

		gs.readMail(15).then(setMails);//giriş yaptıktan sonra mailleri çekiyor

		mailInterval = setInterval(function () {//her 3 dk da bir mailleri tekrar çekiyor
			gs.readMail(15).then(setMails);
		}, 3*60*1000);

		faceDetected = 1;
		FaceUtilAddon.stopListening(); //bunu kaldırırsan surekli dinler

		
		    
	    $("#notificationLogin").html(msg + ' hoşgeldin...');
	    $("#notificationLogin").fadeIn("slow", function() {
			window.setTimeout(function(){
				$("#notificationLogin").fadeOut( "slow", function() {
					$( "#BodyElements" ).fadeIn("slow", function(){
						gest.start();
					});
				});
		    },300);
		});
	});

	var canGest = true;

	gest.options.subscribeWithCallback(function (gesture) {
		if(canGest){canGest = false;
		var dir = gesture.direction;
		console.log(dir);
		setGestureDirectionShow(dir);
		if (faceDetected == 0 && dir === "Right") {
			console.log("faceDetection geç");
			gest.stop();
			window.setTimeout(function (a) {
				console.log(a);
				FaceUtilAddon.startListening();
				canGest = true;
			}, 150);
		}
		else if (faceDetected == 1) {
			window.setTimeout(function () {
				if ((dir == 'Right' || dir == 'Left') && onMailList != 1 && mailReading != 1) {
					dir == 'Right' ? index++ : index--;
					console.log("menu");
					if (index >= $navigationElements.length) {
						index = 0;
					}
					else if (index < 0) {
						index = $navigationElements.length - 1;
					}
					$($('.navigationElement')[index]).click();

					if ($($('.navigationElement')[index]).data("type") === 'mails') {
						onMails = 1;
						console.log('MAIL USTUNDE');
						onTwits = 0;
						onQuit = 0;
					}

					else if ($($('.navigationElement')[index]).data("type") === 'twitter') {
						onTwits = 1;
						console.log('TWIT USTUNDE');
						//twitleri render et
						onMails = 0;
						onQuit = 0;
					}
					else if ($($('.navigationElement')[index]).data("type") === 'quit') {
						onQuit = 1;
						console.log('ÇIKIŞ USTUNDE');
						onMails = 0;
						onTwits = 0;
					}
					else {
						onMails = 0;
						onTwits = 0;
						onQuit = 0;
					}
				}
				else if (onQuit == 1 && (dir == 'Long down' || dir == 'Down')) {
					onMailList = 0;
					onMails = 0;
					
					$('#quit').click();

					console.log('ÇIKIŞ YAP');
				}
				else if (onMails == 1 && (dir == 'Long down' || dir == 'Down')) {
					onMailList = 1;
					onMails = 0;
					if ($('.mail').length > 0) {
						$($('.mail')[0]).click();
					}
					console.log('MAIL LISTESINE GIRDI');
				}
				else if (onMailList == 1 && mailReading == 0) {
					console.log('MAIL LISTESINDE');
					var mailCount = $('.mail').length;
					console.log(mailCount);
					var mailIndex = $('.selected').data('mailindex');
					console.log(mailIndex);
					if (mailIndex < mailCount && (dir == 'Long down' || dir == 'Down')) {
						mailIndex++;
					}
					else if (dir == 'Long up' || dir == 'Up') {
						mailIndex--;
					}
					else if (dir == 'Right') {
						mailReading = 1;
						onMailList = 0;
						console.log('MAIL OKUYOR');
					}

					if (mailIndex < 0) {
						onMailList = 0;
						onMails = 1;
						$('.selected').removeClass('selected');
						console.log('MAIL USTUNE GERI GIRDI');
					}
					$($('.mail')[mailIndex]).click();
				}
				else if (mailReading == 1 && dir == 'Left') {
					console.log('MAIL OKUMADAN CIKIS YAPTI');
					mailReading = 0;
					onMailList = 1;
					$('#mailModalCloseButton').click();
				}

				canGest = true;
			}, 1000);
		}else{
			canGest = true;
			}
	}
		//gest.stop();
	});

	$('.navigationElement').on('click', function () {
		var _self = this;
		$('.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');
		$('#contentArea').append(getNavigationHtml($(this).data("type")));
		$($('#contentArea').children(":first")).fadeOut(150, function () {
			this.remove();
			$($('#contentArea').children(":last")).fadeIn(150), function () {
				if ($('#contentArea').children().length > 1) {
					for (var i = 0; i < $('#contentArea').children().length-1; i++) {
						$($('#contentArea').children()[i]).remove();
					}
				}
			};
		});


		$('#contentArea').ready(function(){
			if($(_self).data("type")=="quit"){
				$('#quit').on('click', function(e){
					e.preventDefault();
					index = 0;
					faceDetected = 0;
					onMails = 0;
					onTwits = 0;
					onQuit = 0;
					loggedUser = null;
					clearInterval(mailInterval);
					$( "#BodyElements" ).fadeOut("slow", function(){
						$($('.navigationElement')[index]).click();
					});
					console.log("ÇIKIŞ BUTONUNA BASILDI");

				});
			}
			else if($(_self).data("type")=="twitter"){
				$('#twitterList').ready(function(){
					setTweets([1,2,3,4,5,6,7,8,9,10,11,12,13]);
				});
			}
			else if($(_self).data("type")=="mails"){
				//gs.readMail(15).then(setMails);
				if(mailList.length > 0){
					$($('#mailList')[0]).html(getNavigationMails(mailList)).promise().done(function () {
						$('.mail').on('click', function () {
							console.log("MAIL CLICKED");
							if (mailReading == 1) {
								var indexOfMail = $('.selected').data('mailindex');
								$('#mailModal .modal-title').html(mailList[indexOfMail].sender);
								$('#mailModal .modal-title-date').html(mailList[indexOfMail].date);
								$('#mailModal .modal-body-subject').html(mailList[indexOfMail].subject);
								$('#mailModal .modal-body-content').html(mailList[indexOfMail].contentHtml);
								$('#mailModal').modal('show');
							}
							else {
								$('.selected').removeClass('selected');
								$(this).addClass('selected');
							}
						});
					});
				}
				else{
					$('#contentArea').html('<p style="margin-right: auto; margin-left:auto">Gösterilecek mail yok</p>');
				}
			}

		});
	});
});
