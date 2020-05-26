import { Constants } from "./Constants";
import { ChromeStorageResult } from "./ChromeStorageTypes";
import { ProblemUtils } from "./ProblemUtils";
import { ProblemConverter } from "./ProblemConverter";
import { ProblemCollection } from "./ProblemCollection";

let submitButtonInterval = setInterval(setupSubmitScript, 100);

function setupSubmitScript() {
    if ($(Constants.SUBMIT_BUTTON_SELECTOR).length) {
        clearInterval(submitButtonInterval);

        $(Constants.SUBMIT_BUTTON_SELECTOR).click( function() {
            let submissionProcessingInterval = setInterval(validateSubmissionAndProceed, 100);
        
            function validateSubmissionAndProceed() {
                let currentTimestamp = Date.now();

                if ($(Constants.SUBMISSION_SUCCESS_DIV_CLASS_SELECTOR).length) {
                    clearInterval(submissionProcessingInterval);
                    console.debug("lc-timer:setupSubmitScript: Submission Success. Adding end timestamp.");

                    try {
                        chrome.storage.sync.get([Constants.STORAGE_PROBLEM_COLLECTION], function(result: ChromeStorageResult) {
                            if (!result || !result[Constants.STORAGE_PROBLEM_COLLECTION]) {
                                console.error("lc-timer:setupSubmitScript: Error retrieving problems from storage.");
                                return null;
                            }
                            
                            let problemUtils = new ProblemUtils();
                            let problemConverter = new ProblemConverter();
                            let problemCollection = new ProblemCollection(result, problemConverter);
                            let contextProblem = problemUtils.createProblemFromContext();
    
                            if (problemCollection.getProblem(contextProblem.getCode())) {
                                problemCollection.getProblem(contextProblem.getCode()).complete(currentTimestamp);
                                
                                let csProblemCollection = problemConverter.problemCollectionMapToChromeCollection(problemCollection.getProblemCollectionMap());
                                chrome.storage.sync.set({[Constants.STORAGE_PROBLEM_COLLECTION]: csProblemCollection}, function () {
                                    console.debug("lc-timer:setupSubmitScript: Added end timestamp to problem.");
                                });    
                            } else {
                                // User has cleared the problem before submission, and then submitted successfully before reloading the problem.
                                console.debug('lc-timer:setupSubmitScript: Problem '+contextProblem.getCode()+' not found in storage. Maybe user cleared it.');
                            }
    
                        });
                    } catch(error) {
                        console.error(error.message);
                    }
                }
            }
        });
    }
}