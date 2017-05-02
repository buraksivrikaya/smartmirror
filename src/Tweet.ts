/**
 * Tweet
 */

export class Tweet {

    readonly date: string;
    readonly sender: string;
    readonly text: string;

    constructor(date: string, sender: string, text: string) {
        this.date = date;
        this.sender = sender;
        this.text = text;
    }

}

module.exports = Tweet;
