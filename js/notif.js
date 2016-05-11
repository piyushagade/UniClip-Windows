var version = '1.1';

var update_available = false;

$(window).load(function(){
	

	var fb_update = new Firebase("https://uniclip.firebaseio.com/latest_version");
	var fb = new Firebase("https://uniclip.firebaseio.com/cloudboard/");
	var fb_user = fb.child("piyushagade@gmailcom");
	var fb_data = fb_user.child("data");
	var fb_devices = fb_user.child("devices");
	

var path = require('path');
var options = [
  {
    title: "New clip available",
    body: "Press Ctrl + Shift + V to copy to your clipboard."
  },
  {
    title: " update available",
    body: "Open update page in UniClip desktop app.",
    icon: path.join(__dirname+'/img/', 'ic_launcher.png')
  },
  {
    title: "UniClip running in background",
    body: "Press Ctrl + Shift + U to show UniClip.",
    icon: path.join(__dirname+'/img/', 'ic_launcher.png')
  }
]

//Notify if Update available
fb_update.on("value", function(snapshot) {
  		var data = snapshot.val();
		if(parseFloat(data)>parseFloat(version)) {
			//Update Available
			update_available = true;
			doUpdateNotify(data);
			
			showUpdateButton(data);
		}
		
		}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
		
});




function doNotify() {
    new Notification(options[0].title, options[0]);
}

function doUpdateNotify(ver) {
        new Notification("Version " + ver + options[1].title, options[1]);
}

function doMinimizedNotify() {
	alert();
        new Notification(options[2].title, options[2]);
}

function showUpdateButton(ver){
	$("#update_button").fadeIn(200);
	$("#update_button").text(ver + " version is here.");
}




var prev_clip = '';

fb_data.on("value", function(snapshot) {
  		var data = snapshot.val();
		
		$("#latest_clip").text(data);
		if(isAuthorized) {
			//doNotify();
		}
			
		
		}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
		
	});
	
	



//	var remote = require('remote');     
//    var window = remote.getCurrentWindow();
//    window.hide();

});


var path = require('path');
var options = [
  {
    title: "New clip available",
    body: "Press Ctrl + Shift + V to copy to your clipboard."
  },
  {
    title: " update available",
    body: "Open update page in UniClip desktop app.",
    icon: path.join(__dirname+'/img/', 'ic_launcher.png')
  },
  {
    title: "UniClip running in background",
    body: "Press Ctrl + Shift + U to show UniClip.",
    icon: path.join(__dirname+'/img/', 'ic_launcher.png')
  }
]

//Notify if Update available
fb_update.on("value", function(snapshot) {
  		var data = snapshot.val();
		if(parseFloat(data)>parseFloat(version)) {
			//Update Available
			update_available = true;
			doUpdateNotify(data);
			
			showUpdateButton(data);
		}
		
		}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
		
});




function doNotify() {
    new Notification(options[0].title, options[0]);
}

function doUpdateNotify(ver) {
        new Notification("Version " + ver + options[1].title, options[1]);
}

function doMinimizedNotify() {
	alert();
        new Notification(options[2].title, options[2]);
}
