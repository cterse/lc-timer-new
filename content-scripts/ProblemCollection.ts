import { Problem } from "./Problem";
import { Constants } from "./Constants";

export class ProblemCollection {
    private problemCollectionObject: ProblemCollectionObject;
    private activeProblemCount: number = 0;
    private completeProblemCount: number = 0;
    private totalProblemCount: number = 0;

    constructor(storageResult?: ChromeStorageResult) {
        debugger;
        this.problemCollectionObject = storageResult?.[Constants.STORAGE_PROBLEM_COLLECTION] ?? {};
        this.updateProblemCount();
    }

    getProblemCollectionObject(): ProblemCollectionObject {
        return this.problemCollectionObject;
    }

    setProblemCollectionObject(storageResult: ChromeStorageResult): ProblemCollection {
        this.problemCollectionObject = storageResult[Constants.STORAGE_PROBLEM_COLLECTION];
        return this;
    }

    getProblem(problemCode: number): Problem | undefined {
        return JSON.parse(this.problemCollectionObject[problemCode]);
    }

    addProblem(problem: Problem): Problem {
        this.problemCollectionObject[problem.code] = JSON.stringify(problem);
        this.updateProblemCount();
        return problem;
    }

    removeProblem(problemCode: number): Problem | null {
        let deletedProblem = this.problemCollectionObject[problemCode];
        delete this.problemCollectionObject[problemCode];
        this.updateProblemCount();
        return JSON.parse(deletedProblem);
    }

    updateProblemCount(): void {
        let activeCount = 0, completeCount = 0, total = 0;
        for (let key in this.problemCollectionObject) {
            if (!this.problemCollectionObject.hasOwnProperty(key)) continue;
            let problemObj = this.problemCollectionObject[key];
            let problem: Problem = problemObj;
            if (problem.getStatus() === Constants.PROBLEM_STATUS_ACTIVE) activeCount++;
            if (problem.getStatus() === Constants.PROBLEM_STATUS_COMPLETE) completeCount++;
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
    [key: string]: any;
}

export interface ProblemCollectionObject {
    [key: number]: any;
}
