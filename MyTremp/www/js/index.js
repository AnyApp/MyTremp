function onBackKeyDown() {
    navigator.notification.confirm('האם אתה בטוח כי ברצונך לצאת מהאפליקציה?',
        function(choosed)
        {
            if (choosed == 1)
            {
                return;
            }
            navigator.app.exitApp();
        },'יציאה','הישאר,צא'
    );

}

function getScrollY(scroller)
{
    if (scroller!= undefined && scroller!=null)
    {
        return scroller.y;
    }
    return 0;
}

function refreshScrolling(toTop){
    var y1 = getScrollY(window.scroll1);
    var y2 = getScrollY(window.scroll2);
    var y3 = getScrollY(window.scroll3);
    //Scroll to top
    if (toTop!= undefined && toTop!=null && toTop==true)
    {
        window.scroll1.scrollTo(0,0);
        window.scroll2.scrollTo(0,0);
        window.scroll3.scrollTo(0,0);
    }

    if (window.scroll1==undefined || window.scroll1==null)
    {
        window.scroll1 = new IScroll(document.getElementById('content_tremp'), { tap: true});
        window.scroll2 = new IScroll(document.getElementById('content_info'), { tap: true});
        window.scroll3 = new IScroll(document.getElementById('content_contact'), { tap: true});
    }
    setTimeout(function () { window.scroll1.refresh(); }, 100);
    setTimeout(function () { window.scroll2.refresh(); }, 100);
    setTimeout(function () { window.scroll3.refresh(); }, 100);

    //window.scroll1.scrollTo(0,y1);
    //window.scroll2.scrollTo(0,y2);
    //window.scroll3.scrollTo(0,y3);
}

function onResume()
{
    FastClick.attach(document.body);
    refreshScrolling();
    updateButtonClicks();

}

function onDeviceReady() {


    refreshScrolling(true);
    FastClick.attach(document.body);
    updateButtonClicks();
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("resume", onResume, false);
    window.console.log('device ready');

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
        document.getElementById('id_mynumber_input').value = this.getPhoneNumber();
        document.getElementById('id_mynumber_input').setAttribute ('value',this.getPhoneNumber());
        if ( this.getPhoneNumber()==null|| this.getPhoneNumber()==''|| this.getPhoneNumber()==undefined)
        {
            app.setEditNumberMode(true);
        }
        else
        {
            app.setEditNumberMode(false);
        }
        window.setTimeout(onDeviceReady, 2000);

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
            document.getElementById('id_mynumber_button_save').className='button_save_number';
            document.getElementById('id_mynumber_input_verify').className='mynumber_input';
            document.getElementById('id_mynumber_verify_title').className='mynumber_title';
            document.getElementById('id_mynumber_button_cancel').className='button_cancel_edit';
            document.getElementById('id_mynumber_editmode').className='hidden';
        }
        else
        {
            document.getElementById('id_mynumber_button_save').className='hidden';
            document.getElementById('id_mynumber_input_verify').className='hidden';
            document.getElementById('id_mynumber_verify_title').className='hidden';
            document.getElementById('id_mynumber_button_cancel').className='hidden';
            document.getElementById('id_mynumber_editmode').className='button_edit_number';
            //window.scroll1.scrollTo(0, 0);
        }
        refreshScrolling();

    },
    saveNumber: function()
    {
        var phoneNumber = document.getElementById('id_mynumber_input').value;
        var phoneNumberVerify = document.getElementById('id_mynumber_input_verify').value;
        if (phoneNumber==null || phoneNumberVerify==null|| phoneNumber=='' || phoneNumberVerify=='')
        {
            navigator.notification.alert('אנא הזן את מספר הפלאפון פעמיים לצורך אימות',
                function(){refreshScrolling();}, 'שגיאה', 'אישור');
            return;
        }
        if (phoneNumber != phoneNumberVerify)
        {
            navigator.notification.alert('מספרי הפלאפון אינם תואמים',
                function(){refreshScrolling();}, 'שגיאה', 'אישור');
            return;
        }
        phoneNumber = phoneNumber.replace(/\D/g,'');

        if (phoneNumber.length!=10)
        {
            navigator.notification.alert('מספר פלאפון לא חוקי',
                function(){refreshScrolling();}, 'שגיאה', 'אישור');
            return;
        }
        window.localStorage.setItem("phoneNumber", phoneNumber);
        app.setEditNumberMode(false);
        navigator.notification.alert('מספר הטלפון נשמר בהצלחה',
            function(){refreshScrolling();}, 'עדכון', 'אישור');

    },
    getPhoneNumber: function()
    {
        return window.localStorage.getItem("phoneNumber");
    },
    sendSMS: function()
    {
        navigator.notification.confirm('האם ברצונך לשלוח הודעת חירום אל אנשי החירום שלך?',
            function(choosed)
            {
                if (choosed == 2)
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
                    navigator.notification.alert('לא קיימים אנשי חירום לשליחת הודעה. כדי להוסיף אנשי חירום היכנס אל \'אנשי חירום\'.',
                        function(){}, 'לא נשלחה הודעת חירום', 'אישור');
                    return;
                }
                numbers = numbers.substring(0,numbers.length-1);

                var message = 'עליתי על טרמפ ונקלעתי למצב חירום, הזעיקו משטרה! אני נמצא במיקום הבא: '+
                    'lat:'+gps.lastLat+'lon:'+gps.lastLon;
                var intent = "INTENT"; //leave empty for sending sms using default intent
                var success =
                    function ()
                    {
                        navigator.notification.alert('הודעת חירום נשלחה בהצלחה!',
                            function(){}, 'עדכון', 'תודה');
                    };
                var error =
                    function ()
                    {
                        navigator.notification.alert('שליחת הודעת החירום נכשלה',
                            function(){}, 'עדכון', 'אישור');
                    };
                sms.send(numbers, message, intent, success, error);
            },'הודעת חירום','שלח,בטל'
        );
    }
};

