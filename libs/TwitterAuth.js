"use strict";
/**
 * TwitterAuth
 */
exports.__esModule = true;
var TwitterAuth = (function () {
    function TwitterAuth(consumerKey, consumerSecret, accessToken, accessTokenSecret) {
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
    }
    return TwitterAuth;
}());
exports.TwitterAuth = TwitterAuth;
module.exports = TwitterAuth;
