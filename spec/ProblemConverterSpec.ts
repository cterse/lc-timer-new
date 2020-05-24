import { ProblemConverter } from "../content-scripts/ProblemConverter";
import { Constants } from "../content-scripts/Constants";
import { ChromeStorageSession, ChromeStorageProblem } from "../content-scripts/ChromeStorageTypes";
import { Session } from "../content-scripts/Session";
import { Problem } from "../content-scripts/Problem";

describe('Problem Converter Test Suite', () => {
    var convert = new ProblemConverter();

    describe('problemToChromeStorageProblem() method', () => {
        it('should convert a Problem object to ChromStorageProblem object', () => {
            let p = new Problem(1, 'test', new URL('https://www.google.com'), [new Session('1-1'), new Session('1-2')]);
            let csSession1: ChromeStorageSession = {[Constants.STORAGE_SESSION_ID]: '1-1', [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED};
            let csSession2: ChromeStorageSession = {[Constants.STORAGE_SESSION_ID]: '1-2', [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED};
            spyOn(convert, 'sessionToChromeStorageSession').and.returnValues(csSession1, csSession2);

            let csProblem = convert.problemToChromeStorageProblem(p);

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
            let csSession1: ChromeStorageSession = {[Constants.STORAGE_SESSION_ID]: '1-1', [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED};
            let csSession2: ChromeStorageSession = {[Constants.STORAGE_SESSION_ID]: '1-2', [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED};
            let csProblem: ChromeStorageProblem = {
                [Constants.STORAGE_PROBLEM_CODE]: 1,
                [Constants.STORAGE_PROBLEM_NAME]: 'test',
                [Constants.STORAGE_PROBLEM_URL]: 'https://www.google.com',
                [Constants.STORAGE_PROBLEM_SESSION_LIST]: [csSession1, csSession2]
            };
            spyOn(convert, 'chromeStorageSessionToSession').and.returnValues(new Session('1-1'), new Session('1-2'));

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
            let csSession = {
                [Constants.STORAGE_SESSION_ID]: '1-1',
                [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_COMPLETE,
                [Constants.STORAGE_SESSION_INIT_TS]: initTs,
                [Constants.STORAGE_SESSION_END_TS]: endTs
            };

            let session = convert.chromeStorageSessionToSession(csSession);

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

    describe('chromeCollectionToProblemCollection() method', () => {});

    describe('problemCollectionToChromeCollection() method', () => {});
});