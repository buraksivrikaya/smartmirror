/*const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, "html/index.html"),
    protocol: "file:",
    slashes: true
  }));

  // Open the DevTools.
  win.webContents.openDevTools();

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
// code. You can also put them in separate files and require them here.*/

/******************************************************************
*                                                                 *
*                     LOCALHOST OPERATIONS                        *
*                                                                 *
*****************************************************************/

const express = require("express");
const google = require("googleapis");

var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
  "76077925517-8fhrcebbtmthkssssmb7u5l4jgmr78pg.apps.googleusercontent.com",
  "JYsqVAFo8-9HNFASG7pMt6lQ",
  "http://localhost:3000/oauthcallback"
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  "https://www.googleapis.com/auth/gmail.readonly"
];

var redirectUrl = oauth2Client.generateAuthUrl({
  // "online" (default) or "offline" (gets refresh_token)
  access_type: "offline",

  // If you only need one scope you can pass it as a string
  scope: scopes,

  // Optional property that passes state parameters to redirect URI
  // state: { foo: "bar" }
});

var host = express();

host.get("/", function(req, res) {
  res.redirect(redirectUrl);
});

host.get("/oauthcallback", function(req, res) {
  code = req.query.code;
  oauth2Client.getToken(code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens);
    }

    console.log(oauth2Client);
  });
});

host.listen(3000);
