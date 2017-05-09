/**
 * GmailService
 */


//import { Gmail } from "./Gmail";
const Gmail = require("./Gmail.js");
import { User } from "./User";
const Base64 = require("../node_modules/js-base64/base64.js");
const Promise = require("promise");
const googleapis = require("googleapis");

export class GmailService {

    readonly auth;
    readonly gmailApi;

    constructor(user: User) {
        this.auth = user.gmailAuth;
        this.gmailApi = googleapis.gmail({
            auth: this.auth,
            version: "v1"
        });
    }

    readMail(count: number): Promise<any[]> {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.readMailId(count).then(function (result) {
                let mails = [];
                for (let i = 0; i < result.length; i++) {
                    that.readMailById(result[i]).then(function (mailResult) {
                        mails.push(mailResult);
                        if(mails.length === result.length) {
                            resolve(mails);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    private readMailId(count: number): Promise<string[]> {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.gmailApi.users.messages.list({
                userId: "me",
                maxResults: count
            }, function (error, result) {
                if (!error) {
                    let ids = [];
                    for (let i = 0; i < result.messages.length; i++) {
                        ids.push(result.messages[i]["id"]);
                    }
                    resolve(ids);
                } else {
                    reject(error);
                }
            });
        });
    }


    readMailById(id: string): Promise<any> {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.gmailApi.users.messages.get({
                userId: "me",
                "id": id
            }, function (error, result) {
                if (!error) {
                    let date;
                    let from;
                    let subject;
                    for(let i=0; i < result.payload.headers.length; i++) {
                        if(result.payload.headers[i].name === "Date"){
                            date = result.payload.headers[i].value;
                        } else if(result.payload.headers[i].name === "From") {
                            from = result.payload.headers[i].value;
                        } else if(result.payload.headers[i].name === "Subject") {
                            subject = result.payload.headers[i].value;
                        }
                    }
                    resolve(new Gmail(
                        id,
                        date,
                        from,
                        subject,
                        result["snippet"],
                        Base64.decode(result.payload.parts[1]["body"]["data"])
                    ));
                } else {
                    reject(error);
                }
            });
        });
    }

}

module.exports = GmailService;
