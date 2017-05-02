// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const url = require("url");

// // Keep a global reference of the window object, if you don"t, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let win;

// function createWindow() {
//     // Create the browser window.
//     win = new BrowserWindow();
//     win.setFullScreen(true);
//     // and load the index.html of the app.
//     win.loadURL(url.format({
//         pathname: path.join(__dirname, "html/gui.html"),
//         protocol: "file:",
//         slashes: true
//     }));

//     // Open the DevTools.
//     //win.webContents.openDevTools();

//     // Emitted when the window is closed.
//     win.on("closed", () => {
//         // Dereference the window object, usually you would store windows
//         // in an array if your app supports multi windows, this is the time
//         // when you should delete the corresponding element.
//         win = null

//     });
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

// // Quit when all windows are closed.
// app.on("window-all-closed", () => {
//     // On macOS it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== "darwin") {
//         app.quit()
//     }
// });

// app.on("activate", () => {
//     // On macOS it"s common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (win === null) {
//         createWindow()
//     }
// });

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

/******************************************************************
*                                                                 *
*                     LOCALHOST OPERATIONS                        *
*                                                                 *
*****************************************************************/

const Authorizer = require("./libs/Authorizer.js");
const fs = require("fs");
const User = require("./libs/User.js");
const GmailAuthConfig = require("./libs/GmailAuthConfig.js");
const TwitterAuthConfig = require("./libs/TwitterAuthConfig.js");

let gconfig = JSON.parse(fs.readFileSync("data/gconfig.json"));

let gauthConfig = new GmailAuthConfig(
    gconfig["clientId"],
    gconfig["clientSecret"],
    gconfig["redirectUrl"],
    gconfig["scopes"]
);

Authorizer.registerGmailAuthOn(gauthConfig, "/auth/gmail", function (auth) {
    // Now we have authorization
    let user = new User(2, "test");
    user.setGmailAuth(auth);
    // Save it for later usage...
    user.saveTo("data/test2GMAIL.json");
});

let tconfig = JSON.parse(fs.readFileSync("data/tconfig.json"));

let tauthConfig = new TwitterAuthConfig(
    tconfig["consumerKey"],
    tconfig["consumerSecret"],
    tconfig["redirectUrl"]
);

Authorizer.registerTwitterAuthOn(tauthConfig, "/auth/twitter", function (auth) {
    // Now we have authorization
    let user = new User(2, "test");
    user.setTwitterAuth(auth);
    // Save it for later usage...
    user.saveTo("data/test2TWITTER.json");
});

Authorizer.listenOn(3000);

// const Twit = require("twit");
// const OAuth = require("oauth").OAuth;
// const express = require("express");

// const cookieSession = require('cookie-session');

// let app = express();

// let oa = new OAuth(
//     "https://api.twitter.com/oauth/request_token",
//     "https://api.twitter.com/oauth/access_token",
//     "UNOR91Uq5moU5GC6TIjsfGKph",
//     "ZPkkrzL3TG23lGrVum26tmJXZDAnrwXnZzqQpSOjBfdPj8LZ4n",
//     "1.0",
//     "http://localhost:3000/twittercb",
//     "HMAC-SHA1"
// );

// let oauth_token;
// let oauth_access_token_secret;

// let that = this;

// app.get("/auth/twitter", function (req, res) {
//     oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
//         if (!error) {
//             that.oauth_token = oauth_token;
//             that.oauth_token_secret = oauth_token_secret;
//             //console.log(oauth_token_secret);
//             res.redirect("https://twitter.com/oauth/authenticate?oauth_token=" + oauth_token);
//         }
//     });
// });

// this.foo = function foo(accessToken, accessTokenSecret) {
//     console.log(accessToken, accessTokenSecret);
//     var T = new Twit({
//         consumer_key: 'UNOR91Uq5moU5GC6TIjsfGKph',
//         consumer_secret: 'ZPkkrzL3TG23lGrVum26tmJXZDAnrwXnZzqQpSOjBfdPj8LZ4n',
//         access_token: accessToken,
//         access_token_secret: accessTokenSecret
//         //timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
//     });

//     T.get('statuses/home_timeline', {count: 10 }, function (err, data, response) {
//         //console.log(data);
//         //console.log(response);
//     })

// }

// app.get('/twittercb', function (req, res, next) {

//     //console.log(req.query);

//     oa.getOAuthAccessToken(req.query.oauth_token, that.oauth_access_token_secret, req.query.oauth_verifier,
//         function (error, oauth_access_token, oauth_access_token_secret, results) {
//             if (!error) {
//                 that.foo(oauth_access_token, oauth_access_token_secret);
//             }
//         });

// });


// app.listen(3000);