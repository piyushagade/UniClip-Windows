
$(document).ready(function(){


$('#ui_waiting').fadeOut(0);
$('#qrcode').fadeOut(0);
$('#ui_popup').fadeOut(0);
$('#ui_login').fadeOut(0);
$('#ui_logged_out').fadeOut(0);
$('#update_button').fadeOut(0);
$('#sync').fadeOut(0);


$('#ui_waiting').fadeIn(200);

setTimeout(function() {		
	$('#ui_waiting').fadeOut(100);
	$('#ui_waiting').addClass('hidden');
	$('#qrcode').fadeIn(2000);
}, 3000);



});

var isAuthorized = false;

var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 160,
	height : 160
});


function onNotAuthorized(){
	isAuthorized = false;
	
	setTimeout(function() {		
		qrcode.makeCode(makeid());
	}, 0);

	setTimeout(function() {	
		$('#ui_login').fadeIn(600);
	}, 3000);
}
	
function onAuthorized(){
  
	
	isAuthorized = true;
	showPopup("Authentication succeeded.");
	$('#ui_login').fadeOut(0);
	
	setTimeout(function() {		
		$('#ui_login').fadeOut(0);
		$('#ui_login').addClass('hidden');
		isAuthorized = true;
	}, 1880);
	
	
	setTimeout(function() {	
		$('#ui_running').removeClass('hidden');
		$('#ui_running').fadeOut(0);
		$('#ui_running').fadeIn(600);
		$('#sync').fadeIn(600);
	}, 2600);
}

function showPopup(mess){
	$('#ui_popup').fadeIn(800);
	$('#popup_content').text(mess
	);
	
	setTimeout(function() {		
		$('#ui_popup').fadeOut(800);
	}, 1600);
	
	setTimeout(function() {		
		$('#popup_content').text("");
	}, 1800);
	
}

function makeid()
{
    var text = "";
	var user_email = "unknown";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 18; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	//Start session, listen for mobile connection
	const fb_module = require("firebase");
	const fb_desktops = new Firebase("https://uniclip.firebaseio.com/desktops/");	

	var fb_desktop = fb_desktops.child(text);
	fb_desktop.set("notset");
	
	//Send device Id
	setTimeout(function() {	
	
	var remote = require('electron').remote;
    remote.getGlobal('deviceName').device_name = text;
	
    var ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.send('sendDeviceName');
	 

	
	}, 200);
	
	//Manage Presence
	var presenceDesktopRef = new Firebase("https://uniclip.firebaseio.com/desktops/" + text);
	presenceDesktopRef.onDisconnect().remove();
	
	//On mobile connect listener
	fb_desktop.on("value", function(snapshot) {
  		user_email = snapshot.val();
		
		if(user_email !== "notset"){
		//Device connected
		
		//Add device to device list and make it online
		const fb_cloudboard = new Firebase("https://uniclip.firebaseio.com/cloudboard/");	
		fb_cloudboard.child(user_email).child("devices").child(text).set(2);



			// Send IPC
	 	var remote = require('electron').remote;
		remote.getGlobal('sharedObj').user_email = user_email; 
		remote.getGlobal('sharedObj').device_name = text; 
		remote.getGlobal('sharedObj').access_pin = ""; 

		var ipcRenderer = require('electron').ipcRenderer;   
    	ipcRenderer.send('validate');
	 
		ipcRenderer.on('validate', function(event, arg) {
		if(arg==2){
			 onAuthorized();
				 
			 fb_desktop.remove();
		 }	
		});
			
		}
		
		}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});
	
	return text;
}




function validate() {
    var remote = require('electron').remote;
	
	remote.getGlobal('sharedObj').user_email = $('#user_email').val(); 
	remote.getGlobal('sharedObj').device_name = $('#device_name').val(); 
	remote.getGlobal('sharedObj').access_pin = $('#access_pin').val(); 

    var ipcRenderer = require('electron').ipcRenderer;   
	 
	if($('#user_email').val() != "" || 
	$('#device_name').val() != "" || 
	$('#access_pin').val() != "")
    	ipcRenderer.send('validate');
	 
	ipcRenderer.on('validate', function(event, arg) {
		 if(arg==2){
			 $('#ui_login').addClass('hidden');
			 $('#ui_settings').removeClass('hidden');
		 }
	});
	
}


function hideAll(){
	$('#ui_login').fadeOut(400);
	$('#ui_running').fadeOut(400);
	$('#ui_howtoscan').fadeOut(400);
	$('#ui_globalkeyshortcuts').fadeOut(400);
	$('#ui_help').fadeOut(400);
	$('#ui_logged_out').fadeOut(400);
	$('#ui_preferences').fadeOut(400);
	$('#ui_about').fadeOut(400);
	$('#ui_android').fadeOut(400);
}





$('#b_howtoscan').click(function (e) {
	hideAll();
	
	setTimeout(function() {	
		$('#ui_howtoscan').fadeIn(400);
	}, 400);
});

$('#b_close_howtoscan').click(function (e) {
	hideAll();
	
	setTimeout(function() {	
		$('#ui_login').fadeIn(400);
	}, 400);
});


var from = 0;
$('#b_globalkeyshortcuts_from_howtoscan').click(function (e) {
	hideAll();
	
	setTimeout(function() {	
		$('#ui_globalkeyshortcuts').fadeIn(400);
	}, 400);
	
	from = 1;
});

$('#b_globalkeyshortcuts_from_running').click(function (e) {
	hideAll();
	
	setTimeout(function() {	
		$('#ui_globalkeyshortcuts').fadeIn(400);
	}, 400);
	
	from = 2;
});


$('#b_globalkeyshortcuts_from_help').click(function (e) {
	hideAll();
	
	setTimeout(function() {	
		$('#ui_globalkeyshortcuts').fadeIn(400);
	}, 400);
	
	from = 3;
});

$('#b_close_globalkeyshortcuts').click(function (e) {
	hideAll();
	
	setTimeout(function() {	
		if(from === 1) {$('#ui_login').fadeIn(400);}
		if(from === 2) {$('#ui_running').fadeIn(400);}
		if(from === 3) {$('#ui_help').fadeIn(400);}
	}, 400);
});

$('#b_unregister').click(function (e) {
	hideAll();
	isAuthenticated = false;
	
	setTimeout(function() {	
		$('#ui_login').fadeIn(400);
	}, 400);
});



$('#b_help').click(function (e) {
	hideAll();
	
	setTimeout(function() {	
		$('#ui_help').fadeIn(400);
	}, 400);
});



$('#b_close_help').click(function (e) {
	hideAll();
	setTimeout(function() {	
		$('#ui_running').fadeIn(400);
	}, 400);
});



$('#b_preferences').click(function (e) {
	hideAll();
	getPref();
	
	setTimeout(function() {	
		$('#ui_preferences').fadeIn(400);
	}, 400);
});



$('#b_close_preferences').click(function (e) {
	hideAll();
	setTimeout(function() {	
		$('#ui_running').fadeIn(400);
	}, 400);
});



$('#b_about').click(function (e) {
	hideAll();
	getPref();
	
	setTimeout(function() {	
		$('#ui_about').fadeIn(400);
	}, 400);
});



$('#b_close_about').click(function (e) {
	hideAll();
	setTimeout(function() {	
		$('#ui_running').fadeIn(400);
	}, 400);
});



$('#b_android').click(function (e) {
	hideAll();
	getPref();
	
	setTimeout(function() {	
		$('#ui_android').fadeIn(400);
	}, 400);
});



$('#b_close_android').click(function (e) {
	hideAll();
	setTimeout(function() {	
		$('#ui_login').fadeIn(400);
	}, 400);
});



$('#b_unregister').click(function (e) {
	logout();
	$('#sync').fadeOut(600);
});

function logout(){
	setTimeout(function() {	
     var ipcRenderer = require('electron').ipcRenderer;
	 ipcRenderer.send('logout');
	 
	 // Send IPC
	 var remote = require('electron').remote;

	 hideAll();
	 ipcRenderer.on('logout', function(event, arg) {
		$('#ui_logged_out').fadeIn(400);
	 });
	
	}, 800);
	
	
}






//Get preference on initialize
getPref();

function getPref(){
	
	var ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.send('getPreferences');
	
	ipcRenderer.on('getPreferences', function(event, arg) {
		if(arg!=null) {
			if(arg[0] === true)	$('#autostart').attr('checked', true);
			else $('#autostart').attr('checked', false);
			
			if(arg[1] === true)$('#minimized').attr('checked', true);
			else $('#minimized').attr('checked', false);
			
			if(arg[2] === true)$('#notifications').attr('checked', true);
			else $('#notifications').attr('checked', false);
		}
	 });

}

//On preference change
function onPrefChange(){
	var auto;
	var mini;
	var noti;
	
	if($('#autostart').is(':checked')) auto = true;
	else auto = false;
	
	if($('#minimized').is(':checked')) mini = true;
	else mini = false;
	
	if($('#notifications').is(':checked')) noti = true;
	else noti = false;
	
	var remote = require('electron').remote;
    remote.getGlobal('prefObj').autostart = auto;
	remote.getGlobal('prefObj').minimized = mini;	
	remote.getGlobal('prefObj').notifications = noti;	
	
	var ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.send('setPreferences');
	
	ipcRenderer.on('setPreferences', function(event, arg) {
		if(arg==1) showPopup('Preferences updated');
	 });

}

function window_close(){
	
	setTimeout(function() {	
     var ipcRenderer = require('electron').ipcRenderer;
	 ipcRenderer.send('closeWindow');
	 
	 // Send IPC
	 var remote = require('electron').remote;

	 hideAll();
	 ipcRenderer.on('closeWindow', function(event, arg) {
	 });
	
	 window.top.close();
	}, 800);
}



