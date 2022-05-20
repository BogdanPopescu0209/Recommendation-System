chrome.browserAction.onClicked.addListener(function (tab) {

  chrome.browserAction.setPopup({ popup: 'index.html' });

})

let holiday = {

  holiday1: localStorage.holiday1,
  holiday2: localStorage.holiday2,
  holiday3: localStorage.holiday3

}

chrome.storage.sync.set({ key: holiday });

chrome.tabs.onUpdated.addListener((tab, selectInfo) => {

  if (selectInfo.url != undefined) {

    if (selectInfo.url.includes("holiday") && /^https:\/\/www.\google.com\/search/.test(selectInfo.url)) {

      chrome.tabs.insertCSS(null, { file: './style.css' });
      chrome.tabs.executeScript(null, { file: './foreground.js' });

    }

  }

})

chrome.runtime.onMessage.addListener((Request, sender, sendResponse) => {

  if (Request.message === 'Recommendations') {

    chrome.tabs.create({ url: chrome.extension.getURL('recommendations.html') });
  }

})

