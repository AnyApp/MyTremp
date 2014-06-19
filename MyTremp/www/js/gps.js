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

	init : function() {
		//gps.initToggleListener();
		gps.start();
	},
	initToggleListener : function() {
		$('#locationToggle').bind("change", function(event, ui) {
			if (this.value == "true") {
				gps.start();
			} else {
				gps.stop();
			}
		});
	},
	start : function() {
		var gpsOptions = {
			enableHighAccuracy : false,
			timeout : 1000 * 60 * 4,
			maximumAge : 1 * 4000
		};
		gps.GPSWatchId = navigator.geolocation.watchPosition(gps.onSuccess,
				gps.onError, gpsOptions);
	},
	stop : function() {
		navigator.geolocation.clearWatch(gps.GPSWatchId);
	},
	onSuccess : function(position) {
		// reset error counter
        gps.gpsErrorCount = 0;

		app.position = position;
		//app.submitToServer();

		var elem = document.getElementById('app_container');
		//this.successElement(elem);

        elem.innerHTML = ('Latitude: ' + position.coords.latitude.toFixed(7)
				+ '<br/>' + 'Longitude: '
				+ position.coords.longitude.toFixed(7) + '<br/>'
				+ 'Last Update: ' + app.getReadableTime(position.timestamp));
	},
	onError : function(error) {
		gps.gpsErrorCount++;

		if (true || gps.gpsErrorCount > 3) {
            var elem = document.getElementById('app_container');
			//$(elem).removeClass("success");
			//$(elem).addClass("fail");
			elem.innerHTML = ('There is an error, restarting GPS. '
					+ app.getReadableTime(new Date()) + "<br/> message:" + error.message);
			console.log('error with GPS: error.code: ' + error.code
					+ ' Message: ' + error.message);

			// Restart GPS listener, fixes most issues.
			gps.stop();
			gps.start();
		}
	}
};
