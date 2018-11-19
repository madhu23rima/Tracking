import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Timeline';
  state = {
    traffic: {}
};
  ngOnInit() {

    // chrome.runtime.onMessage.addListener(
    //   function (request, sender, sendResponse) {
    //     // listen for messages sent from background.js
    //     if (request.message === 'hello!') {
    //       console.log(request.url) // new url is now in content scripts!
    //     }
    //   });
  }

  chromeConnect() {
    debugger;
    this.getCurrentTab((tab) => {
      chrome.runtime.sendMessage({type: 'popupInit', tabId: tab.id}, (response) => {
          if (response) {
              this.state = {
                  traffic: Object.assign(this.state.traffic, response)
              };
          }
      });

      console.log(this.state);
  });


  }

  getCurrentTab(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
    (tabs) => {
        callback(tabs[0]);
    });
}
}

