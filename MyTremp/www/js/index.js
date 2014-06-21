function onBackKeyDown() {
    //navigator.app.exitApp();
}
function onDeviceReady() {
    FastClick.attach(document.body);
    app.receivedEvent('deviceready');
    window.console.log('device ready');
}

var app = {
    position: null,
    container: document.getElementById("app_container"),
    // Application Constructor
    initialize: function() {
        app.bindEvents();
        app.initPages();
        document.getElementById('id_mynumber_input').value = this.getPhoneNumber();
        document.getElementById('id_mynumber_input').setProperty('value',this.getPhoneNumber());

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
    bindEvents: function() {
        document.addEventListener('deviceready', onDeviceReady, false);
        document.addEventListener("backbutton", onBackKeyDown, false);
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
        navigator.notification.alert('מספר הטלפון נשמר בהצלחה',
            function(){}, 'עדכון', 'אישור');

    },
    getPhoneNumber: function()
    {
        return window.localStorage.getItem("phoneNumber");
    }
};
