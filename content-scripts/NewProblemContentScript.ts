import { Constants } from "./Constants";
import { ProblemCollection } from "./ProblemCollection";
import { ProblemUtils } from "./ProblemUtils";
import { ChromeStorageResult } from "./ChromeStorageTypes";

let pageInitInterval = setInterval(setupMonitoringScript, 100);

function setupMonitoringScript() {
    if ($(Constants.PROBLEM_TITLE_SELECTOR).length) {
        clearInterval(pageInitInterval);

        chrome.storage.sync.get([Constants.STORAGE_PROBLEM_COLLECTION], function(result){
            let currentTime = Date.now();
            
            if (!result || !result[Constants.STORAGE_PROBLEM_COLLECTION]) {
                console.error("lc-timer-new:problem-content : Error getting result from sync.");
                return null;
            }
            
            let problemUtils = new ProblemUtils();
            let problemsCollection = new ProblemCollection(result);
            let storageUpdated = false;

            try {
                let contextProblem = problemUtils.createProblemFromContext().start();

                if (problemsCollection.getProblem(contextProblem.getCode())) {
                    let problem = problemsCollection.getProblem(contextProblem.getCode());
                    if (problem.isComplete()) {
                        console.debug("lc-timer:problem-content : Completed problem exists, starting a new session.");
                        problem.start(currentTime);
                        storageUpdated = true;
                    } else {
                        console.debug("lc-timer:problem-content : Problem already active.");
                    }
                } else {
                    console.debug("lc-timer-new:problem-content : Problem does not exist in storage, adding it.");
                    problemsCollection.addProblem(contextProblem);
                    storageUpdated = true;
                }
            } catch (error) {
                console.error(error.message);
            }
            
            if(storageUpdated) {
                chrome.storage.sync.set({[Constants.STORAGE_PROBLEM_COLLECTION]:  problemsCollection}, function(){
                    console.debug("lc-timer:problem-content : set data to storage.");
                    console.dir(problemsCollection);
                });
            }
        });
    }
}