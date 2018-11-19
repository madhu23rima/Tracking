import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Timeline';

  ngOnInit() {

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'hello!') {
          console.log(request.url) // new url is now in content scripts!
        }
      });
  }

  chromeConnect() {

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'hello!') {
          console.log(request.url) // new url is now in content scripts!
        }
      });


    // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    //   const port = chrome.tabs.connect(tabs[0].id, { name: "channelName" });
    //   port.postMessage({ url: tabs[0].url });
    // }    );
  }
}

