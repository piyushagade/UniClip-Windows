'use strict';

const debug = false;

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const Menu = electron.Menu;
const Tray = electron.Tray;
const globalShortcut = electron.globalShortcut;
var ipcMain = require('electron').ipcMain;
var ipcRenderer = require('electron').ipcRenderer;  

const clipboard = require('electron').clipboard;
const fb_module = require("firebase");
const fb = new Firebase("https://uniclip.firebaseio.com/cloudboard/");  
var fb_user;
var fb_data;
var r_data;
var remote = require('electron').remote;


var authenticated = false;
var user_email;
var device_name;
var access_pin;
var qr_string

var winHidden = false;
var appIcon = null;
app.on('ready', function(){
  appIcon = new Tray(__dirname + '/img/ic_launcher.png');
  var contextMenu = Menu.buildFromTemplate([
    //{ label: 'Show UniClip!',
    //click: function() {
    //      createWindow ();
        
    //}},
    //{ label: 'Notifications', type: 'checkbox', checked: true  },
    //{ label: 'Autostart', type: 'checkbox', checked: true },
    { label: 'Quit',
      selector: 'terminate:',
    click: function() {
          app.quit();
      }}
  ]);
  
  appIcon.on('click', function handleClick () {
    if(winHidden){
     createWindow ();
     winHidden=false;
  }
  else{
     mainWindow.hide();
     winHidden=true;
  }
  });
  appIcon.setToolTip('UniClip!');
  appIcon.setContextMenu(contextMenu);
});

let mainWindow;



// Create window
function createWindow () {
var var_width = 0;
if(debug) var_width = var_width + 600;
var width = 400+var_width;

  mainWindow = new BrowserWindow({width: width, height: 500, frame: false, 'titleBarStyle': 'hidden', resizable: false, alwaysOnTop: true, fullscreenable: false, skipTaskbar: false, kiosk: false, title: 'UniClip!', icon : 'img/ic_launcher.png'});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  if(debug) mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    //app.quit();
  }
  winHidden = true;
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

//Shortkeys and CLipboard management
app.on('ready', function() {
  var r_data = "";

  var ret_accept = globalShortcut.register('ctrl+shift+c', function() {
    var data = clipboard.readText('text');
    if(authenticated) {

      var fb_user = fb.child(user_email);
      fb_user.update({'data': data});
    }
  });

  
  var ret_send = globalShortcut.register('ctrl+shift+v', function() {
    if(authenticated) {
       //Cloudboard Listener  
      fb_data.on("value", function(snapshot) {
          r_data = snapshot.val();
          console.log(r_data);

        }, function (errorObject) {
      });

      clipboard.writeText(r_data);  
    }
    
  });

  var ret_btf = globalShortcut.register('ctrl+shift+u', function() {
    if(winHidden) {
     createWindow ();
     winHidden=false;
    }else{
      if(mainWindow != null) mainWindow.hide();
      winHidden=true;
    }
  });
  
  var ret_quit = globalShortcut.register('ctrl+shift+q', function() {
    app.quit();
    
  });

  if (!ret_accept) {
    console.log('registration failed');
  }
});

//On intention to quit
app.on('will-quit', function() {
  // Unregister a shortcut.
  globalShortcut.unregister('ctrl+shift+c');
  globalShortcut.unregister('ctrl+shift+v');
  globalShortcut.unregister('ctrl+shift+u');
  globalShortcut.unregister('ctrl+shift+q');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});



//IPC
global.sharedObj = {user_email: null, device_name: null, access_pin: null};
global.authentication_status = {authenticated: null, auth_user_email: null};

ipcMain.on('validate', function(event) {
  user_email = global.sharedObj.user_email;
  device_name = global.sharedObj.device_name;
  access_pin = global.sharedObj.access_pin;


  fb_user = fb.child(user_email);
  fb_data = fb_user.child("data");
  
  var fb_pin;
  var snapshot;

  //Check if username exists
  var this_user = fb.child(user_email);
  var key_node = this_user.child('key');
  
  key_node.on("value", function(snapshot) {
    fb_pin = snapshot.val();
      if(fb_pin!==("")){
        event.sender.send('validate', 2); //authenticated
        console.log('Verified');
      onVerified();
      }
      else if(!(fb_pin===(access_pin))) {
        event.sender.send('validate', 1); //wrong pin
        console.log('Not Authorized');
      }
  
  });
  

});

function onVerified() {
  authenticated = true;
  console.log("Device verified: "+device_name);

  //Desktop removes from devices after application closes
  var fb_user = fb.child(user_email);
  var fb_data = fb_user.child("data");
  var fb_devices = fb_user.child("devices");
  var fb_device = fb_devices.child(device_name);

  fb_device.onDisconnect().remove();
}




ipcMain.on('auth_status', function(event) {
  console.log('Auth status requested.');

  if (authenticated){
    event.sender.send('auth_status', 2);  // already authenticated
      console.log('Already authenticated.');
  } 
  else{
    event.sender.send('auth_status', 1);  // authentication required
      console.log('Not authenticated.');
  }
});