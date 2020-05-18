import { Constants } from "../content-scripts/Constants";
import { ProblemUtils } from "../content-scripts/ProblemUtils";
import { ChromeStorageProblem } from "../content-scripts/ChromeStorageTypes";

describe('ProblemUtils Test Suits', () => {
    var problemUtils = new ProblemUtils();

    describe('ProblemUtils.getProblemSessionListFromStorageProblem() method', () => {
        it('should return an array of Sessions from the storage problem\'s session array', () => {
            let storageSessionList = [
                {
                    [Constants.STORAGE_SESSION_ID]: '1-1',
                    [Constants.STORAGE_SESSION_INIT_TS]: Date.now(),
                    [Constants.STORAGE_SESSION_END_TS]: Date.now()+1000,
                    [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_COMPLETE
                }, 
                {
                    [Constants.STORAGE_SESSION_ID]: '1-2',
                    [Constants.STORAGE_SESSION_INIT_TS]: Date.now(),
                    [Constants.STORAGE_SESSION_END_TS]: Date.now()+1000,
                    [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_COMPLETE
                }, 
                {
                    [Constants.STORAGE_SESSION_ID]: '1-3',
                    [Constants.STORAGE_SESSION_INIT_TS]: Date.now(),
                    [Constants.STORAGE_SESSION_END_TS]: Date.now()+1000,
                    [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_COMPLETE
                }
            ];
            let storageProblem: ChromeStorageProblem = {
                [Constants.STORAGE_PROBLEM_CODE]: 1, 
                [Constants.STORAGE_PROBLEM_NAME]: 'test',
                [Constants.STORAGE_PROBLEM_URL]: 'test-url',
                [Constants.STORAGE_PROBLEM_SESSION_LIST]: storageSessionList
            };

            let sessionList = problemUtils.getProblemSessionListFromStorageProblem(storageProblem);

            for (var i=0; i<sessionList.length; i++) {
                let s = sessionList[i];
                console.log(typeof s);
            }
        });
    });
});