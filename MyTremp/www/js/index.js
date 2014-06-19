/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function registerPushwooshIOS() {
 	var pushNotification = window.plugins.pushNotification;

 	//push notifications handler
	document.addEventListener('push-notification', function(event) {
				var notification = event.notification;
				navigator.notification.alert(notification.aps.alert);
				
				//to view full push payload
				//navigator.notification.alert(JSON.stringify(notification));
				
				//reset badges on icon
				pushNotification.setApplicationIconBadgeNumber(0);
			  });

	pushNotification.registerDevice({alert:true, badge:true, sound:true, pw_appid:"94550-3136B", appname:"Netivot Plus"},
									function(status) {
										var deviceToken = status['deviceToken'];
										console.warn('registerDevice: ' + deviceToken);
										onPushwooshiOSInitialized(deviceToken);
									},
									function(status) {
										console.warn('failed to register : ' + JSON.stringify(status));
										navigator.notification.alert(JSON.stringify(['failed to register ', status]));
									});
	
	//reset badges on start
	pushNotification.setApplicationIconBadgeNumber(0);
}

function onPushwooshiOSInitialized(pushToken)
{
	var pushNotification = window.plugins.pushNotification;
	//retrieve the tags for the device
	pushNotification.getTags(function(tags) {
								console.warn('tags for the device: ' + JSON.stringify(tags));
							 },
							 function(error) {
								console.warn('get tags error: ' + JSON.stringify(error));
							 });
	 
	//start geo tracking. PWTrackSignificantLocationChanges - Uses GPS in foreground, Cell Triangulation in background. 
	pushNotification.startLocationTracking('PWTrackSignificantLocationChanges',
									function() {
										   console.warn('Location Tracking Started');
									});
}

function registerPushwooshAndroid() {

 	var pushNotification = window.plugins.pushNotification;

	//push notifications handler
	document.addEventListener('push-notification', function(event) {
	            var title = event.notification.title;
	            var userData = event.notification.userdata;

	            //dump custom data to the console if it exists
	            if(typeof(userData) != "undefined") {
					console.warn('user data: ' + JSON.stringify(userData));
				}

				//and show alert
				navigator.notification.alert(title);

				//stopping geopushes
				pushNotification.stopGeoPushes();
			  });

	//projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID"
	pushNotification.registerDevice({ projectid: "179400841357", appid : "94550-3136B" },
									function(token) {
										//alert(token);
										//callback when pushwoosh is ready
										onPushwooshAndroidInitialized(token);
									},
									function(status) {
										alert("failed to register: " +  status);
									    console.warn(JSON.stringify(['failed to register ', status]));
									});
 }

function onPushwooshAndroidInitialized(pushToken)
{
	//output the token to the console
	console.warn('push token: ' + pushToken);

	var pushNotification = window.plugins.pushNotification;
	
	pushNotification.getTags(function(tags) {
							console.warn('tags for the device: ' + JSON.stringify(tags));
						 },
						 function(error) {
							console.warn('get tags error: ' + JSON.stringify(error));
						 });
	 

	//set multi notificaiton mode
	//pushNotification.setMultiNotificationMode();
	//pushNotification.setEnableLED(true);
	
	//set single notification mode
	//pushNotification.setSingleNotificationMode();
	
	//disable sound and vibration
	//pushNotification.setSoundType(1);
	//pushNotification.setVibrateType(1);
	
	pushNotification.setLightScreenOnNotification(false);
	
	//goal with count
	//pushNotification.sendGoalAchieved({goal:'purchase', count:3});
	
	//goal with no count
	//pushNotification.sendGoalAchieved({goal:'registration'});

	//setting list tags
	//pushNotification.setTags({"MyTag":["hello", "world"]});
	
	//settings tags
	pushNotification.setTags({deviceName:"hello", deviceId:10},
									function(status) {
										console.warn('setTags success');
									},
									function(status) {
										console.warn('setTags failed');
									});
		
	function geolocationSuccess(position) {
		pushNotification.sendLocation({lat:position.coords.latitude, lon:position.coords.longitude},
								 function(status) {
									  console.warn('sendLocation success');
								 },
								 function(status) {
									  console.warn('sendLocation failed');
								 });
	};
		
	// onError Callback receives a PositionError object
	//
	function geolocationError(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
	}
	
	function getCurrentPosition() {
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
	}
	
	//greedy method to get user position every 3 second. works well for demo.
//	setInterval(getCurrentPosition, 3000);
		
	//this method just gives the position once
//	navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
		
	//this method should track the user position as per Phonegap docs.
//	navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, { maximumAge: 3000, enableHighAccuracy: true });

	//Pushwoosh Android specific method that cares for the battery
	pushNotification.startGeoPushes();
}

 function initPushwoosh() {
	var pushNotification = window.plugins.pushNotification;
	if(device.platform == "Android")
	{
		registerPushwooshAndroid();
		pushNotification.onDeviceReady();
	}

	if(device.platform == "iPhone" || device.platform == "iOS")
	{
		registerPushwooshIOS();
		pushNotification.onDeviceReady();
	}
}

function onBackKeyDown() {
    goToMainPage();
    if(cPages.get("main").vars.isMenuPage == 1) {
        navigator.app.exitApp();
    }
}

var app = {
    position: null,
    container: document.getElementById("app_container"),
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        FastClick.attach(document.body);
        cPages.moveToPage(this.container,"main","right");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", onBackKeyDown, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //initPushwoosh();
        gps.start();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    checkConnection : function() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown';
        states[Connection.ETHERNET] = 'Ethernet';
        states[Connection.WIFI] = 'WiFi';
        states[Connection.CELL_2G] = 'Cell 2G';
        states[Connection.CELL_3G] = 'Cell 3G';
        states[Connection.CELL_4G] = 'Cell 4G';
        states[Connection.CELL] = 'Cell';
        states[Connection.NONE] = 'No';

        elem = $('#connectionInfo');
        if (networkState == Connection.NONE) {
            this.failElement(elem);
        } else {
            this.succeedElement(elem);
        }
        elem.innerHTML = 'Internet: ' + states[networkState];
    },
    getReadableTime : function(time) {
        var hours = time.getHours();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;

        return (hours + ':' + app.padZero(time.getMinutes()) + ':'
            + app.padZero(time.getSeconds()) + ' ' + ampm);
    },
    padZero : function(num) {
        return (num < 10 ? '0' + num : num);
    }
};
