"use strict";
/**
 * Authorizer
 */
exports.__esModule = true;
var TwitterAuth = require("./TwitterAuth.js");
var googleapis = require("googleapis");
var Oauth2 = googleapis.auth.OAuth2;
var express = require("express");
var cookieParser = require("cookie-parser");
var Promise = require("promise");
var OAuth = require("oauth").OAuth;
var Authorizer = (function () {
    function Authorizer() {
    }
    Authorizer.registerGmailAuthOn = function (authConfig, url, callback) {
        this.gmailConfig = authConfig;
        this.gmailUrl = url;
        this.gmailCallback = callback;
    };
    Authorizer.registerTwitterAuthOn = function (authConfig, url, callback) {
        this.twitterConfig = authConfig;
        this.twitterUrl = url;
        this.twitterCallback = callback;
    };
    Authorizer.listenOn = function (port) {
        this.server.use(cookieParser());
        if (this.gmailConfig && this.gmailUrl && this.gmailCallback) {
            this.server.get(Authorizer.gmailUrl, function (request, response) {
                response.redirect(Authorizer.generateGmailAuthUri());
            });
            var redirectUrl = Authorizer.gmailConfig.redirectUrl;
            redirectUrl = redirectUrl.substr(redirectUrl.lastIndexOf("/"));
            this.server.get(redirectUrl, function (request, response) {
                var auth = Authorizer.getGmailAuth();
                Authorizer.authorizeGmail(auth, request.query.code).then(function (auth) {
                    Authorizer.gmailCallback(auth, request);
                    // response.send("Done authorization");
                    response.redirect("http://localhost:8000/");
                });
            });
        }
        if (this.twitterConfig && this.twitterUrl && this.twitterCallback) {
            var otoken_1;
            var otokenSecret_1;
            var auth_1;
            this.server.get(Authorizer.twitterUrl, function (request, response) {
                auth_1 = Authorizer.getTwitterAuth();
                auth_1.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
                    if (!error) {
                        otoken_1 = oauth_token;
                        otokenSecret_1 = oauth_token_secret;
                        response.redirect("https://twitter.com/oauth/authenticate?oauth_token=" + oauth_token);
                    }
                });
            });
            var redirectUrl = Authorizer.twitterConfig.redirectUrl;
            redirectUrl = redirectUrl.substr(redirectUrl.lastIndexOf("/"));
            this.server.get(redirectUrl, function (request, response) {
                Authorizer.authorizeTwitter(auth_1, request.query.oauth_token, otokenSecret_1, request.query.oauth_verifier).then(function (auth) {
                    Authorizer.twitterCallback(auth, request);
                    // response.send("Done authorization");
                    response.redirect("http://localhost:8000/");
                });
            });
        }
        this.server.listen(port);
    };
    Authorizer.getGmailAuth = function () {
        return new Oauth2(this.gmailConfig.clientId, this.gmailConfig.clientSecret, this.gmailConfig.redirectUrl);
    };
    Authorizer.generateGmailAuthUri = function () {
        return this.getGmailAuth().generateAuthUrl({
            access_type: "offline",
            scope: this.gmailConfig.scopes
        });
    };
    Authorizer.authorizeGmail = function (auth, code) {
        return new Promise(function (resolve, reject) {
            auth.getToken(code, function (error, tokens) {
                if (!error) {
                    auth.setCredentials(tokens);
                    resolve(auth);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    Authorizer.getTwitterAuth = function () {
        return new OAuth("https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", this.twitterConfig.consumerKey, this.twitterConfig.consumerSecret, "1.0", this.twitterConfig.redirectUrl, "HMAC-SHA1");
    };
    Authorizer.authorizeTwitter = function (auth, otoken, oaccessTokenSecret, overifier) {
        return new Promise(function (resolve, reject) {
            auth.getOAuthAccessToken(otoken, oaccessTokenSecret, overifier, function (error, oauth_access_token, oauth_access_token_secret, results) {
                if (!error) {
                    resolve(new TwitterAuth(Authorizer.twitterConfig.consumerKey, Authorizer.twitterConfig.consumerSecret, oauth_access_token, oauth_access_token_secret));
                }
                else {
                    reject(error);
                }
            });
        });
    };
    return Authorizer;
}());
Authorizer.server = express();
exports.Authorizer = Authorizer;
module.exports = Authorizer;
