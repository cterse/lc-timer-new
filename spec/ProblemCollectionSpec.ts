import { ProblemCollection } from "../content-scripts/ProblemCollection";
import { Problem } from "../content-scripts/Problem";
import { ChromeStorageResult } from "../content-scripts/ChromeStorageTypes";

describe('Problem Collection Test Suite:', () => {
    describe('ProblemCollection constructor', () => {
        it('should return an empty Map if called with no arguments', () => {
            let pc = new ProblemCollection();
            expect(pc.getProblemCollectionObject().size).toBe(0);
        });

        it('should extract StorageProblems from the given StorageResult, convert them to Problem objects and add them to the collection Map');
    });

    describe('getProblem(code) method', () => {
        it('should return the problem object having the provided code');
        it('should return undefined if code does not match a problem in collection');
    });

    describe('addProblem(problem) method', () => {
        it('should insert the given problem in the collection Map against its problem code');
    });

    describe('removeProblem(code) method', () => {
        it('should delete the problem with provided code from collection map and return the deleted problem');
        it('should return null if no problem matching the given code is present in the collection map');
    });

    describe('getActiveProblemCount() method', () => {
        it('should return the number of active problems in the collection map');
    });

    describe('getCompletedProblemCount() method', () => {
        it('should return the number of completed problems in the collection map');
    });

    describe('getNewProblemCount() method', () => {
        it('should return the number of newly created problems in the collection map');
    });

    describe('getTotalProblemCount() method', () => {
        it('should return the number of all problems in the collection map');
    });

    describe('getChromeStorageCollection() method', () => {
        it('should create a ChromeStorageCollection object using the collection map')
    });

    describe('setStorageCollection(storageResult) method', () => {
        it('should extract StorageProblems from the given StorageResult, convert them to Problem objects and add them to the collection Map');
    });
});