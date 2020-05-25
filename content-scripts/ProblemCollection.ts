import { Problem } from "./Problem";
import { Constants } from "./Constants";
import { Session } from "./Session";
import { ChromeStorageResult, ChromeStorageProblem, ChromeStorageProblemCollection, ChromeStorageSession, Converter } from "./ChromeStorageTypes";
import { ProblemUtils } from "./ProblemUtils";

export class ProblemCollection {
    private problemCollectionMap: Map<number, Problem>;

    constructor(storageResult?: ChromeStorageResult, converter?: Converter) {
        if (storageResult) {
            if (!storageResult[Constants.STORAGE_PROBLEM_COLLECTION]) throw new Error('Faulty StorageResult.');
            if (!converter) throw new Error('Provide a Converter implementation.');
            
            this.problemCollectionMap = converter.chromeCollectionToProblemCollectionMap(storageResult[Constants.STORAGE_PROBLEM_COLLECTION]);
        } else {
            this.problemCollectionMap = new Map<number, Problem>();
        }
    }

    getProblemCollectionMap(): Map<number, Problem> {
        return this.problemCollectionMap;
    }

    getProblem(problemCode: number): Problem | undefined {
        return this.problemCollectionMap.get(problemCode);
    }

    addProblem(problem: Problem): Problem {
        this.problemCollectionMap.set(problem.getCode(), problem);
        return problem;
    }

    removeProblem(problemCode: number): Problem | undefined {
        let deletedProblem = this.problemCollectionMap.get(problemCode);
        this.problemCollectionMap.delete(problemCode);
        return deletedProblem;
    }

    getActiveProblemCount(): number {
        let activeCount = 0;

        for (let problem of this.problemCollectionMap.values()) {
            if (problem.isActive()) activeCount++;
        }

        return activeCount;
    }

    getCompleteProblemCount(): number {
        let completeCount = 0;

        for (let problem of this.problemCollectionMap.values()) {
            if (problem.isComplete()) completeCount++;
        }

        return completeCount;
    }

    getNewProblemCount(): number {
        let newCount = 0;

        for (let problem of this.problemCollectionMap.values()) {
            if (problem.getStatus() === Constants.PROBLEM_STATUS_CREATED) newCount++;
        }

        return newCount;
    }

    getTotalProblemCount(): number {
        return this.problemCollectionMap.size;
    }

}