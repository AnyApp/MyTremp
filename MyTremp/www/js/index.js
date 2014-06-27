function customizeAlertify()
{
    alertify.set({ buttonReverse: true });
}

function onBackKeyDown() {
    alertify.set({ labels: {ok: "הישאר",cancel : "צא" } });

    alertify.confirm('האם אתה בטוח כי ברצונך לצאת מהאפליקציה?',
        function(ok)
        {
            if (ok)
            {
                return;
            }
            navigator.app.exitApp();
        }
    );

}

function refreshScrolling(forceCreate){

    if (forceCreate || window.scroll1==null || window.scroll1 == undefined)
    {
        window.scroll1 = new IScroll(document.getElementById('content_tremp'), { tap: true});
        window.scroll2 = new IScroll(document.getElementById('content_info'), { tap: true});
        window.scroll3 = new IScroll(document.getElementById('content_contact'), { tap: true});
        window.scroll4 = new IScroll(document.getElementById('content_phone_form'), { tap: true});
    }
    else
    {
        setTimeout(function () {window.scroll1.refresh();}, 0);
        setTimeout(function () {window.scroll2.refresh();}, 0);
        setTimeout(function () {window.scroll3.refresh();}, 0);
        setTimeout(function () {window.scroll4.refresh();}, 0);
    }

}

function onResume()
{
    FastClick.attach(document.body);
    refreshScrolling();
    updateButtonClicks();

}

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("resume", onResume, false);

    customizeAlertify();
    refreshScrolling();
    FastClick.attach(document.body);
    updateButtonClicks();

    window.console.log('device ready');


    // Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
    //  in order to prompt the user for Location permission.
    window.navigator.geolocation.getCurrentPosition(function(location) {});

    /**
     * Enables the background mode. The app will not pause while in background.
     */
    window.plugin.backgroundMode.enable();
    if (window.localStorage.getItem("agreed") != 'agreed')
    {
        navigator.notification.confirm(document.getElementById('agreement').innerHTML,
            function(choosed)
            {
                if (choosed == 2)
                {
                    navigator.app.exitApp();
                    return;
                }
                window.localStorage.setItem("agreed",'agreed');

            },'תנאי שימוש','מסכים,אינני מסכים'
        );
    }


}

function hasClass(el, name) {
    return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
}
function addClass(el, name)
{
    if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
}
function removeClass(el, name)
{
    if (hasClass(el, name)) {
        el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
    }
}
function setTouchEvent(elm,eventHandler,buttonClass)
{
    if (buttonClass==null || buttonClass=="")
    {
        buttonClass = 'buttonTouch';
    }

    elm.addEventListener("touchstart", function()
    {
        window.console.log('touched');
        addClass(elm,buttonClass);
    });
    elm.addEventListener("touchend", function()
    {
        window.console.log('touchend');
        removeClass(elm,buttonClass);
    });
    elm.addEventListener("tap", function(e){

        if (app.checkIfToClick())
        {
            eventHandler();//elm.onclick.apply(elm);
        }
        e.preventDefault();
        return false;
    });

}
function updateButtonClicks() {
    setTouchEvent(document.getElementById('id_button_start_ride'),function(){gps.handleClick();});
    setTouchEvent(document.getElementById('id_button_emergency'),function(){app.sendSMS();});
    setTouchEvent(document.getElementById('id_mynumber_editmode'),function(){app.setEditNumberMode(true);});
    setTouchEvent(document.getElementById('id_mynumber_button_save'),function(){app.saveNumber();});
    setTouchEvent(document.getElementById('id_mynumber_button_cancel'),function(){app.setEditNumberMode(false);});
    setTouchEvent(document.getElementById('id_button_add_contact'),function(){contacts.chooseContact();});
    setTouchEvent(document.getElementById('id_button_donation1'),function(){navigator.app.loadUrl(app.donationUrl, { openExternal:true });},'donationTouch');
    setTouchEvent(document.getElementById('id_button_donation2'),function(){navigator.app.loadUrl(app.donationUrl, { openExternal:true });},'donationTouch');
    setTouchEvent(document.getElementById('id_button_donation3'),function(){navigator.app.loadUrl(app.donationUrl, { openExternal:true });},'donationTouch');


    //Update contacts views.
    for (var i=0;i<=contacts.maxContactIndex;i++)
    {
        (function()
        {
            var currentName = contacts.savedContacts[i].name;
            var currentPhone = contacts.savedContacts[i].phone;
            setTouchEvent(document.getElementById(contacts.baseId+""+i),function(){contacts.deleteContact(currentName,currentPhone);},'contactTouch');
        })();
    }


}

var app = {
    donationUrl:'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9CVH4ET84KWQA',
    lastClick:(new Date()).getTime(),
    position: null,
    container: document.getElementById("app_container"),
    // Application Constructor
    checkIfToClick: function()
    {
        var currentTime = (new Date()).getTime();
        if (currentTime-app.lastClick>400)
        {
            app.lastClick = currentTime;
            return true;
        }
        return false;
    },
    initialize: function() {

        app.initPages();
        app.updatePhoneNumberView();
        app.setEditNumberMode(false);
        window.setTimeout(onDeviceReady, 2000);

    },
    updatePhoneNumberView: function()
    {
        document.getElementById('id_mynumber_input').value = this.getPhoneNumber();
        document.getElementById('id_mynumber_input').setAttribute ('value',this.getPhoneNumber());
        var phoneNumberViewText = this.getPhoneNumber();
        if (phoneNumberViewText==undefined || phoneNumberViewText==null || phoneNumberViewText=="")
        {
            phoneNumberViewText='לא הוגדר מספר פלאפון';
        }
        document.getElementById('mynumber_label_text').innerHTML=phoneNumberViewText;
    },
    initPages: function() {
        pager.addPage('tremp','menu_tremp','content_tremp');
        pager.addPage('contact','menu_contact','content_contact');
        pager.addPage('info','menu_info','content_info');
        pager.moveToPage('tremp');
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function()
    {
        document.addEventListener('deviceready', onDeviceReady, false);
        document.addEventListener("backbutton", onBackKeyDown, false);
    },
    setEditNumberMode: function(state)
    {
        if (state == true)
        {
/*
            document.getElementById('id_mynumber_button_save_ul').className='';
            document.getElementById('id_mynumber_input_verify_ul').className='';
            document.getElementById('id_mynumber_verify_title_ul').className='';
            document.getElementById('id_mynumber_button_cancel_ul').className='';
            document.getElementById('id_mynumber_input_ul').className='';
            document.getElementById('id_mynumber_editmode_ul').className='hidden';
            document.getElementById('id_mynumber_label_ul').className='hidden';
*/

            document.getElementById('content_phone_form').className='page_content';
            document.getElementById('content_tremp').className='page_content hidden';
            window.scroll4.scrollTo(0, 0);
        }
        else
        {
/*
            document.getElementById('id_mynumber_button_save_ul').className='hidden';
            document.getElementById('id_mynumber_input_verify_ul').className='hidden';
            document.getElementById('id_mynumber_verify_title_ul').className='hidden';
            document.getElementById('id_mynumber_button_cancel_ul').className='hidden';
            document.getElementById('id_mynumber_input_ul').className='hidden';
            document.getElementById('id_mynumber_editmode_ul').className='';
            document.getElementById('id_mynumber_label_ul').className='mynumber_label';
*/
            //window.scroll1.scrollTo(0, 0);
            document.getElementById('content_phone_form').className='page_content hidden';
            document.getElementById('content_tremp').className='page_content';
            //window.scroll1.scrollTo(0, 0);
        }
        refreshScrolling();

    },
    saveNumber: function()
    {
        alertify.set({ labels: { ok: "אישור" } });

        var phoneNumber = document.getElementById('id_mynumber_input').value;
        var phoneNumberVerify = document.getElementById('id_mynumber_input_verify').value;
        if (phoneNumber==null || phoneNumberVerify==null|| phoneNumber=='' || phoneNumberVerify=='')
        {
            alertify.alert('אנא הזן את מספר הפלאפון פעמיים לצורך אימות');
            setTimeout(function () {refreshScrolling();}, 200);
            return;
        }
        if (phoneNumber != phoneNumberVerify)
        {
            alertify.alert('מספרי הפלאפון אינם תואמים');
            setTimeout(function () {refreshScrolling();}, 200);
            return;
        }
        phoneNumber = phoneNumber.replace(/\D/g,'');

        if (phoneNumber.length!=10)
        {
            alertify.alert('מספר פלאפון לא חוקי');
            setTimeout(function () {refreshScrolling();}, 200);
            return;
        }
        window.localStorage.setItem("phoneNumber", phoneNumber);
        document.getElementById('mynumber_label_text').innerHTML=phoneNumber; //Update View.
        app.setEditNumberMode(false);

        alertify.set({ labels: {ok: "אישור"} });
        alertify.alert('מספר הטלפון נשמר בהצלחה');
        refreshScrolling();

    },
    getPhoneNumber: function()
    {
        return window.localStorage.getItem("phoneNumber");
    },
    sendSMS: function()
    {
        alertify.set({ labels: {ok: "שלח",cancel : "בטל" } });
        alertify.confirm('האם ברצונך לשלוח הודעת חירום אל אנשי החירום שלך?',
            function(ok)
            {
                if (!ok)
                {
                    return;
                }
                // Send emergency SMS.
                var contactList = contacts.getContacts();
                var numbers='';
                for (var iContact in contactList)
                {
                    numbers  += contactList[iContact].phone+',';
                }
                if (numbers == '')
                {
                    alertify.set({ labels: {ok: "אישור"} });
                    alertify.alert('לא קיימים אנשי חירום לשליחת הודעה. כדי להוסיף אנשי חירום היכנס אל \'אנשי חירום\'.');
                    return;
                }
                numbers = numbers.substring(0,numbers.length-1);

                var message = 'עליתי על טרמפ ונקלעתי למצב חירום, הזעיקו משטרה! אני נמצא במיקום הבא: '+
                    'lat:'+gps.lastLat+'lon:'+gps.lastLon;
                var intent = "INTENT"; //leave empty for sending sms using default intent
                var success =
                    function ()
                    {
                        alertify.set({ labels: {ok: "תודה"} });
                        alertify.alert('הודעת חירום נשלחה בהצלחה!');
                    };
                var error =
                    function ()
                    {
                        alertify.set({ labels: {ok: "אישור"} });
                        alertify.alert('שליחת הודעת החירום נכשלה');
                    };
                sms.send(numbers, message, intent, success, error);
            }
        );
    }
};

