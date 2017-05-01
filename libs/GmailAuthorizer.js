"use strict";
/**
 * GmailAuthorizer
 */
exports.__esModule = true;
var googleapis = require("googleapis");
var Oauth2 = googleapis.auth.OAuth2;
var express = require("express");
var Promise = require("promise");
var GmailAuthorizer = (function () {
    function GmailAuthorizer(clientId, clientSecret, redirectUrl, scopes) {
        this.gmailAuth = new Oauth2(clientId, clientSecret, redirectUrl);
        this.scopes = scopes;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.reditectUrl = redirectUrl;
        this.server = express();
    }
    GmailAuthorizer.prototype.listenForRequest = function (url, port, callback) {
        var that = this;
        this.server.get(url, function (request, response) {
            response.redirect(that.generateAuthUri());
        });
        this.server.get(this.reditectUrl.substr(this.reditectUrl.lastIndexOf("/")), function (request, response) {
            var auth = new Oauth2(that.clientId, that.clientSecret, that.reditectUrl);
            GmailAuthorizer.authorize(auth, request.query.code).then(function (auth) {
                callback(auth);
                response.send("Done authorization");
            });
        });
        this.server.listen(port);
    };
    GmailAuthorizer.prototype.generateAuthUri = function () {
        return this.gmailAuth.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes
        });
    };
    GmailAuthorizer.authorize = function (auth, code) {
        return new Promise(function (resolve, reject) {
            auth.getToken(code, function (error, tokens) {
                if (!error) {
                    auth.setCredentials(tokens);
                    resolve(auth);
                }
                else {
                    console.log("error");
                    reject(error);
                }
            });
        });
    };
    return GmailAuthorizer;
}());
exports.GmailAuthorizer = GmailAuthorizer;
module.exports = GmailAuthorizer;
