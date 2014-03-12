## Getting Started

1. `npm install` to install all the developer dependencies
2. `gulp` will build the web app and then run a local [ripple emulator](http://emulate.phonegap.com/) using PhoneGap/Cordova 3.0.0

## Numbers and IDs and stuff

* Google Cloud Messaging (for push notifications) available through the [Google Dev Console](https://cloud.google.com/console/project)
  * dev
    * Project name: "upmysport Android Dev"
    * Project ID: `upmysport-android-dev`
    * Project Number: `452648157931`
    * Server API Key: `AIzaSyA14e_Vb_1U6me7rhqrcqy7d1VHQF_AHIQ`

## What are we using for Push Notifications?

* https://github.com/phonegap-build/PushPlugin
* http://devgirl.org/2013/07/17/tutorial-implement-push-notifications-in-your-phonegap-application/ helped
* https://github.com/ToothlessGear/node-gcm was useful for sending them
* https://github.com/argon/node-apn was too