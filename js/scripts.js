
$(document).ready(function(){


$('#ui_waiting').fadeOut(0);
$('#qrcode').fadeOut(0);
$('#ui_popup').fadeOut(0);
$('#ui_login').fadeOut(0);
$('#update_button').fadeOut(0);


$('#ui_waiting').fadeIn(200);

setTimeout(function() {		
	$('#ui_waiting').fadeOut(100);
	$('#ui_waiting').addClass('hidden');
	$('#qrcode').fadeIn(2000);
}, 3000);



});

var isAuthorized = false;

var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 120,
	height : 120
});

		
setTimeout(function() {		
	qrcode.makeCode(makeid());
}, 0);


function onNotAuthorized(){
	isAuthorized = false;
	setTimeout(function() {	
	$('#ui_login').fadeIn(600);
}, 3000);

}
	
function onAuthorized(){
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
	if(!isAuthorized) fb_desktop.set("notset");
	
	//Manage Presence
	var presenceDesktopRef = new Firebase("https://uniclip.firebaseio.com/desktops/" + text);
	presenceDesktopRef.onDisconnect().remove();
	
	//On mobile connect listener
	fb_desktop.on("value", function(snapshot) {
  		user_email = snapshot.val();
		
	if(user_email != "notset"){
		//Authenticated
		//alert(user_email);
			
			
	
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



