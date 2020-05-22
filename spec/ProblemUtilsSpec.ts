import { Constants } from "../content-scripts/Constants";
import { ProblemUtils } from "../content-scripts/ProblemUtils";
import { ChromeStorageProblem, ChromeStorageSession, ChromeStorageResult } from "../content-scripts/ChromeStorageTypes";
import { Session } from "../content-scripts/Session";

describe('ProblemUtils Test Suite', () => {
    var problemUtils = new ProblemUtils();

    describe('ProblemUtils.createProblemFromContext() method', () => {
        it('should extract the problem header string, extract the problem details from it and create and return a Problem object using those details', () => {
            spyOn(problemUtils, 'extractProblemHeaderTextFromContext').and.returnValue('1 . Two Sum');
            spyOn(problemUtils, 'extractProblemUrlFromContext').and.returnValue(new URL('https://www.google.com'));

            let problem = problemUtils.createProblemFromContext();

            expect(problem).not.toBeNull();
            expect(problem?.getCode()).toBe(1);
            expect(problem?.getName()).toBe('Two Sum');
            expect(problem?.getSessionList().length).toBe(0);
        });
        it('should extract the problem header string from context and return null if any issues with it', () => {
            spyOn(problemUtils, 'extractProblemHeaderTextFromContext').and.throwError('error');
            
            let problem = problemUtils.createProblemFromContext();
            
            expect(problem).toBeNull();
        });
        it('should extract the problem URL and return null if any issues with it', () => {
            let error = new Error('test detail error');
            spyOn(problemUtils, 'extractProblemHeaderTextFromContext').and.returnValue('1 . Two Sum');
            spyOn(problemUtils, 'extractProblemUrlFromContext').and.throwError(error);
            expect(problemUtils.createProblemFromContext()).toBeNull();
        });
        it('should extract the problem name and code from the header string and return null if any issues with them', () => {
            let problemHeaderString = 'problem header without a period in it';
            spyOn(problemUtils, 'extractProblemHeaderTextFromContext').and.returnValue(problemHeaderString);
            spyOn(problemUtils, 'extractProblemUrlFromContext').and.returnValue(new URL('https://www.google.com'));

            expect(problemUtils.createProblemFromContext()).toBeNull();
        });
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