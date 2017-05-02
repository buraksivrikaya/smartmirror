"use strict";
/**
 * TwitterService
 */
exports.__esModule = true;
var Tweet = require("./Tweet.js");
var Twit = require("twit");
var Promise = require("promise");
var TwitterService = (function () {
    function TwitterService(user) {
        this.twit = new Twit({
            consumer_key: user.twitterAuth.consumerKey,
            consumer_secret: user.twitterAuth.consumerSecret,
            access_token: user.twitterAuth.accessToken,
            access_token_secret: user.twitterAuth.accessTokenSecret
        });
    }
    TwitterService.prototype.readTweet = function (count) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.twit.get("statuses/home_timeline", { count: count }, function (err, data, response) {
                if (!err) {
                    var tweets = [];
                    for (var i = 0; i < data.length; i++) {
                        tweets.push(new Tweet(data[i]["created_at"], data[i]["user"]["name"], data[i]["text"]));
                    }
                    resolve(tweets);
                }
                else {
                    reject(err);
                }
            });
        });
    };
    return TwitterService;
}());
module.exports = TwitterService;
