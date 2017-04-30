/**
 * Gmail
 */

export class Gmail {

    readonly id: string;
    readonly date: string;
    readonly sender: string;
    readonly subject: string;
    readonly snippet: string;
    readonly contentHtml: string;

    constructor(id: string, date: string, sender: string, subject: string, snippet: string, contentHtml: string) {
        this.id = id;
        this.date = date;
        this.sender = sender;
        this.subject = subject;
        this.snippet = snippet;
        this.contentHtml = contentHtml;
    }

}

module.exports = Gmail;
