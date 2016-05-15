$(document).ready(function(){
    $('#menu').click(function(){
	   $('#menu_off').fadeOut(600);
	   $('#menu_on').removeClass('hidden');
    });
	
	$('#back').click(function(){
	   $('#menu_on').addClass('hidden');
	   $('#menu_off').fadeIn(600);
    });
	
	var remote = require('remote');     

  document.getElementById("user").addEventListener("click", function (e) {
       var window = remote.getCurrentWindow();
       window.hide(); 
  });

  document.getElementById("max-btn").addEventListener("click", function (e) {
       var window = remote.getCurrentWindow();
       window.maximize(); 
  });

  document.getElementById("close-btn").addEventListener("click", function (e) {
       var window = remote.getCurrentWindow();
       window.close();
  });
  

  
  });