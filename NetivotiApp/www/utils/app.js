/**
 * App object.
 */
var app;

app = {
    container: document.getElementById("app_container"),
    init: function() {
        FastClick.attach(document.body);
        cPages.moveToPage(this.container,"main","right");
    }


};

function onDeviceReady()
{
    var pushNotification;
    try
    {
        pushNotification = window.plugins.pushNotification;
        if (isAndroid())
        {
            pushNotification.register(successHandler, errorHandler, {"senderID":"179400841357","ecb":"onNotificationGCM"});		// required!
        }
        else
        {
            pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
        }
    }
    catch(err)
    {
        txt="There was an error on this page.\n\n";
        txt+="Error description: " + err.message + "\n\n";
        alert(txt);
    }
}
// handle APNS notifications for iOS
function onNotificationAPN(e)
{
    if (e.alert)
    {
        navigator.notification.alert(e.alert);
    }

    if (e.sound)
    {
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge)
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }

}

// handle GCM notifications for Android
function onNotificationGCM(e)
{
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                //alert("entering to pushwoosh");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                PushWoosh.appCode = "94550-3136B";
                PushWoosh.register(e.regid, function(data)
                {
                    console.log("PushWoosh register success: " + JSON.stringify(data));
                    //alert("succeded");
                }, function(errorregistration) {
                    console.log("Couldn't register with PushWoosh" +  errorregistration);
                    //alert("oh shit!");
                });

            }
            break;

        case 'message':
            navigator.notification.alert(e.payload);
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+e.soundname);
                my_media.play();
            }

            break;

        default:
            break;
    }
}



function tokenHandler (result) {
    //$("#app-status-ul").append('<li>token: '+ result +'</li>');
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    //$("#app-status-ul").append('<li>success:'+ result +'</li>');
    //alert(result);
}

function errorHandler (error) {
    //$("#app-status-ul").append('<li>error:'+ error +'</li>');
}


document.addEventListener('deviceready', onDeviceReady, true);

app.init();