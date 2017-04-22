const google = require("googleapis");
const GmailAuth = require("./GmailAuth.js");

class GmailService {

	constructor(auth) {
		this.gmail = google.gmail({ auth: auth, version: 'v1' });
	}

	listLastXMailId(x, callback) {
		this.gmail.users.messages.list({
			userId: 'me',
			maxResults: x
		}, function(err, result) {
			if(!err) {
				callback(result.messages);
			} else {
				console.log(err);
			}
		});
	}

	getEmailById(emailId, callback) {
		this.gmail.users.messages.get({
			userId: 'me',
			id: emailId
		}, function(err, result) {
			if(!err) {
				callback(result);
			} else{
				console.log(err);
			}
		});
	}
}

module.exports = GmailService;