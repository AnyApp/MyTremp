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
function onDeviceReady() {
    FastClick.attach(document.body);
    document.addEventListener("backbutton", onBackKeyDown, false);
    window.console.log('device ready');
}

var app = {
    position: null,
    container: document.getElementById("app_container"),
    // Application Constructor
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
        window.setTimeout(onDeviceReady, 3000);
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

        }

    },
    saveNumber: function()
    {
        var phoneNumber = document.getElementById('id_mynumber_input').value;
        var phoneNumberVerify = document.getElementById('id_mynumber_input_verify').value;
        if (phoneNumber==null || phoneNumberVerify==null|| phoneNumber=='' || phoneNumberVerify=='')
        {
            navigator.notification.alert('אנא הזן את מספר הפלאפון פעמיים לצורך אימות',
                function(){}, 'שגיאה', 'אישור');
            return;
        }
        if (phoneNumber != phoneNumberVerify)
        {
            navigator.notification.alert('מספרי הפלאפון אינם תואמים',
                function(){}, 'שגיאה', 'אישור');
            return;
        }
        phoneNumber = phoneNumber.replace(/\D/g,'');

        if (phoneNumber.length!=10)
        {
            navigator.notification.alert('מספר פלאפון לא חוקי',
                function(){}, 'שגיאה', 'אישור');
            return;
        }
        window.localStorage.setItem("phoneNumber", phoneNumber);
        app.setEditNumberMode(false);
        navigator.notification.alert('מספר הטלפון נשמר בהצלחה',
            function(){}, 'עדכון', 'אישור');

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

                var message = 'עליתי על טרמפ ונקלעתי למצב חירום, הזעיקו משטרה! אני נמצא במיקום הבא:%0a'+
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
