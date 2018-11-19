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

// chrome.tabs.onActivated.addListener(function(activeInfo) {
//   //console.log(activeInfo.url);
// });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log(tab.url);
  if (changeInfo.url) {
    chrome.runtime.sendMessage({message: changeInfo.url}, (response) => {
      console.log(response.message);
    });

    // chrome.tabs.sendMessage( tabId, {
    //   message: 'hello!',
    //   url: changeInfo.url
    // })
  }


});
