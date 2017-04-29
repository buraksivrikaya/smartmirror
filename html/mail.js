var mailFromList = [];
var mailDateList = [];
var mailSubjectList = [];
var mailContentList = [];
var errorMessage = 'none';

var maila = {}
var error = {}
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
		(box.messages.total-mailEnd) < 0 ? mailEnd = 0 : mailEnd = box.messages.total-mailEnd-1;
		var f = imap.seq.fetch(box.messages.total + ':*', { bodies: '' });
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
                        maila = mail;
                    })
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
setTimeout(function(){/*
    console.log("FROM : " + mailFromList[0]);
    console.log("DATE : " + mailDateList[0]);
    console.log("SUBJECT : " + mailSubjectList[0]);
    console.log("CONTENT : " + mailContentList[0]);*/
console.log(maila);
console.log(maila.from.value[0].name);
console.log(maila.subject);
console.log(maila.date.toDateString() +' '+ maila.date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"));
console.log(maila.text);
console.log(maila.textAsHtml);
}, 1500);


