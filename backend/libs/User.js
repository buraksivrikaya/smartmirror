"use strict";
/**
 * User
 */
exports.__esModule = true;
var fs = require("fs");
var googleapis = require("googleapis");
var Oauth2 = googleapis.auth.OAuth2;
var User = (function () {
    function User(id, name) {
        this.id = id;
        this.name = name;
    }
    User.prototype.setGmailAuth = function (auth) {
        this.gmailAuth = auth;
    };
    User.prototype.saveTo = function (uri) {
        fs.writeFileSync(uri, JSON.stringify(this));
    };
    User.loadFrom = function (uri) {
        var file = fs.readFileSync(uri);
        var json = JSON.parse(file);
        var user = new User(json["id"], json["name"]);
        if ("gmailAuth" in json) {
            var auth = new Oauth2(json["gmailAuth"]["clientId_"], json["gmailAuth"]["clientSecret_"], json["gmailAuth"]["redirectUri_"]);
            auth.setCredentials(json["gmailAuth"]["credentials"]);
            user.setGmailAuth(auth);
        }
        return user;
    };
    return User;
}());
exports.User = User;
