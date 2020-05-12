import { Problem } from "./Problem";
import { Constants } from "./Constants";

export class ProblemCollection {
    private problemCollectionObject: {[x: number]: Problem};

    constructor(storageResult?: ChromeStorageResult) {
        this.problemCollectionObject = {};
        if (storageResult) this.problemCollectionObject = storageResult[Constants.STORAGE_PROBLEM_COLLECTION];
    }

    getProblem(problemCode: number): Problem | null {
        if (!problemCode || !this.problemCollectionObject[problemCode]) return null;
        return this.problemCollectionObject[problemCode];
    }

    addProblem(problem: Problem): Problem | null {
        if (!problem || !problem.code) return null;
        this.problemCollectionObject[problem.code] = problem;
        return problem;
    }

    removeProblem(problemCode: number): Problem | null {
        if (!problemCode || !this.problemCollectionObject[problemCode]) return null;
        let deletedProblem = this.problemCollectionObject[problemCode];
        delete this.problemCollectionObject[problemCode]
        return deletedProblem;
    }
}

export interface ChromeStorageResult {
    [x: string]: {[y: number]: Problem};
}
