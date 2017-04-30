var navigationElements = {
	home: 'Ev',
	rss: 'RSS',
	mails: 'E-Posta',
	calendar: 'Ajanda',
	baskabisi: 'testüğşöç'
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
var getNavigationMails = function(){
	var template = '';
	for(var index = 0; index < mailList.length ; index++){
		var from = mailList[index].from.value[0].name === "" ? mailList[index].from.value[0].address : mailList[index].from.value[0].name;
		var date = mailList[index].date.toDateString() +' '+ mailList[index].date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
		template += createNavigationMailItem(index, from , date, mailList[index].subject, mailList[index].text);
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

var simpleParser = require("mailparser").simpleParser;

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
		(box.messages.total-mailEnd) < 0 ? mailEnd = 0 : mailEnd = box.messages.total-mailEnd+1;
		var f = imap.seq.fetch(box.messages.total + ':' + mailEnd, { bodies: '' });
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
				    simpleParser(buffer, (err, mail)=>{
                        if(mail.date != null){
                        	mailList.push(mail);
                        }
                    });
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