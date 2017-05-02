const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow();
    win.setFullScreen(true);
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "html/gui.html"),
        protocol: "file:",
        slashes: true
    }));

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null

    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit()
    }
});

app.on("activate", () => {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

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
const Twit = require("twit");
const TwitterService = require("./libs/TwitterService.js");

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

// let user = User.loadFrom("data/test2TWITTER.json");
// let ts = new TwitterService(user);

// ts.readTweet(2).then(function (tweets) {
//     console.log(tweets[0]);
//     console.log(tweets[1]);
// });