const GITHUB_URL = "https://*.github.com/*";

const setUpScript = (tabId) => {
  chrome.tabs.executeScript(tabId, {
    file: "/setup.js",
  });
};

chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
  const { url } = tab;
  const isGithubUrl = /https:\/\/github\.com\/.*/i.test(url);

  if (tabInfo.status === "complete") {
    console.log(isGithubUrl);
    console.dir(url);
  }
  if (tabInfo.status !== "complete" || !isGithubUrl) {
    return;
  }

  setUpScript(tabId);
});

chrome.tabs.query({ url: GITHUB_URL }, (tabs) => {
  tabs.forEach((tab) => setUpScript(tab.id));
});
