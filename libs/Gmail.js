"use strict";
/**
 * Gmail
 */
exports.__esModule = true;
var Gmail = (function () {
    function Gmail(id, date, sender, subject, snippet, contentHtml) {
        this.id = id;
        this.date = date;
        this.sender = sender;
        this.subject = subject;
        this.snippet = snippet;
        this.contentHtml = contentHtml;
    }
    return Gmail;
}());
exports.Gmail = Gmail;
