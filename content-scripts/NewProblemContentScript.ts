import { Constants } from "./Constants";
import { ProblemCollection, ChromeStorageResult } from "./ProblemCollection";
import { ProblemUtils } from "./problemUtils";

let pageInitInterval = setInterval(setupMonitoringScript, 100);

function setupMonitoringScript() {
    if ($(Constants.PROBLEM_TITLE_SELECTOR).length) {
        clearInterval(pageInitInterval);

        chrome.storage.sync.get([Constants.STORAGE_PROBLEM_COLLECTION], function(result: ChromeStorageResult){
            if (!result) {
                console.error("lc-timer-new:problem-content : Error getting result from sync.");
                return null;
            }
            
            let problemUtils = new ProblemUtils();
            let problemsCollection = new ProblemCollection(result);
            let currentProblemCode = problemUtils.extractProblemCode();
            let storageUpdated = false;
            let currentTime = Date.now();

            if (!problemsCollection.getProblem(currentProblemCode)) {
                console.debug("lc-timer-new:problem-content : Problem does not exist in storage, adding it.");
                let problem = problemUtils.createProblemFromContext().start(currentTime);
                problemsCollection.addProblem(problem);
                storageUpdated = true;
            } else {
                let problem = problemsCollection.getProblem(currentProblemCode);
                if (problem?.isComplete()) {
                    console.debug("lc-timer:problem-content : Completed problem exists, starting a new session.");
                    problem.startNewSession(currentTime);
                    storageUpdated = true;
                } else {
                    console.debug("lc-timer:problem=content : Problem already active.");
                }
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