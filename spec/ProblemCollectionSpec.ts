import { ProblemCollection } from "../content-scripts/ProblemCollection";
import { Problem } from "../content-scripts/Problem";
import { ChromeStorageResult, ChromeStorageProblem, ChromeStorageSession } from "../content-scripts/ChromeStorageTypes";
import { Constants } from "../content-scripts/Constants";
import { Session } from "../content-scripts/Session";
import { ProblemConverter } from "../content-scripts/ProblemConverter";

describe('Problem Collection Test Suite:', () => {
    var csSession1: ChromeStorageSession = null, csSession2: ChromeStorageSession = null;
    var csProblem: ChromeStorageProblem = null;
    var problem: Problem = null;
    var session1: Session = null, session2: Session = null;
    var pc: ProblemCollection = null;

    beforeEach(() => {
        pc = new ProblemCollection();

        csSession1 = {
            [Constants.STORAGE_SESSION_ID]: '1-1', 
            [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED
        };
        csSession2 = {
            [Constants.STORAGE_SESSION_ID]: '1-2', 
            [Constants.STORAGE_SESSION_STATUS]: Constants.SESSION_STATUS_CREATED
        };

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

    describe('ProblemCollection constructor', () => {
        it('should return an empty Map if called with no arguments', () => {
            expect(pc.getProblemCollectionMap().size).toBe(0);
        });

        it('should extract StorageProblems from the given StorageResult, convert them to Problem objects and add them to the collection Map', () => {
            let csResult: ChromeStorageResult = {
                [Constants.STORAGE_PROBLEM_COLLECTION]: {
                    [csProblem[Constants.STORAGE_PROBLEM_CODE]]: csProblem
                }
            }
            let map = new Map<number, Problem>();
            map.set(problem.getCode(), problem);

            let problemConverter = new ProblemConverter();
            spyOn(problemConverter, 'chromeCollectionToProblemCollectionMap').and.returnValue(map);

            let pc = new ProblemCollection(csResult, problemConverter);

            expect(pc.getTotalProblemCount()).toBe(1);
            expect(pc.getProblemCollectionMap().get(problem.getCode())).toEqual(problem);
            expect(problemConverter.chromeCollectionToProblemCollectionMap).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if a converter implementation is not provided if ChromeStorageResult is provided', () => {
            let csResult: ChromeStorageResult = {
                [Constants.STORAGE_PROBLEM_COLLECTION]: {
                    [csProblem[Constants.STORAGE_PROBLEM_CODE]]: csProblem
                }
            };
            let testFunc = function() { new ProblemCollection(csResult); };
            expect(testFunc).toThrowError();
        });
    });

    describe('removeProblem(code) method', () => {
        it('should delete the problem with provided code from collection map and return the deleted problem', () => {
            pc.addProblem(problem);

            let deletedProblem = pc.removeProblem(problem.getCode());

            expect(deletedProblem).toEqual(problem);
        });
        it('should return undefined if no problem matching the given code is present in the collection map', () => {
            
            expect(pc.removeProblem(1)).toBeUndefined();
        });
    });

    describe('getActiveProblemCount() method', () => {
        it('should return the number of active problems in the collection map', () => {
            problem.start();
            pc.addProblem(problem);
            pc.addProblem(new Problem(2, 'test', new URL('https://www.a.com'), []));

            expect(pc.getActiveProblemCount()).toBe(1);
            expect(pc.getTotalProblemCount()).toBe(2);
        });
    });

    describe('getCompletedProblemCount() method', () => {
        it('should return the number of completed problems in the collection map', () => {
            problem.start().complete();
            pc.addProblem(problem);
            pc.addProblem(new Problem(2, 'test', new URL('https://www.a.com'), []));

            expect(pc.getCompleteProblemCount()).toBe(1);
            expect(pc.getTotalProblemCount()).toBe(2);
        });
    });

    describe('getNewProblemCount() method', () => {
        it('should return the number of newly created problems in the collection map', () => {
            problem.start();
            pc.addProblem(problem);
            pc.addProblem(new Problem(2, 'test', new URL('https://www.a.com'), []));

            expect(pc.getNewProblemCount()).toBe(1);
            expect(pc.getTotalProblemCount()).toBe(2);
        });
    });

});