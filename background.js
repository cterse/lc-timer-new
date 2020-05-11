chrome.runtime.onInstalled.addListener(function (details) {
    var CLEAR_STORAGE_ON_UPDATE = false;
    var ADVANCE_PROBLEM_ACTIVE_TIME = false;
    var ADVANCE_PROBLEM_TIME_OBJ = { d: 120, h: 1, m: 0, s: 0 };
    if (CLEAR_STORAGE_ON_UPDATE) {
        console.log("Clearing sync storage...");
        chrome.storage.sync.clear();
        console.log("sync storage cleared.");
    }
});
