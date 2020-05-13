import { Problem } from "./Problem";
import { Constants } from "./Constants";

export class ProblemCollection {
    private problemCollectionObject: {[x: number]: Problem};
    private activeProblemCount: number = 0;
    private completeProblemCount: number = 0;
    private totalProblemCount: number = 0;

    constructor(storageResult?: ChromeStorageResult) {
        this.problemCollectionObject = storageResult ? storageResult[Constants.STORAGE_PROBLEM_COLLECTION] : {};
        this.updateProblemCount();
    }

    getProblem(problemCode: number): Problem | undefined {
        return this.problemCollectionObject[problemCode];
    }

    addProblem(problem: Problem): Problem {
        this.problemCollectionObject[problem.code] = problem;
        this.updateProblemCount();
        return problem;
    }

    removeProblem(problemCode: number): Problem | null {
        let deletedProblem = this.problemCollectionObject[problemCode];
        delete this.problemCollectionObject[problemCode];
        this.updateProblemCount();
        return deletedProblem;
    }

    updateProblemCount(): void {
        let activeCount = 0, completeCount = 0, total = 0;
        for (let key in this.problemCollectionObject) {
            if (!this.problemCollectionObject.hasOwnProperty(key)) continue;
            if (this.problemCollectionObject[key].getStatus() === Constants.PROBLEM_STATUS_ACTIVE) activeCount++;
            if (this.problemCollectionObject[key].getStatus() === Constants.PROBLEM_STATUS_COMPLETE) completeCount++;
            total++;
        }
        this.activeProblemCount = activeCount;
        this.completeProblemCount = completeCount;
        this.totalProblemCount = total;
    }

    getActiveProblemCount(): number {
        return this.activeProblemCount;
    }

    getCompleteProblemCount(): number {
        return this.completeProblemCount;
    }

    getTotalProblemCount(): number {
        return this.totalProblemCount;
    }
}

export interface ChromeStorageResult {
    [Constants.STORAGE_PROBLEM_COLLECTION]: {[x: number]: Problem};
}
