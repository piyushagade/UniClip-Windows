/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

    $('#show_download_page').bind('click', function(event) {
        //Hide download button
        $('#show_download_page').addClass('hidden');
        //Show download page
        $('#download_page').removeClass('hidden');
        //Change Title
        $('#download_page_title').text('UniClip is available for Android, Windows, Mac OS, and Linux operating systems.');
    });


    $('#windows_download_page').bind('click', function(event) {
        //Change Title
        $('#download_page_title').text('Important: Please uninstall previous versions before installing newer version of UniClip! Windows client.');
    });


    $('#windows_download_page').bind('click', function(event) {
        hideAllDownloadPages();
        $('#linux_download_page').addClass('hidden');
        $('#mac_download_page').addClass('hidden');
        $('#android_download_page').addClass('hidden');
        $('#windows_download_page').addClass('hidden');
        $('#back_download_page').removeClass('hidden');
        $('#windows_portable_download_page').removeClass('hidden');

        //Change Title
        $('#download_page_title').html('<h4>Your download has started.</h4><br><br><b><u>Important</u></b><br><br>Please uninstall previous versions before installing newer version of UniClip! Windows client.<br><br>If you are unable to do so, just delete the "app" folder in "C:/Program Files (x86)/UniClip/resources" folder, and then install the newer version.<br><br><h3>Please ignore the "Untrusted File" warning. Or, you can download the portable version and manually add a shortcut in the System Startup folder. If you need to learn how to add a file to system startup, follow <a href="https://www.howtogeek.com/208224/how-to-add-programs-files-and-folders-to-system-startup-in-windows-8.1/" target="_new">this link</a>.</h3>');
    });


    $('#linux_download_page').bind('click', function(event) {
        hideAllDownloadPages();
        $('#linux_download_page').addClass('hidden');
        $('#android_download_page').addClass('hidden');
        $('#mac_download_page').addClass('hidden');
        $('#windows_download_page').addClass('hidden');
        $('#back_download_page').removeClass('hidden');

        //Change Title
        $('#download_page_title').html('<h4>Your download has started.</h4><br><br><b><u>Instructions</u></b><br><br>How to install tar.gz??<br><br><h3>First, extract the downloaded "uniclip-linux-x64.tar.gz" using the commands:<br><center><h4>tar -xvf uniclip-linux-x64.tar.gz</h4></center><br>Next, move the "UniClip-linux-x64" folder to "/usr/share" folder using the command:<br><center><h4>sudo mv UniClip-linux-x64 /usr/share</h4></center><br>Now create a launcher shortcut by executing:<br><h4> sudo touch /usr/share/applications UniClip.desktop</h4><br>Next, use the following command and then copy the following script to the editor.<br><h4>sudo nano /usr/share/applications/UniClip.desktop<br><br><h2>Paste this in the nano editor:</h2></center><h4>[Desktop Entry]<br>Name=UniClip<br>Comment=Unbridled clipboard synchronization<br>Exec=/usr/share/UniClip-linux-x64/UniClip<br>Icon=/usr/share/UniClip-linux-x64/UniClip.png<br>Terminal=false<br>Type=Application<br>Categories=Productivity;Application;</h4><br>Press "Ctrl+X" and then "Y" and finally, press "Enter" to save the file.<br><br><center><h3>To add UniClip! to start up applications, open "gnome-session-properties" through Terminal. And add "UniClip" app from "/usr/share/UniClip-linux-x64" folder to the list.</h3><br><br> And you are set! In case this does not go as expected, please contact the developer at piyushagade[at]gmail.com</center></h3>');
    });


    $('#mac_download_page').bind('click', function(event) {
        hideAllDownloadPages();
        $('#linux_download_page').addClass('hidden');
        $('#android_download_page').addClass('hidden');
        $('#mac_download_page').addClass('hidden');
        $('#windows_download_page').addClass('hidden');
        $('#back_download_page').removeClass('hidden');

        //Change Title
        $('#download_page_title').html('<h4>Your download has started.</h4><br><br><b><u>Instructions</u></b><br><br><h3><center>Just unzip the "uniclip-osx-x64.zip" and drag the "UniClip" executable to the "Applications" folder.<br><br>To add UniClip to startup applications, open UniClip, and right-click on its dock icon, select "Options > Open at login" and thats it!</center></h3>');
    });

    $('#back_download_page').bind('click', function(event) {
        hideAllDownloadPages();
    });

    function hideAllDownloadPages() {
        $('#linux_download_page').removeClass('hidden');
        $('#mac_download_page').removeClass('hidden');
        $('#android_download_page').removeClass('hidden');
        $('#windows_download_page').removeClass('hidden');
        $('#back_download_page').addClass('hidden');
        $('#windows_portable_download_page').addClass('hidden');

        //Change Title
        $('#download_page_title').text('UniClip is available for Android, Windows, and Linux operating systems (for now).');
    }

})(jQuery); // End of use strict
