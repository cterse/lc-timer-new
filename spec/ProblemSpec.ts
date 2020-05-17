import { Problem } from "../content-scripts/Problem";
import { Constants } from "../content-scripts/Constants";
import { Session } from "../content-scripts/Session";
import { ProblemUtils } from "../content-scripts/ProblemUtils";

describe('Problem Test Suite', () => {
    describe('Problem.start() method', () => {
        it('should throw an error if problem status is already active', () => {
            let activeSession = new Session('test-session', Date.now());
            let activeProblem = new Problem(1, 'test', new URL('https://test.com'), [activeSession]);

            expect(activeProblem.start).toThrowError();
        });
        it('add new active session with current or provided timestamp if problem is created or complete', () => {
            let problem = new Problem(1, 'test', new URL('https://test.com'), []);
            problem = problem.start();

            expect(problem.sessionsList.length).toBeGreaterThan(0);
            expect(problem.sessionsList[problem.sessionsList.length-1].getStatus()).toBe(Constants.SESSION_STATUS_ACTIVE);

            problem = new Problem(2, 'test', new URL('https://test.com'), []);
            problem = problem.start(Date.now());

            expect(problem.sessionsList.length).toBeGreaterThan(0);
            expect(problem.sessionsList[problem.sessionsList.length-1].getStatus()).toBe(Constants.SESSION_STATUS_ACTIVE);
        });
    });

    describe('Problem.complete() method', () => {
        it('should throw an error if problem status is not active', () => {
            let problem = new Problem(1, 'test', new URL('https://test.com'), []);
            spyOn(problem, 'getStatus').and.returnValues(Constants.PROBLEM_STATUS_CREATED, Constants.PROBLEM_STATUS_COMPLETE);
            expect(problem.complete).toThrowError();
            expect(problem.complete).toThrowError();
        });
        it('should complete the latest session of the problem with current or provided timestamp', () => {
            let session = new Session('test-session', Date.now());
            let problem = new Problem(1, 'test', new URL('https://test.com'), [session]);
            spyOn(problem, 'getStatus').and.returnValue(Constants.PROBLEM_STATUS_ACTIVE);

            problem.complete();
            
            expect(problem.sessionsList[problem.sessionsList.length-1].getId()).toBe('test-session');
            expect(problem.sessionsList[problem.sessionsList.length-1].getEndTimestamp()).not.toBeFalsy();
            expect(problem.sessionsList[problem.sessionsList.length-1].getStatus()).toBe(Constants.SESSION_STATUS_COMPLETE);

            session = new Session('test-session-2', Date.now());
            problem = new Problem(1, 'test', new URL('https://test.com'), [session]);
            spyOn(problem, 'getStatus').and.returnValue(Constants.PROBLEM_STATUS_ACTIVE);

            problem.complete();
            
            expect(problem.sessionsList[problem.sessionsList.length-1].getId()).toBe('test-session');
            expect(problem.sessionsList[problem.sessionsList.length-1].getEndTimestamp()).not.toBeFalsy();
            expect(problem.sessionsList[problem.sessionsList.length-1].getStatus()).toBe(Constants.SESSION_STATUS_COMPLETE);
        });
    });

    describe('Problem.getStatus() method', () => {
        it('should return "created" for a newly created problem', () => {
            let newProblem = new Problem(1, 'test', new URL('https://test.com'));

            expect(newProblem.getStatus()).toBe(Constants.PROBLEM_STATUS_CREATED);
        });
        it('should return "active" for a started problem', () => {
            let activeSession = new Session('test-session', Date.now());
            let activeProblem = new Problem(1, 'test', new URL('https://test.com'), [activeSession]);

            expect(activeProblem.getStatus()).toBe(Constants.PROBLEM_STATUS_ACTIVE);;
        });
        it('should return "active" for a completed problem', () => {
            let completeSession = new Session('test-session', Date.now(), Date.now());
            let completeProblem = new Problem(1, 'test', new URL('https://test.com'), [completeSession]);

            expect(completeProblem.getStatus()).toBe(Constants.PROBLEM_STATUS_COMPLETE);
        });
    });
});