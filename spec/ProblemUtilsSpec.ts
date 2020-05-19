import { Constants } from "../content-scripts/Constants";
import { ProblemUtils } from "../content-scripts/ProblemUtils";
import { ChromeStorageProblem, ChromeStorageSession } from "../content-scripts/ChromeStorageTypes";
import { Session } from "../content-scripts/Session";

describe('ProblemUtils Test Suits', () => {
    var problemUtils = new ProblemUtils();

    describe('ProblemUtils.getSessionFromStorageSession() method', () => {
        it('should return a Session object given a ChromeStorageSession object', () => {
            let ts = Date.now();
            let storageSession: ChromeStorageSession = {
                [Constants.STORAGE_SESSION_ID]: '1-1',
                [Constants.STORAGE_SESSION_INIT_TS]: ts,
                [Constants.STORAGE_SESSION_END_TS]: ts+1000,
                [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_COMPLETE
            }

            let session = problemUtils.getSessionFromStorageSession(storageSession);

            expect(session.getId()).toBe('1-1');
            expect(session.getInitTimestamp()).toBe(ts);
            expect(session.getEndTimestamp()).toBe(ts+1000);
            expect(session.getStatus()).toBe(Constants.SESSION_STATUS_COMPLETE);
        });
    });

    describe('ProblemUtils.getProblemSessionListFromStorageProblem() method', () => {
        it('should return an array of Sessions from the storage problem\'s session array', () => {
            let storageSessionList: Array<ChromeStorageSession> = [
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
                expect(s).toEqual(jasmine.any(Session));
                expect(s.getId()).toBe('1-'+(i+1));
            }
        });
    });
});