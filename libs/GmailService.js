"use strict";
/**
 * GmailService
 */
exports.__esModule = true;
//import { Gmail } from "./Gmail";
var Gmail = require("./Gmail.js");
var Base64 = require("../node_modules/js-base64/base64.js");
var Promise = require("promise");
var googleapis = require("googleapis");
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
                    var date = void 0;
                    var from = void 0;
                    var subject = void 0;
                    for (var i = 0; i < result.payload.headers.length; i++) {
                        if (result.payload.headers[i].name === "Date") {
                            date = result.payload.headers[i].value;
                        }
                        else if (result.payload.headers[i].name === "From") {
                            from = result.payload.headers[i].value;
                        }
                        else if (result.payload.headers[i].name === "Subject") {
                            subject = result.payload.headers[i].value;
                        }
                    }
                    resolve(new Gmail(id, date, from, subject, result["snippet"], Base64.decode(result.payload.parts[1]["body"]["data"])));
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
