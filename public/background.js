try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      chrome.tabs.sendMessage(tabId, {
        message: "TabUpdated",
      });
    }
  });

  chrome.webNavigation.onCompleted.addListener(
    (evt) => {
      chrome.tabs.sendMessage(evt.tabId, {
        message: "WebNavigationCompleted",
      });
    },
    {
      url: [{ hostContains: "milb.com" }],
    }
  );
} catch (e) {
  console.log("Error from Extension: ", e);
}
