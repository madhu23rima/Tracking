(function () {
  const tabStorage = {};
  const networkFilters = {
    urls: [
      "*://sirius.test.titlex.com.au/*"
    ]
  };

  chrome.webRequest.onBeforeRequest.addListener((details) => {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId)) {
      return;
    }

    console.log('tab id:' + tabId);
    console.log('onBeforeRequest:' + requestId);
    tabStorage[tabId].requests[requestId] = {
      requestId: requestId,
      url: details.url,
      startTime: details.timeStamp,
      status: 'pending'
    };
    console.log(tabStorage[tabId].requests[requestId]);
  }, networkFilters);

  chrome.webRequest.onCompleted.addListener((details) => {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
      return;
    }

    const request = tabStorage[tabId].requests[requestId];
    console.log('tab id:' + tabId);
    console.log('onCompleted:' + requestId);

    Object.assign(request, {
      endTime: details.timeStamp,
      requestDuration: details.timeStamp - request.startTime,
      status: 'complete'
    });
    console.log(tabStorage[tabId].requests[details.requestId]);
  }, networkFilters);

  chrome.webRequest.onErrorOccurred.addListener((details) => {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
      return;
    }

    const request = tabStorage[tabId].requests[requestId];
    Object.assign(request, {
      endTime: details.timeStamp,
      status: 'error',
    });
    console.log(tabStorage[tabId].requests[requestId]);
  }, networkFilters);

  chrome.tabs.onActivated.addListener((tab) => {
    console.log(tab.url);
    const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
    if (!tabStorage.hasOwnProperty(tabId)) {
      tabStorage[tabId] = {
        id: tabId,
        requests: {},
        registerTime: new Date().getTime()
      };
    }
  });

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log(tab.url);
    if (changeInfo.url) {
      chrome.runtime.sendMessage({ message: changeInfo.url }, (response) => {
        console.log(response.message);
      });

      // chrome.tabs.sendMessage( tabId, {
      //   message: 'hello!',
      //   url: changeInfo.url
      // })
    }
  });



  chrome.tabs.onRemoved.addListener((tab) => {
    const tabId = tab.tabId;
    if (!tabStorage.hasOwnProperty(tabId)) {
      return;
    }
    tabStorage[tabId] = null;
  });

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    switch (msg.type) {
      case 'popupInit':
        response(tabStorage[msg.tabId]);
        break;
      default:
        response('unknown request');
        break;
    }
  });


}());
