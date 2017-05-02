"use strict";
/**
 * GmailAuthConfig
 */
exports.__esModule = true;
var GmailAuthConfig = (function () {
    function GmailAuthConfig(clientId, clientSecret, redirectUrl, scopes) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
        this.scopes = scopes;
    }
    return GmailAuthConfig;
}());
exports.GmailAuthConfig = GmailAuthConfig;
module.exports = GmailAuthConfig;
