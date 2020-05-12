import { Constants } from "./Constants";
import { ProblemUtils } from "./problemUtils";
import { ProblemCollection, ChromeStorageResult } from "./ProblemCollection";

let pageInitInterval = setInterval(setupMonitoringScript, 100);

function setupMonitoringScript() {
    if ($(Constants.PROBLEM_TITLE_SELECTOR).length) {
        clearInterval(pageInitInterval);
        
        let problem = new ProblemUtils().createProblemFromContext();

        chrome.storage.sync.get([Constants.STORAGE_PROBLEM_COLLECTION], function(result: ChromeStorageResult){
            if (!result) {
                console.error("lc-timer-new:problem-content : Error getting result from sync.");
                return null;
            }
            
            let problemsCollection = new ProblemCollection(result);
            
            let storageUpdated = false;
            if (!problemsCollection.getProblem(problem.code)) {
                console.debug("lc-timer-new:problem=content : Problem does not exist in storage, adding it.");
                problemsCollection[prob_obj.code] = prob_obj;
                storageUpdated = true;
            } else {
                if (isProblemComplete(problemsCollection[prob_obj.code])) {
                    console.debug("lc-timer:problem=content : Completed problem exists, adding a new session.");
                    startNewSessionForProblem(problemsCollection[prob_obj.code]);
                    storageUpdated = true;
                } else {
                    console.debug("lc-timer:problem=content : Problem already active.");
                }
            }
            
            if(storageUpdated) {
                chrome.storage.sync.set({[constants.STORAGE_PROBLEM_COLLECTION]:  problemsCollection}, function(){
                    console.debug("lc-timer:problem=content : set data to storage.");
                    console.dir(problemsCollection);
                });
            }
        });
    }
}