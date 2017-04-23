var navigationElements = {
	home: 'Ev',
	rss: 'RSS',
	mails: 'E-Posta',
	calendar: 'Ajanda',
	baskabisi: 'testüğşöç'
};

var getMails = function(){
	var konular
	var icerikler
	var template = '<li class="list-group-item">burak sivirkaya </li>\
  <li class="list-group-item">can ünsal <span>konu konu konu</span></li> \
  <li class="list-group-item">erdem yazan </span></li>' ;
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
                 <h1>mailler</h1>\
          		 <ul class="list-group">'+getMails()+'\
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