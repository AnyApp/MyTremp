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
	init : function() {
		//gps.initToggleListener();
        gps.log("initialize");
        gps.start();

	},
    handleClick: function()
    {
        var button = document.getElementById('id_button_start_ride');
        if (gps.GPSWatchId == null)
        {
            gps.start();
            button.innerHTML='ירדתי מטרמפ';
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
            return;
        }

        gps.log("started");
		var gpsOptions = {
			enableHighAccuracy : true,
			timeout : 1000 * 60,
			maximumAge : 1000 * 15,
            frequency: 1000 * 15
		};
		gps.GPSWatchId = navigator.geolocation.watchPosition(gps.onSuccess,
				gps.onError, gpsOptions);
	},
    pickOnce: function()
    {
        navigator.geolocation.getCurrentPosition(gps.onSuccess,gps.onError);
    },
	stop : function() {
        gps.log("stopped");
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
        /*gps.log ('Latitude: ' + position.coords.latitude.toFixed(7)
				+ '<br/>' + 'Longitude: '
				+ position.coords.longitude.toFixed(7) + '<br/>'
				+ 'Last Update: ' + app.getReadableTime(position.timestamp));*/
	},
	onError : function(error) {
		gps.gpsErrorCount++;

        if (gps.gpsErrorCount > 100) {
            gps.stop();
            alert('נכשל בנסיון לקבל מיקום');
        }
		else if (gps.gpsErrorCount > 3) {
			//$(elem).removeClass("success");
			//$(elem).addClass("fail");
			gps.log ('There is an error, restarting GPS. '
					+ app.getReadableTime(new Date()) + "<br/> message:" + error.message);
			console.log('error with GPS: error.code: ' + error.code
					+ ' Message: ' + error.message);

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
        window.console.log(msg);
    }
};
