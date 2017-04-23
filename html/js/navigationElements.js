var navigationElements = {
	home: 'Ev',
	rss: 'RSS',
	mails: 'E-Posta',
	calendar: 'Ajanda',
	baskabisi: 'testüğşöç'
};

var getMails = function(){
	var template = '<li class="list-group-item mail" data-mailindex=0><span class="mailFrom">burak sivirkaya</span><span class="mailSubject">konu konu konu</span><span class="mailDate">01.01.2017</span></li>\
  <li class="list-group-item mail" data-mailindex=1><span class="mailFrom">can ünsal <span class="mailSubject">konu konu konu</span><span class="mailDate">01.01.2017</span></li> \
  <li class="list-group-item mail" data-mailindex=2><span class="mailFrom">erdem yazan  <span class="mailSubject">konu konu konu</span><span class="mailDate">01.01.2017</span></li>' ;
	return template;
};
var contents = {
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
          		 <ul id="mailList" class="list-group">'+getMails()+'\
				 </ul>\
     		 </div>',

      underConstruction : '<div class="contentAreaElement" hidden>\
          <h1>Under Construction</h1>\
	  </div>'
};

var getHtml = function(dataType){
	if(dataType === "home"){return contents.home;}
	else if(dataType === "mails"){return contents.mails;}
	else{return contents.underConstruction;}
};