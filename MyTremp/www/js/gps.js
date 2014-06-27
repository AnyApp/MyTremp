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

    handleClick: function()
    {
        var button = document.getElementById('id_button_start_ride');
        if (gps.GPSWatchId == null)
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
	start : function() {
        this.phoneNumber=app.getPhoneNumber();
        if (this.phoneNumber == undefined || this.phoneNumber == null || this.phoneNumber =='')
        {
            navigator.notification.alert('יש להזין מספר פלאפון אישי ולשמור אותו.',
                function(){}, 'הטרמפ לא התחיל', 'הבנתי');
            return false;
        }

        gps.log("started");
		/*var gpsOptions = {
			enableHighAccuracy : true,
			timeout : 1000 * 60,
			maximumAge : 1000 * 15,
            frequency: 1000 * 15
		};
		gps.GPSWatchId = navigator.geolocation.watchPosition(gps.onSuccess,
				gps.onError, gpsOptions);*/

        var bgGeo = window.plugins.backgroundGeoLocation;
        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(gps.callbackFn, gps.failureFn, {
            url: 'http://only.for.android.com/update_location.json', // <-- only required for Android; ios allows javascript callbacks for your http
            params: {                                               // HTTP POST params sent to your server when persisting locations.
                auth_token: 'user_secret_auth_token',
                foo: 'bar',
                phone_number:this.phoneNumber
            },
            desiredAccuracy: 100,
            stationaryRadius: 20,
            distanceFilter: 100,
            debug: true // <-- enable this hear sounds for background-geolocation life-cycle.
        });

        return true;
	},
    pickOnce: function()
    {
        navigator.geolocation.getCurrentPosition(gps.onSuccess,gps.onError);
    },
	stop : function() {
        //gps.log("stopped");
		navigator.geolocation.clearWatch(gps.GPSWatchId);
        gps.GPSWatchId = null;
	},
	onSuccess : function(position) {
		// reset error counter
        gps.gpsErrorCount = 0;

		app.position = position;
		//app.submitToServer();

		//this.successElement(elem);
        gps.log ('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
        gps.lastLon=position.coords.longitude;
        gps.lastLat=position.coords.latitude;
        gps.submitToServer(position);
        /*gps.log ('Latitude: ' + position.coords.latitude.toFixed(7)
				+ '<br/>' + 'Longitude: '
				+ position.coords.longitude.toFixed(7) + '<br/>'
				+ 'Last Update: ' + app.getReadableTime(position.timestamp));*/
	},
	onError : function(error) {
		gps.gpsErrorCount++;

        if (gps.gpsErrorCount > 100) {
            gps.stop();
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
    log: function(msg)
    {
        //var elem = document.getElementById('app_container');
        //if (elem.innerHTML.length>1000){
         //   elem.innerHTML ="";
        //}
        //elem.innerHTML = elem.innerHTML+msg+'<br/>';
        //window.console.log(msg);
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
    submitToServer: function(position)
    {
        if (!gps.checkSaveNeed(position.timestamp))
        {
            return;
        }

        var imonarideAPI = "http://codletech.net/imonaride/saveData.php?";
        imonarideAPI +=
            'phone='+app.getPhoneNumber() +
            '&datetime='+gps.timestampToDateTime(position.timestamp)+
            '&longitude='+position.coords.longitude +
            '&latitude='+position.coords.latitude +
            '&altitude='+position.coords.altitude +
            '&accuracy='+position.coords.accuracy +
            '&altitudeAccuracy='+position.coords.altitudeAccuracy +
            '&heading='+position.coords.heading +
            '&speed='+position.coords.speed;

        //gps.log(imonarideAPI);

        var xmlhttp = new XMLHttpRequest();
        // open the connection using get method and send it
        xmlhttp.open("GET",imonarideAPI,true);
        xmlhttp.send();

        // Update last saved data timestamp.
        gps.lastSave = position.timestamp;
    },
    ajaxCallback: function(response) {
        ////
        // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
        //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //
        //
        var bgGeo = window.plugins.backgroundGeoLocation;
        bgGeo.finish();
    },
    options: function()
    {
        // BackgroundGeoLocation is highly configurable.
        return {
            url: 'http://codletech.net/imonaride/saveDataAndroid.php', // <-- only required for Android; ios allows javascript callbacks for your http
            params: {                                               // HTTP POST params sent to your server when persisting locations.
                auth_token: 'user_secret_auth_token',
                foo: 'bar',
                phone_number:this.phoneNumber
            },
            desiredAccuracy: 100,
            stationaryRadius: 20,
            distanceFilter: 100,
            debug: true // <-- enable this hear sounds for background-geolocation life-cycle.
        };
    },
    callbackFn: function(location) {
        console.log('[js] BackgroundGeoLocation callback:  ' + location.latitudue + ',' + location.longitude);
        // Do your HTTP request here to POST location to your server.
        //
        //
        ajaxCallback.call(this);
    },
    failureFn: function(error) {
        console.log('BackgroundGeoLocation error');
    },
    checkSaveNeed: function(timestamp)
    {
        return (timestamp-gps.lastSave)>1000*60*2;
    },
    getRunState: function()
    {
        var state = window.localStorage.getItem("locateRunning");
        if (state==undefined || state == null || state=='')
        {
            state = 'stopped';
        }
        return state;
    }
};
