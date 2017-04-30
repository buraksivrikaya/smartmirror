"use strict";
/**
 * GmailService
 */
exports.__esModule = true;
var Gmail_1 = require("./Gmail");
var Promise = require("promise");
var googleapis = require("googleapis");
var Base64 = require('js-base64').Base64;
var GmailService = (function () {
    function GmailService(user) {
        this.auth = user.gmailAuth;
        this.gmailApi = googleapis.gmail({
            auth: this.auth,
            version: "v1"
        });
    }
    GmailService.prototype.readMail = function (count) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.readMailId(count).then(function (result) {
                var mails = [];
                for (var i = 0; i < result.length; i++) {
                    that.readMailById(result[i]).then(function (mailResult) {
                        mails.push(mailResult);
                        if (mails.length === result.length) {
                            resolve(mails);
                        }
                    })["catch"](function (error) {
                        reject(error);
                    });
                }
            })["catch"](function (error) {
                reject(error);
            });
        });
    };
    GmailService.prototype.readMailId = function (count) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.gmailApi.users.messages.list({
                userId: "me",
                maxResults: count
            }, function (error, result) {
                if (!error) {
                    var ids = [];
                    for (var i = 0; i < result.messages.length; i++) {
                        ids.push(result.messages[i]["id"]);
                    }
                    resolve(ids);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    GmailService.prototype.readMailById = function (id) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.gmailApi.users.messages.get({
                userId: "me",
                "id": id
            }, function (error, result) {
                if (!error) {
                    resolve(new Gmail_1.Gmail(id, result.payload.headers[15].value, result.payload.headers[10].value, result.payload.headers[12].value, result["snippet"], Base64.decode(result.payload.parts[1]["body"]["data"])));
                }
                else {
                    reject(error);
                }
            });
        });
    };
    return GmailService;
}());
exports.GmailService = GmailService;
module.exports = GmailService;
