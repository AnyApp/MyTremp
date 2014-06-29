/*
 * David Rust-Smith & Nick Breen - August 2013
 *
 * Apache 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. 
 */

var gps = {
	GPSWatchId : null,
	gpsErrorCount : 0,
    phoneNumber: null,
    lastSave:0,
    lastLon:0,
    lastLat:0,

    options: function()
    {
        return {
            url: 'http://codletech.net/imonaride/saveLocationData.php', // <-- only required for Android; ios allows javascript callbacks for your http
            params: {                                               // HTTP POST params sent to your server when persisting locations.
                auth_token: 'imonride',
                phone_number:app.getPhoneNumber()
            },
            desiredAccuracy: 100,
            stationaryRadius: 20,
            distanceFilter: 100,
            debug: false // <-- enable this hear sounds for background-geolocation life-cycle.
        };
    },
    handleClick: function()
    {
        var button = document.getElementById('id_button_start_ride');
        if (!gps.isRunning())
        {
            var result = gps.start();
            if (result==true)
            {
                button.innerHTML='ירדתי מטרמפ';
            }
        }
        else
        {
            gps.stop();
            button.innerHTML='עליתי על טרמפ';
        }
    },
    checkAndRestart: function()
    {
        var button = document.getElementById('id_button_start_ride');
        if (gps.isRunning())
        {
            var success = gps.restart();
            if (success)
            {
                button.innerHTML='ירדתי מטרמפ';
                return;
            }
        }
        button.innerHTML='עליתי על טרמפ';
    },
    restart: function()
    {
        gps.stop();
        return gps.start();
    },
	start : function() {
        this.phoneNumber=app.getPhoneNumber();
        if (this.phoneNumber == undefined || this.phoneNumber == null || this.phoneNumber =='')
        {
            navigator.notification.alert('יש להזין מספר פלאפון אישי ולשמור אותו.',
                function(){}, 'הטרמפ לא התחיל', 'הבנתי');
            return false;
        }

        gps.setRunState(true);
        gps.log("started");
        if (gps.useNew())
        {
            var bgGeo = window.plugins.backgroundGeoLocation;
            // BackgroundGeoLocation is highly configurable.
            bgGeo.configure(gps.newOnSuccess, gps.newOnError, gps.options());
            // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
            bgGeo.start();
        }

        // Execute old version either way.
        var gpsOptions = {
            enableHighAccuracy : false,
            timeout : 1000 * 60,
            maximumAge : 1000 * 15
        };
        gps.GPSWatchId = navigator.geolocation.watchPosition(gps.oldOnSuccess,
            gps.oldOnError, gpsOptions);

        return true;
	},
	stop : function() {
        gps.setRunState(false);
        gps.log("stopped");
        if (gps.GPSWatchId!= null && gps.GPSWatchId != undefined)
        {
            navigator.geolocation.clearWatch(gps.GPSWatchId);
        }
        gps.GPSWatchId = null;
        var bgGeo = window.plugins.backgroundGeoLocation;
        bgGeo.stop()
	},
	oldOnSuccess: function(position) {
		// reset error counter
        gps.gpsErrorCount = 0;
        gps.log ('GPS Success');
		app.position = position;

        /*gps.log ('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');*/
        gps.lastLon=position.coords.longitude;
        gps.lastLat=position.coords.latitude;
        gps.oldSubmitToServer(position);

	},
	oldOnError : function(error) {
		gps.gpsErrorCount++;
        gps.log ('There is an error, restarting GPS. '
            + "<br/> message:" + error.message);

        if (gps.gpsErrorCount > 100) {
            // Stop Old Version
            if (gps.GPSWatchId!= null && gps.GPSWatchId != undefined)
            {
                navigator.geolocation.clearWatch(gps.GPSWatchId);
            }
            gps.GPSWatchId = null;

            //alert('נכשל בנסיון לקבל מיקום');
            gps.log('gps failure!');
            /*navigator.notification.alert('נכשל בנסיון לקבל מיקום',
                function(){}, 'שגיאה', 'הבנתי');*/
        }
		else if (gps.gpsErrorCount > 3) {
			//$(elem).removeClass("success");
			//$(elem).addClass("fail");
			gps.log ('There is an error, restarting GPS. '
					 + "<br/> message:" + error.message);
			/*console.log('error with GPS: error.code: ' + error.code
					+ ' Message: ' + error.message);*/

			// Restart GPS listener, fixes most issues.
			gps.stop();
			gps.start();
		}
	},
    oldSubmitToServer: function(position)
    {
        if (!gps.checkSaveNeed(position.timestamp))
        {
            return;
        }

        var imonarideAPI = "http://codletech.net/imonaride/saveLocationData.php";
        var data =
        {
            phone_number:app.getPhoneNumber(),
            source: 'old',
            auth_token: 'imonride',
            location:
            {
                latitude:position.coords.latitude,
                longitude:position.coords.longitude,
                recorded_at:gps.timestampToDateTime(position.timestamp),
                altitude:position.coords.altitude,
                accuracy:position.coords.accuracy,
                altitudeAccuracy:position.coords.altitudeAccuracy,
                heading:position.coords.heading,
                speed:position.coords.speed
            }
        };

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", imonarideAPI);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(data));

        // Update last saved data timestamp.
        gps.lastSave = position.timestamp;
    },
    newOnSuccess: function(location) {
        window.console.log('iphone new api sending');
        //window.console.log(location);
        var imonarideAPI = "http://codletech.net/imonaride/saveLocationData.php";
        var data =
        {
            phone_number: window.localStorage.getItem("phoneNumber"), // Safe phone number get.s
            source: 'newIos',
            auth_token: 'imonride',
            location:
            {
                latitude:location.latitude,
                longitude:location.longitude,
                recorded_at:location.recorded_at,
                accuracy:location.accuracy,
                speed:location.speed
            }
        };

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", imonarideAPI);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(data));

        gps.iosAjaxCallback.call(this);
    },
    iosAjaxCallback: function(response) {
        ////
        // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
        //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //
        //
        var bgGeo = window.plugins.backgroundGeoLocation;
        bgGeo.finish();
    },
    newOnError: function(error) {
        console.log('BackgroundGeoLocation error');
    },
    log: function(msg)
    {
        window.console.log(msg);
    },
    twoDigits: function(d) {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
    },
    timestampToDateTime: function(timestamp)
    {
        var date = new Date(timestamp);
        return date.getFullYear() + "-" + gps.twoDigits(1 + date.getMonth()) + "-" + gps.twoDigits(date.getDate()) + " " + gps.twoDigits(date.getHours()) + ":" + gps.twoDigits(date.getMinutes()) + ":" + gps.twoDigits(date.getSeconds());
    },
    checkSaveNeed: function(timestamp)
    {
        return (timestamp-gps.lastSave)>1000*60*3;
    },
    setRunState: function(running)
    {
        if (running==true)
        {
            window.localStorage.setItem("locateRunning",'running');
        }
        else
        {
            window.localStorage.setItem("locateRunning",'stopped');
        }
    },
    isRunning: function()
    {
        var state = window.localStorage.getItem("locateRunning");
        if (state==undefined || state == null || state=='')
        {
            state = 'stopped';
        }
        return (state=='running');
    },
    useNew: function()
    {
        var deviceOS  = device.platform;  //fetch the device operating system
        if (deviceOS == 'Android')
        {
            var deviceOSVersion = device.version;  //fetch the device OS version
            var androidVersion = Number(deviceOSVersion.substring(0,deviceOSVersion.indexOf(".")));

            if (androidVersion < 4)
            {
                return false;
            }
        }

        return true;
    }

};
