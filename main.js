'use strict';

const debug = false;
const verbose = false;

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const storage = require('electron-json-storage');

const Menu = electron.Menu;
const Tray = electron.Tray;
const globalShortcut = electron.globalShortcut;
var ipcMain = require('electron').ipcMain;
var ipcRenderer = require('electron').ipcRenderer;  



const clipboard = require('electron').clipboard;
const fb_module = require("firebase");
const fb = new Firebase("https://uniclip.firebaseio.com/cloudboard/");
const fb_desktops = new Firebase("https://uniclip.firebaseio.com/desktops/");

var fb_user;
var fb_data;
var r_data;
var remote = require('electron').remote;


var authenticated = false;
var user_email;
var device_name;
var access_pin;
var autostart;
var notifications;
var minimized;

var r_data;

var notificationsEnabled;
var serviceEnabled;

var winHidden = false;
var appIcon = null;

app.on('ready', function(){
  appIcon = new Tray(__dirname + '/img/ic_launcher.png');
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Quit',
      selector: 'terminate:',
    click: function() {
          app.quit();
      }}
  ]);


/* Single Instance Check */
var iShouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
    }
    if (winHidden) {
       createWindow();
    }
    return true;
});

if(iShouldQuit){
  app.quit();
  return;
}

  
appIcon.on('click', function handleClick () {
  if(winHidden){
     createWindow();
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
var width = 500 + var_width;

  mainWindow = new BrowserWindow({width: width, height: 600, frame: false, 'titleBarStyle': 'hidden', resizable: false, alwaysOnTop: false, fullscreenable: false, skipTaskbar: false, kiosk: false, title: 'UniClip!', icon : 'img/ic_launcher.png', movable: true});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  if(debug) mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}
// app.on('ready', createWindow);

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

//Shortkeys and Clipboard management
app.on('ready', function() {

  var ret_accept = globalShortcut.register('ctrl+shift+c', function() {
    var data = clipboard.readText('text');
    if(authenticated && serviceEnabled) {

      var fb_user = fb.child(user_email);
      fb_user.update({'data': data});
    }
  });

  
  var ret_send = globalShortcut.register('ctrl+shift+v', function() {
    if(authenticated && serviceEnabled) {
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

    //Delete device from desktops
    var fb_delete = fb_desktops.child(device_name);
    fb_delete.remove();

    }


  });
  
  var ret_quit = globalShortcut.register('ctrl+shift+q', function() {
    app.quit();
    
  });

  if (!ret_accept) {
    console.log('Keyboard shortcuts registration failed. The combinations might be already registerd by some other app.');
  }
});


//Behave according to preferences
app.on('ready', function() {
  //get preferences
  storage.get('pref', function(error, data) {
    //if first run
    if(data.autostart == null && data.minimized == null && data.notifications == null){
      //set default preferences
      storage.set('pref', { autostart: true, minimized: false, notifications: true }); 
    } 
    else{
      if(data.autostart == true){
          serviceEnabled = true;
      }
      else{
          serviceEnabled = false;
          notify('UniClip service is paused', 'Enable service in Preferences.');
      }



      if(data.notifications == true){
          notificationsEnabled = true;
      }
      else{
          notificationsEnabled = false;
      }

      if(data.minimized == true){
          if(mainWindow!=null) mainWindow.hide();
          winHidden = true;

          notify('Re-authorization needed', 'Hit Ctrl + Shift + U to open UniClip.');
      }
      else{
        createWindow();
        winHidden = false;
      }

    }
  });

});


// Notify
function notify(title, desc){
      if(notificationsEnabled){
        var path = require('path');
        var eNotify = require('electron-notify');

          //Config options
          eNotify.setConfig({
          appIcon: path.join(__dirname, 'img/ic_launcher.png'),
          displayTime: 6000,
          width: 400,
          height: 100,
          padding: 20,
          borderRadius: 0,
          displayTime: 6000,
          animationSteps: 5,
          animationStepMs: 5,
          animateInParallel: true,
          
          defaultStyleText: {
             fontSize: 16,
             lineHeight: '18px',
             color: 'rgba(255,255,255,0.9)'
          },

          defaultStyleAppIcon: {
          overflow: 'hidden',
          float: 'left',
          height: 74,
          width: 74,
          marginRight: 20,
          },

          defaultStyleContainer: {
          backgroundColor: '#009688',
          overflow: 'hidden',
          padding: 10,
          fontFamily: 'Arial',
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          position: 'relative',
          lineHeight: '14px'
          },


        });

        // Notify
        eNotify.notify({ title: title, text: desc });
      }
}


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



//Global Objects
global.sharedObj = {user_email: null, device_name: null, access_pin: null};
global.authentication_status = {authenticated: null};
global.prefObj = {autostart: null, minimized: null, notifications: null};
global.deviceName = {device_name: null};


var k=0;
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
        if(k==1 && verbose) console.log('authentication attempted twice.');
        
        if(k==0){
          event.sender.send('validate', 2); //authenticated
          if(verbose) console.log('Verified');
          onVerified();
        }
        k=1;
      }
      else if(!(fb_pin===(access_pin))) {
        event.sender.send('validate', 1); //wrong pin
        if(verbose) console.log('Not Authorized');
      }
  
  });
  

});

function onVerified() {
  authenticated = true;
  if(verbose) console.log("Device verified: "+device_name);

  //Persist device ID
  storage.set('auth', { deviceId: device_name, user_email: user_email }, function(error) {
      
  if (error)
     throw error;
  });  

  //Desktop removes from devices after application closes
  var fb_user = fb.child(user_email);
  var fb_data = fb_user.child("data");
  var fb_devices = fb_user.child("devices");
  var fb_device = fb_devices.child(device_name);

  fb_device.onDisconnect().remove();

  //Cloudboard Listener  
  fb_data.on("value", function(snapshot) {
        r_data = snapshot.val();

        if(verbose) console.log("Incoming data: "+r_data);
        if(serviceEnabled && clipboard.readText('text') !== r_data) notify('Incoming clip!', 'Press Ctrl + Shift + V to copy to your clipboard.');

        }, function (errorObject) {
  });

}




ipcMain.on('auth_status', function(event) {
  if(verbose) console.log('Auth status requested.');


      //Get device ID
      storage.get('auth', function(error, data) {
          
      
      });

        if (authenticated){
          event.sender.send('auth_status', 2);  // already authenticated from minimized
          if(verbose) console.log('Already authenticated.');

        } 
       else{
          event.sender.send('auth_status', 1);  // authentication required
          if(verbose) console.log('Not authenticated.');
        }
        
});


// Logout
ipcMain.on('logout', function(event) {

  if(verbose) console.log("Logged out");

  //Persist device ID
  storage.set('auth', { deviceId: '' }, function(error) {
  
  
  if (error)
     throw error;
  });  


  event.sender.send('logout', 1); 

  setTimeout(function() { 
    app.quit();
  }, 4000);

});


// Manage preferences
ipcMain.on('setPreferences', function(event) {

    autostart = global.prefObj.autostart;
    minimized = global.prefObj.minimized;
    notifications = global.prefObj.notifications;

    if(verbose) console.log("Preferences updated: "+autostart+", "+minimized+", "+notifications+".");

    //Enable service if appropiate
    if(autostart == true) serviceEnabled = true;
    else serviceEnabled = false;
    
    //Enable notifications if appropiate
    if(notifications == true) notificationsEnabled = true;
    else notificationsEnabled = false;

    //update preferences
    storage.set('pref', { autostart: autostart, minimized: minimized, notifications: notifications });  

    event.sender.send('setPreferences', 1);

});

//Renderer request for preferences
ipcMain.on('getPreferences', function(event) {

  if(verbose) console.log("Preferences requested.");


  //get preferences from storage
  storage.get('pref', function(error, data) {
    //if first run
    if(data.autostart == null && data.minimized == null && data.notifications == null){
      //set default preferences
      storage.set('pref', { autostart: true, minimized: false, notifications: true }); 

      event.sender.send('getPreferences', [true, false, true]); 

      if(verbose) console.log("Default preferences sent.");
    } 
    else{
      event.sender.send('getPreferences', [data.autostart, data.minimized, data.notifications]); 
      if(verbose) console.log("Preferences sent: "+data.autostart+", "+data.minimized+", "+data.notifications+".");
    }
  });


});

//Set device name on makeId()
ipcMain.on('sendDeviceName', function(event) {
  device_name = global.deviceName.device_name;

  if(verbose) console.log("device_name generated: "+device_name);
});

//Hide window from Renderer processes
ipcMain.on('closeWindow', function(event) {
  if(verbose) console.log("closeWindow op requested");
  winHidden = true;
});