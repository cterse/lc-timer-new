import { ProblemCollection } from "../content-scripts/ProblemCollection";
import { ProblemConverter } from "../content-scripts/ProblemConverter";
import { Constants } from "../content-scripts/Constants";
import { ChromeStorageSession, ChromeStorageProblem, ChromeStorageResult, ChromeStorageProblemCollection } from "../content-scripts/ChromeStorageTypes";
import { Session } from "../content-scripts/Session";
import { Problem } from "../content-scripts/Problem";

describe('Problem Converter Test Suite', () => {
    var convert = new ProblemConverter();
    var csSession1: ChromeStorageSession = null, csSession2: ChromeStorageSession = null;
    var csProblem: ChromeStorageProblem = null;
    var problem: Problem = null;
    var session1: Session = null, session2: Session = null;

    beforeEach(() => {
        csSession1 = {[Constants.STORAGE_SESSION_ID]: '1-1', [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED};
        csSession2 = {[Constants.STORAGE_SESSION_ID]: '1-2', [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED};

        csProblem = {
            [Constants.STORAGE_PROBLEM_CODE]: 1,
            [Constants.STORAGE_PROBLEM_NAME]: 'test',
            [Constants.STORAGE_PROBLEM_URL]: 'https://www.google.com',
            [Constants.STORAGE_PROBLEM_SESSION_LIST]: []
        };

        problem = new Problem(1, 'test', new URL('https://www.google.com'), []);

        session1 = new Session('1-1');
        session2 = new Session('1-2');
    });

    describe('problemToChromeStorageProblem() method', () => {
        it('should convert a Problem object to ChromStorageProblem object', () => {
            problem.setSesstionList([session1, session2]);

            let csProblem = convert.problemToChromeStorageProblem(problem);

            expect(csProblem[Constants.STORAGE_PROBLEM_CODE]).toBe(1);
            expect(csProblem[Constants.STORAGE_PROBLEM_NAME]).toBe('test');
            expect(csProblem[Constants.STORAGE_PROBLEM_URL]).toBe('https://www.google.com/');
            expect(csProblem[Constants.STORAGE_PROBLEM_SESSION_LIST][0][Constants.STORAGE_SESSION_ID]).toBe('1-1');
            expect(csProblem[Constants.STORAGE_PROBLEM_SESSION_LIST][0][Constants.STORAGE_SESSION_STATUS]).toBe(Constants.SESSION_STATUS_CREATED);
            expect(csProblem[Constants.STORAGE_PROBLEM_SESSION_LIST][1][Constants.STORAGE_SESSION_ID]).toBe('1-2');
            expect(csProblem[Constants.STORAGE_PROBLEM_SESSION_LIST][1][Constants.STORAGE_SESSION_STATUS]).toBe(Constants.SESSION_STATUS_CREATED);
        });
    });

    describe('chromeStorageProblemToProblem() method', () => {
        it('should create a Problem object from the provided ChromStorageProblem object', () => {
            csProblem[Constants.STORAGE_PROBLEM_SESSION_LIST] = [csSession1, csSession2];

            let problem: Problem = convert.chromeStorageProblemToProblem(csProblem);

            expect(problem.getCode()).toBe(1);
            expect(problem.getName()).toBe('test');
            expect(problem.getUrl()).toEqual(new URL('https://www.google.com'));
            expect(problem.getSessionList().length).toBe(2);
            expect(problem.getSessionList()[0].getId()).toBe('1-1');
            expect(problem.getSessionList()[0].getStatus()).toBe(Constants.SESSION_STATUS_CREATED);
            expect(problem.getSessionList()[1].getId()).toBe('1-2');
            expect(problem.getSessionList()[1].getStatus()).toBe(Constants.SESSION_STATUS_CREATED);
        });
    });

    describe('chromeStorageSessionToSession() method', () => {
        it('should convert the given ChromeStorageSession object to Session object', () => {
            let initTs = Date.now();
            let endTs = Date.now() + 10000;
            csSession1[Constants.STORAGE_SESSION_INIT_TS] = initTs;
            csSession1[Constants.STORAGE_SESSION_END_TS] = endTs;

            let session = convert.chromeStorageSessionToSession(csSession1);

            expect(session.getId()).toBe('1-1');
            expect(session.getStatus()).toBe(Constants.SESSION_STATUS_COMPLETE);
            expect(session.getInitTimestamp()).toBe(initTs);
            expect(session.getEndTimestamp()).toBe(endTs);
        });
    });

    describe('sessionToChromeStorageSession() method', () => {
        it('should convert the given Session object to ChromeStorageSession object', () => {
            let initTs = Date.now();
            let endTs = Date.now() + 10000;
            let s = new Session('1-1', initTs, endTs);

            let csSession = convert.sessionToChromeStorageSession(s);

            expect(csSession[Constants.STORAGE_SESSION_ID]).toBe('1-1');
            expect(csSession[Constants.STORAGE_SESSION_STATUS]).toBe(Constants.SESSION_STATUS_COMPLETE);
            expect(csSession[Constants.STORAGE_SESSION_INIT_TS]).toBe(initTs);
            expect(csSession[Constants.STORAGE_SESSION_END_TS]).toBe(endTs);

            s = new Session('1-2');
            csSession = convert.sessionToChromeStorageSession(s);

            expect(csSession[Constants.STORAGE_SESSION_ID]).toBe('1-2');
            expect(csSession[Constants.STORAGE_SESSION_STATUS]).toBe(Constants.SESSION_STATUS_CREATED);
            expect(csSession[Constants.STORAGE_SESSION_INIT_TS]).toBeUndefined();
            expect(csSession[Constants.STORAGE_SESSION_END_TS]).toBeUndefined();
        });
    });

    describe('chromeCollectionToProblemCollection() method', () => {
        it('should return a ProblemCollection object with a map of problems in the provided ChromeResult object', () => {
            csProblem[Constants.STORAGE_PROBLEM_SESSION_LIST] = [csSession1, csSession2];
            let chromeCollection: ChromeStorageProblemCollection = {
                '1': csProblem, '2': csProblem
            }
            let problemCollectionMap: Map<number, Problem> = convert.chromeCollectionToProblemCollectionMap(chromeCollection);

            expect(problemCollectionMap.size).toBe(1);
            expect(problemCollectionMap.get(1)).toBeDefined();
            expect(problemCollectionMap.get(1).getSessionList().length).toBe(2);
        });
    });

    describe('problemCollectionToChromeCollection() method', () => {
        it('should take an object of problemCollection and return ChromeStorageProblemCollection object', () => {
            let pcMap = new Map<number, Problem>();
            pcMap.set(problem.getCode(), problem);

            let csProblemCollection: ChromeStorageProblemCollection = convert.problemCollectionMapToChromeCollection(pcMap);

            expect(csProblemCollection['1'][Constants.STORAGE_PROBLEM_CODE]).toBe(1);
            expect(csProblemCollection['1'][Constants.STORAGE_PROBLEM_NAME]).toBe('test');
            expect(csProblemCollection['1'][Constants.STORAGE_PROBLEM_URL]).toBe('https://www.google.com/');
            expect(csProblemCollection['1'][Constants.STORAGE_PROBLEM_SESSION_LIST]).toEqual([]);
        });
    });
});