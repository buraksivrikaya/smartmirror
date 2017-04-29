var navigationElements = {
	home: 'Ev',
	rss: 'RSS',
	mails: 'E-Posta',
	calendar: 'Ajanda',
	baskabisi: 'testüğşöç'
}

var mailFromList = [];
var mailDateList = [];
var mailSubjectList = [];
var mailContentList = [];
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
var getNavigationMails = function(){
	var template = '';
	$(mailFromList).each(function(index,value){
		template += createNavigationMailItem(index, value, mailDateList[index], mailSubjectList[index], mailContentList[index]);
	});

	return template;
	/*var template = '\
	  <li class="list-group-item mail" data-mailindex=0 data-mailcontent="icerik 0 icerik 0 icerik 0 icerik 0 icerik 0"><span class="mailFrom">burak sivrikaya</span><span class="mailSubject">konu konu konu</span><span class="mailDate">01.01.2017</span></li>\
	  <li class="list-group-item mail" data-mailindex=1 data-mailcontent="icerik 1 icerik 1 icerik 1 icerik 1 icerik 1"><span class="mailFrom">can ünsal      </span><span class="mailSubject">konu konu konu</span><span class="mailDate">01.01.2017</span></li> \
	  <li class="list-group-item mail" data-mailindex=2 data-mailcontent="icerik 2 icerik 2 icerik 2 icerik 2 icerik 2"><span class="mailFrom">erdem yazan    </span><span class="mailSubject">konu konu konu</span><span class="mailDate">01.01.2017</span></li>\
	  '+createNavigationMailItem(3,"hasan bulut", '3-5-1212', 'tez hakkında', 'yzzzzzza dasas dasbir content var icerik 3 icerik 34 icerik 123 fnaeqw faalan filan')+'';*/
	  
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

      underConstruction : '<div class="contentAreaElement" hidden>\
          <h1>Under Construction</h1>\
	  </div>'
};

var getNavigationHtml = function(dataType){
	if(dataType === "home"){return navigationContents.home;}
	else if(dataType === "mails"){return navigationContents.mails;}
	else{return navigationContents.underConstruction;}
};


//MAIL START
//var htmlToText = require('html-to-text');
var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: '*@gmail.com',
  password: '*',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  //params: { charset: 'utf8' }
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
	openInbox(function(err, box) {
		if (err) throw err;

		var mailEnd = 15; //Default 15 mails
		(box.messages.total-mailEnd) < 0 ? mailEnd = 0 : mailEnd = box.messages.total-mailEnd-1;
		var f = imap.seq.fetch(box.messages.total + ':' + mailEnd, { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)','TEXT'] });
		f.on('message', function(msg, seqno) {
			var prefix = '(#' + seqno + ') ';
			msg.on('body', function(stream, info) {
				var buffer = '';
				stream.on('data', function(chunk) {
					buffer += chunk.toString('utf8');
					//console.log(chunk);
					//buffer += utf8.decode(chunk);
					//buffer += new String(chunk, "utf8");
				});

				stream.once('end', function() {
					if (info.which !== 'TEXT'){
					 	mailFromList.push(Imap.parseHeader(buffer).from);
					 	mailDateList.push(Imap.parseHeader(buffer).date);
					 	mailSubjectList.push(Imap.parseHeader(buffer).subject);
					}
					else{
						/*var text = htmlToText.fromString(buffer, {
						    wordwrap: 130
						});*/
						mailContentList.push(buffer);
						console.log(buffer);
					}
				});
			});
		});
		f.once('error', function(err) {
			console.log('Fetch error: ' + err);
			errorMessage = 'Fetch error: ' + err;
		});
		f.once('end', function() {
			imap.end();
		});
	});
});
imap.once('error', function(err) {
  console.log(err);
  errorMessage = err;
});
imap.once('end', function() {
	imap.end();
});
imap.connect();
//MAIL END