import { Constants } from "../content-scripts/Constants";
import { ProblemUtils } from "../content-scripts/ProblemUtils";
import { ChromeStorageProblem, ChromeStorageSession, ChromeStorageResult } from "../content-scripts/ChromeStorageTypes";
import { Session } from "../content-scripts/Session";

describe('ProblemUtils Test Suite', () => {
    var problemUtils = new ProblemUtils();

    xdescribe('ProblemUtils.extractProblemCodeFromProblemHeaderString() method', () => {
        it('should return an integer if the input string contains a period');
        it('should throw an error if the input string does not contain a period');
    });

    xdescribe('ProblemUtils.extractProblemNameFromProblemHeaderString() method', () => {
        it('should throw an error if the input does not contain a period');
        it('should return a string if the input contains a period');
    });

    xdescribe('ProblemUtils.extractProblemUrlFromContext() method', () => {
        it('should throw an error in case of any problems getting location.href');
        it('should return a URL object with location.href value as url');
    });

    describe('ProblemUtils.createProblemFromContext() method', () => {
        it('should extract the problem header string, extract the problem details from it and create and return a Problem object using those details');
        it('should extract the problem header string from context and return null if any issues with it');
        it('should extract problem details from the problem header and return null if any issue with any of the details');
    });

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

    describe('ProblemUtils.constructProblemsMapFromChromeResult() method', () => {
        it('should return a <Problem code: Problem> map of all the problems present in the Chrome Storage result', () => {
            let chromeRes: ChromeStorageResult = {
                [Constants.STORAGE_PROBLEM_COLLECTION]: {
                    '1': {
                        [Constants.STORAGE_PROBLEM_CODE]: 1,
                        [Constants.STORAGE_PROBLEM_NAME]: 'test-1',
                        [Constants.STORAGE_PROBLEM_URL]: 'https://www.google.com',
                        [Constants.STORAGE_PROBLEM_SESSION_LIST]: []
                    },
                    '2': {
                        [Constants.STORAGE_PROBLEM_CODE]: 2,
                        [Constants.STORAGE_PROBLEM_NAME]: 'test-2',
                        [Constants.STORAGE_PROBLEM_URL]: 'https://www.google.com',
                        [Constants.STORAGE_PROBLEM_SESSION_LIST]: []
                    }
                }
            };
            spyOn(problemUtils, 'getProblemCodeFromStorageProblem').and.returnValues(1, 2);
            spyOn(problemUtils, 'getProblemNameFromStorageProblem').and.returnValues('test-1', 'test-2');
            spyOn(problemUtils, 'getProblemUrlFromStorageProblem').and.returnValue(new URL('https://www.google.com'));
            spyOn(problemUtils, 'getProblemSessionListFromStorageProblem').and.returnValue([]);

            let problemsMap = problemUtils.contructProblemsMapFromChromeResult(chromeRes);

            expect(problemsMap.size).toBe(2);
            expect(problemUtils.getProblemCodeFromStorageProblem).toHaveBeenCalled();
            expect(problemUtils.getProblemNameFromStorageProblem).toHaveBeenCalled();
            expect(problemUtils.getProblemSessionListFromStorageProblem).toHaveBeenCalled();
            expect(problemUtils.getProblemUrlFromStorageProblem).toHaveBeenCalled();
            expect(problemsMap.get(1)).toBeDefined();
            expect(problemsMap.get(2)).toBeDefined();

        });
    });
});