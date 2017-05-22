const User = require("../libs/User.js");
const GmailService = require("../libs/GmailService.js");
const TwitterService = require("../libs/TwitterService.js");
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
	var servicesInterval;
	var scrollAmount = 0;
	let gs;
	let ts;
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
	//gest.options.debug(true);

	FaceUtilAddon.onDetected(75, function (msg) {	// buradaki sayı 100-x = emin olma yüzdesi ne kadar düşük olursa o kadar emin olduğu zaman çağırır
		//msg = "can1";	// for debug only 
		msg = "burak2";

		loggedUser = User.loadFrom("data/" + msg + ".json");
		console.log(loggedUser);
		setNotificationUserName(loggedUser.id);
		if (loggedUser.gmailAuth) {
			gs = new GmailService(loggedUser);
			gs.readMail(15).then(setMails);//giriş yaptıktan sonra mailleri çekiyor
		}
		if (loggedUser.twitterAuth) {
			ts = new TwitterService(loggedUser);
			ts.readTweet(15).then(setTweets);//twitleri çekiyor
		}

		servicesInterval = setInterval(function () {//her 3 dk da bir mailleri/tweetleri tekrar çekiyor
			if (loggedUser.gmailAuth) {
				gs.readMail(15).then(setMails);
			}
			if (loggedUser.twitterAuth) {
				ts.readTweet(15).then(setTweets);
			}
		}, 3 * 60 * 1000);

		faceDetected = 1;
		FaceUtilAddon.stopListening(); //bunu kaldırırsan surekli dinler

		$("#notificationLogin").html(msg + ' hoşgeldin...');
		$("#notificationLogin").fadeIn("slow", function () {
			window.setTimeout(function () {
				$("#notificationLogin").fadeOut("slow", function () {
					$("#BodyElements").fadeIn("slow", function () {
						gest.start();
						startClock();
						$.getJSON("http://www.geoplugin.net/json.gp", function (data) {
							renderWeather(data["geoplugin_city"] + ", " + data["geoplugin_countryName"]);
						});
					});
				});
			}, 1000);
		});
	});

	var canGest = true;

	gest.options.subscribeWithCallback(function (gesture) {
		console.log(gesture.direction);
		if (canGest) {
			canGest = false;
			var dir = gesture.direction;
			setGestureDirectionShow(dir);
			if (faceDetected == 0 && dir === "Right") {
				gest.stop();
				window.setTimeout(function (a) {
					FaceUtilAddon.startListening();
					canGest = true;
				}, 150);
			}
			else if (faceDetected == 1) {
				window.setTimeout(function () {
					if ((dir == 'Right' || dir == 'Left') && onMailList != 1 && mailReading != 1) {
						dir == 'Right' ? index++ : index--;
						if (index >= $navigationElements.length) {
							index = 0;
						}
						else if (index < 0) {
							index = $navigationElements.length - 1;
						}
						$($('.navigationElement')[index]).click();

						if ($($('.navigationElement')[index]).data("type") === 'mails') {
							onMails = 1;
							onTwits = 0;
							onQuit = 0;
						}

						else if ($($('.navigationElement')[index]).data("type") === 'twitter') {
							onTwits = 1;
							onMails = 0;
							onQuit = 0;
						}
						else if ($($('.navigationElement')[index]).data("type") === 'quit') {
							onQuit = 1;
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
					}
					else if (onMails == 1 && (dir == 'Long down' || dir == 'Down') && mailList.length > 0) {
						onMailList = 1;
						onMails = 0;
						if ($('.mail').length > 0) {
							$($('.mail')[0]).click();
						}
					}
					else if (onMailList == 1 && mailReading == 0) {
						var mailCount = $('.mail').length;
						var mailIndex = $('.selected').data('mailindex');
						if (mailIndex < mailCount && (dir == 'Long down' || dir == 'Down')) {
							mailIndex++;
						}
						else if (dir == 'Long up' || dir == 'Up') {
							mailIndex--;
						}
						else if (dir == 'Right') {
							mailReading = 1;
							onMailList = 0;
						}

						if (mailIndex < 0) {
							onMailList = 0;
							onMails = 1;
							$('.selected').removeClass('selected');
						}
						$($('.mail')[mailIndex]).click();
					}
					else if (mailReading == 1 && dir == 'Left') {
						mailReading = 0;
						onMailList = 1;
						scrollAmount = 0;
						$($('.modal-body-content')[0]).animate({ scrollTop: 0}, "fast");
						
						$('#mailModalCloseButton').click();
					}
					else if (mailReading == 1 && (dir == 'Long down' || dir == 'Down')) {
						$($('.modal-body-content')[0]).animate({ scrollTop: scrollAmount += 200 }, "slow");
						if($('.modal-body-content')[0].scrollHeight < scrollAmount){
							scrollAmount = $('.modal-body-content')[0].scrollHeight;
						}
					}
					else if (mailReading == 1 && (dir == 'Long up' || dir == 'Up')) {
						$($('.modal-body-content')[0]).animate({ scrollTop: scrollAmount -= 200 }, "slow");
						if(scrollAmount < 0){
							scrollAmount = 0;
						}
					}
					canGest = true;
				}, 1000);
			}
			else {
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
					for (var i = 0; i < $('#contentArea').children().length - 1; i++) {
						$($('#contentArea').children()[i]).remove();
					}
				}
			};
		});

		$('#contentArea').ready(function () {
			if ($(_self).data("type") == "home") {
				$('#weather').ready(function () {
					startClock();
					$.getJSON("http://www.geoplugin.net/json.gp", function (data) {
						renderWeather(data["geoplugin_city"] + ", " + data["geoplugin_countryName"]);
					});
				});
			}
			else if ($(_self).data("type") == "quit") {
				$('#quit').on('click', function (e) {
					e.preventDefault();
					index = 0;
					faceDetected = 0;
					onMails = 0;
					onTwits = 0;
					onQuit = 0;
					loggedUser = null;
					clearInterval(servicesInterval);
					$("#BodyElements").fadeOut("slow", function () {
						$($('.navigationElement')[index]).click();
					});
				});
			}
			else if ($(_self).data("type") == "twitter") {
				$('#twitterList').ready(function () {
					renderTweets();
				});
			}
			else if ($(_self).data("type") == "mails") {
				//gs.readMail(15).then(setMails);
				if (mailList.length > 0) {
					$($('#mailList')[0]).html(getNavigationMails(mailList)).promise().done(function () {
						$('.mail').on('click', function () {
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
				else {
					$('#contentArea').html('<div class="nothingToShow"><p>Gösterilecek e-posta yok...</p></div>');
				}
			}
		});
	});
});
