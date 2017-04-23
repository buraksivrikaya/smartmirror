const google = require("googleapis");
const OAuth2 = google.auth.OAuth2;

class GmailAuth {

	constructor(clientId, clientSecret, redirectUrl, scopes) {
		this.clientAuth = new OAuth2(clientId, clientSecret, redirectUrl);
		this.scopes = scopes;
	}

	generateAuthUrl() {
		return this.clientAuth.generateAuthUrl({
			access_type: "offline",
			scope: this.scopes
		});
	}

	authorize(code) {
		let that = this;
		this.clientAuth.getToken(code, function(err, tokens) {
			if(!err) {
				that.clientAuth.setCredentials(tokens);
				//console.log(tokens);
				//saveTokens(tokens)
				console.log("done authorization");
			} else {
				console.log(err);
			}
		});
	}

	getAuth() {
		return this.clientAuth;
	}
}

module.exports = GmailAuth;