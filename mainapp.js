/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BK8F1SscfTJeD9_baLZiC-OioBJcDW42JFwWeB26Iw1UoA8wrbPK4CBzkPyMUcs1mDj8Uo3Ecx7qRc8H8qBQtKw';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('/Public/js/swsapp.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initialiseUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
}

function initialiseUI() {
    swRegistration.pushManager.getSubscription().then(function(subscription) {
        isSubscribed = !(subscription === null);
        if (isSubscribed) {
            console.log('User IS subscribed.');
            return
        } else {
            if (Notification.permission !== 'denied') {
                subscribeUser();
            }
            console.log('User is NOT subscribed.');
        }
    })
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    updateSubscriptionOnServer(null);
    return;
  }

}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
    // 展示次数统计
    let e = {site : 'appurse_app'};
            fetch("https://www.silvergloria.com/subimpression", {
                mode: "no-cors",
                body: JSON.stringify(e),
                method: "POST",
                headers: {
                        'content-type': 'application/json'
                    }
            }).then(function(e) {
                console.log(e);
                return;
            })
}

function updateSubscriptionOnServer(subscription) {

  var data = JSON.stringify(subscription);
  var jsondata = JSON.parse(data);

  mailAjax(jsondata.endpoint,jsondata.keys.auth,jsondata.keys.p256dh);

}
function getTimezone() {
      var e = "+00:00";
      try {
          var t = Date().match(/([\+-][0-9]+)/)[0].split("");
          e = t[0] + t[1] + t[2] + ":" + t[3] + t[4]
      } catch (e) {}
      return e;
}
function mailAjax(endpoint,auth,p256dh){
  var href = window.location.href;
  var zone = getTimezone();
  var params={"endpoint":endpoint,"auth":auth,'p256dh':p256dh,'site':'appurse_app','zone': zone,'url':href};
            fetch("https://www.popranking.com/subscriptions", {
                mode: "no-cors",
                body: JSON.stringify(params),
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                }
            }).then(function(e) {
                console.log(e);
                return;
            })

}



