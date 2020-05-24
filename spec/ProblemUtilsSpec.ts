import { Constants } from "../content-scripts/Constants";
import { ProblemUtils } from "../content-scripts/ProblemUtils";
import { ChromeStorageProblem, ChromeStorageSession, ChromeStorageResult } from "../content-scripts/ChromeStorageTypes";
import { Session } from "../content-scripts/Session";

describe('ProblemUtils Test Suite', () => {
    var problemUtils = new ProblemUtils();

    describe('createChromeSession() method', () => {
        it('should return a ChromeStorageSession object from the given input details', () => {
            let id = '1-1';
            let status = Constants.SESSION_STATUS_COMPLETE;
            let initTs = Date.now();
            let endTs = Date.now() + 10000000;

            let csSession = problemUtils.createChromeStorageSession(id, status, initTs, endTs);

            expect(csSession[Constants.STORAGE_SESSION_ID]).toBe(id);
            expect(csSession[Constants.STORAGE_SESSION_STATUS]).toBe(status);
            expect(csSession[Constants.STORAGE_SESSION_INIT_TS]).toBe(initTs);
            expect(csSession[Constants.STORAGE_SESSION_END_TS]).toBe(endTs);
        });

        it('should return a ChromeStorageSession object with undefined init and/or end timestamps if either of them are not provided', () => {
            let id = '1-1';
            let status = Constants.SESSION_STATUS_COMPLETE;

            let csSession = problemUtils.createChromeStorageSession(id, status);

            expect(csSession[Constants.STORAGE_SESSION_ID]).toBe(id);
            expect(csSession[Constants.STORAGE_SESSION_STATUS]).toBe(status);
            expect(csSession[Constants.STORAGE_SESSION_INIT_TS]).toBeUndefined();
            expect(csSession[Constants.STORAGE_SESSION_END_TS]).toBeUndefined();
        });
    });

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
        it('should extract the problem header string from context and throw and error if any issues with it', () => {
            spyOn(problemUtils, 'extractProblemHeaderTextFromContext').and.throwError('error');
            expect(problemUtils.createProblemFromContext).toThrowError();
        });
        it('should extract the problem URL and throw an error if any issues with it', () => {
            let error = new Error('test detail error');
            spyOn(problemUtils, 'extractProblemHeaderTextFromContext').and.returnValue('1 . Two Sum');
            spyOn(problemUtils, 'extractProblemUrlFromContext').and.throwError(error);
            expect(problemUtils.createProblemFromContext).toThrowError();
        });
        it('should extract the problem name and code from the header string and throw error if any issues with them', () => {
            let problemHeaderString = 'problem header without a period in it';
            spyOn(problemUtils, 'extractProblemHeaderTextFromContext').and.returnValue(problemHeaderString);
            spyOn(problemUtils, 'extractProblemUrlFromContext').and.returnValue(new URL('https://www.google.com'));
            expect(problemUtils.createProblemFromContext).toThrowError();
        });
    });

});