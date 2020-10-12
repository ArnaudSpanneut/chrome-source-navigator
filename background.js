const GITHUB_URL = "https://*.github.com/*";
const urlRegex = RegExp(GITHUB_URL, "g");

const setUpScript = (tabId) => {
  chrome.tabs.executeScript(tabId, {
    file: "/setup.js",
  });
};

chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
  const { url } = tab;

  if (tabInfo.status !== "complete" || !urlRegex.test(url)) {
    return;
  }

  setUpScript(tabId);
});

chrome.tabs.query({ url: GITHUB_URL }, (tabs) => {
  tabs.forEach((tab) => setUpScript(tab.id));
});
