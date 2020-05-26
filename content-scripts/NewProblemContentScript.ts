import { Constants } from "./Constants";
import { ProblemCollection } from "./ProblemCollection";
import { ProblemUtils } from "./ProblemUtils";
import { ProblemConverter } from "./ProblemConverter";
import { ChromeStorageResult } from "./ChromeStorageTypes";

let pageInitInterval = setInterval(setupMonitoringScript, 100);

function setupMonitoringScript() {
    if ($(Constants.PROBLEM_TITLE_SELECTOR).length) {
        clearInterval(pageInitInterval);

        chrome.storage.sync.get([Constants.STORAGE_PROBLEM_COLLECTION], function(result: ChromeStorageResult){
            let currentTime = Date.now();
            
            if (!result) {
                console.error("lc-timer-new:problem-content : Error getting result from sync.");
                return null;
            }

            try {
                let problemUtils = new ProblemUtils();
                let converter = new ProblemConverter();
                let problemsCollection = null;
                let contextProblem = problemUtils.createProblemFromContext().start();
                let storageUpdated = false;

                if (result[Constants.STORAGE_PROBLEM_COLLECTION]) {
                    problemsCollection = new ProblemCollection(result, converter);
                } else {
                    problemsCollection = new ProblemCollection();
                }

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

                if(storageUpdated) {
                    let csStorageCollection = converter.problemCollectionMapToChromeCollection(problemsCollection.getProblemCollectionMap());
                    chrome.storage.sync.set({[Constants.STORAGE_PROBLEM_COLLECTION]:  csStorageCollection}, function(){
                        console.debug("lc-timer:problem-content : set data to storage.");
                    });
                }
            } catch (error) {
                console.error(error.message);
            }
        });
    }
}