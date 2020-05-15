import { Constants } from "./content-scripts/Constants"

chrome.runtime.onInstalled.addListener(function(details) {
    let CLEAR_STORAGE_ON_UPDATE = false;
    let ADVANCE_PROBLEM_ACTIVE_TIME = false;
    let ADVANCE_PROBLEM_TIME_OBJ = {d:120, h:1, m:0, s:0};
    
    alert(Constants.PROBLEM_TITLE_SELECTOR);
});
