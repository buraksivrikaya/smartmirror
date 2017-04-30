"use strict";
/**
 * GmailAuthorizer
 */
exports.__esModule = true;
var googleapis = require("googleapis");
var Oauth2 = googleapis.auth.OAuth2;
var GmailAuthorizer = (function () {
    function GmailAuthorizer(clientId, clientSecret, redirectUrl, scopes) {
        this.gmailAuth = new Oauth2(clientId, clientSecret, redirectUrl);
        this.scopes = scopes;
    }
    GmailAuthorizer.prototype.generateAuthUri = function () {
        return this.gmailAuth.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes
        });
    };
    GmailAuthorizer.prototype.authorize = function (code) {
        var that = this;
        this.gmailAuth.getToken(code, function (error, tokens) {
            if (!error) {
                that.gmailAuth.setCredentials(tokens);
            }
            else {
                console.log("error");
            }
        });
    };
    return GmailAuthorizer;
}());
exports.GmailAuthorizer = GmailAuthorizer;
module.exports = GmailAuthorizer;
