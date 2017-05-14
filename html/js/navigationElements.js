var navigationElements = {
	home: 'Ev',
	twitter: 'Twitter',
	mails: 'E-Posta',
	quit: 'Çıkış'
}

var mailList = [];
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
	home : '<div class="contentAreaElement" hidden>\
          <h1>What is Lorem Ipsum?</h1>\
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. \
			Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, \
			when an unknown printer took a galley of type and scrambled it to make a type \
			specimen book. It has survived not only five centuries, but also the leap into \
			electronic typesetting, remaining essentially unchanged. It was popularised in \
			the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, \
			and more recently with desktop publishing software like Aldus PageMaker including \
			versions of Lorem Ipsum.\
      </div>',

    mails : '<div class="contentAreaElement" hidden>\
          		 <ul id="mailList" class="list-group">'/*+ getNavigationMails() */+'\
				 </ul>\
     		 </div>',

    twitter : '<div class="contentAreaElement" hidden>\
          		 <div id="twitterList" class="container" style="border: 1px solid">\
          		 	<div class="row"></div>\
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
	console.log("mailler : ");
	console.log(mails);
}