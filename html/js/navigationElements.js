var navigationElements = {
	home: 'Ev',
	twitter: 'Twitter',
	mails: 'E-Posta',
	quit: 'Çıkış'
};

var mailList = [];
var tweetList = [];
var errorMessage = 'none';
var getNavigationElements = function(){
	return navigationElements;
};

var createNavigationMailItem = function(index, from, date, subject, content){
	if(errorMessage !== 'none' || from === null || date == null || content === null){
		return 'E-POSTA ALINAMADI : ' + errorMessage;
	}
	else{
		return '<li class="list-group-item mail" data-mailindex=' + index + ' data-mailcontent="'+ 'content' + '\
		"><span class="mailFrom">'+ from +'\
		</span><span class="mailSubject">'+ subject +'\
		</span><span class="mailDate">'+ date +'</span></li>';
	}
};

var getNavigationMails = function(mails){
	var template = '';
	for(var index = 0; index < mails.length ; index++){
		var from = mails[index].sender;
		var date = mails[index].date;
		template += createNavigationMailItem(index, from , date, mails[index].subject, mails[index].html);
	}
	return template;
};

var navigationContents = {
	home : '<div class="contentAreaElement">\
				<div id="weather"></div>\
				<div id="clock" class="dark">\
					<div class="display">\
						<div class="weekdays"></div>\
						<div class="ampm"></div>\
						<div class="alarm"></div>\
						<div class="digits"></div>\
					</div>\
				</div>\
			</div>',

    mails : '<div class="contentAreaElement" hidden>\
          		 <ul id="mailList" class="list-group">'/*+ getNavigationMails() */+'\
				 </ul>\
     		 </div>',

    twitter : '<div class="contentAreaElement" hidden>\
          		 <div id="twitterList" class="container">\
				 </div>\
     		 </div>',

    quit : '<div class="contentAreaElement" hidden>\
          		 <div id="quit" class="container">\
          		 <p>Çıkış yapmak için aşağı kaydırınız..</p>\
				 </div>\
     		 </div>',

    underConstruction : '<div class="contentAreaElement" hidden>\
          <h1>Under Construction</h1>\
	  </div>'
};

var getNavigationHtml = function(dataType){
	if(dataType === "home"){return navigationContents.home;}
	else if(dataType === "mails"){return navigationContents.mails;}
	else if(dataType === "twitter"){return navigationContents.twitter;}
	else if(dataType === "quit"){return navigationContents.quit;}
	else{return navigationContents.underConstruction;}
};

var setMails = function(mails) {
	mailList = mails;
};

var setTweets = function(tweets){
	tweetList = tweets;
};

var renderTweets = function(){
	var tweets = tweetList;
	if(tweets.length > 0){
		tweetCount = tweets.length;
		var countForRow = 3; //twit count for each row, (max 12)
		var rowCount =  Math.ceil(tweetCount / countForRow);
		var temp = '';
		var tweetIndex = 0;
		for(var i=0; i<rowCount; i++){
			temp += '<div class="row" data-rowid='+i+'>';
			for(var n=0; n<countForRow; n++){
				if(tweets[tweetIndex]){
					temp+='<div class="tweetCell col-md-'+12 / countForRow+'">\
						<div class="tweetName">@'+ tweets[tweetIndex].sender +'</div>\
						<div class="tweetText">'+ tweets[tweetIndex].text +'</div>\
						<div class="tweetDate">'+ tweets[tweetIndex].date + '</div>\
					</div>'
					tweetIndex++;
				}
				else{
					break;
				}
			}
			temp += '</div>';
		}
		$('#twitterList').html(temp);
	}
	else{
		$('#contentArea').html('<div class="nothingToShow"><p>Gösterilecek tweet yok...</p></div>');
	}
};
var renderWeather = function(loc){
	$.simpleWeather({
	    location: loc,
	    woeid: '',
	    unit: 'C',
	    success: function(weather) {
	      html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
	      html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
	      html += '<li class="currently">'+weather.currently+'</li>';
	      html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
	  
	      $("#weather").html(html);
	    },
	    error: function(error) {
	      $("#weather").html('<div class="nothingToShow"><p>Hava Durumu getirelemedi. Hata : '+error+'</p></div>');
	    }
    });
};