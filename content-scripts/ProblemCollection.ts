import { Problem } from "./Problem";
import { Constants } from "./Constants";
import { Session } from "./Session";
import { ChromeStorageResult, ChromeStorageProblem, ChromeStorageProblemCollection, ChromeStorageSession } from "./ChromeStorageTypes";
import { ProblemUtils } from "./ProblemUtils";

export class ProblemCollection {
    private problemCollectionObject: Map<number, Problem>;
    private activeProblemCount: number = 0;
    private completeProblemCount: number = 0;
    private totalProblemCount: number = 0;

    constructor(storageResult?: ChromeStorageResult) {
        this.problemCollectionObject = storageResult ? this.contructProblemsMapFromChromeResult(storageResult) : new Map<number, Problem>();
        this.updateProblemCount();
    }

    getProblemCollectionObject(): Map<number, Problem> {
        return this.problemCollectionObject;
    }

    setProblemCollectionObject(storageResult: ChromeStorageResult): ProblemCollection {
        this.problemCollectionObject = this.contructProblemsMapFromChromeResult(storageResult);
        return this;
    }

    getProblem(problemCode: number): Problem | undefined {
        return this.problemCollectionObject.get(problemCode);
    }

    addProblem(problem: Problem): Problem {
        this.problemCollectionObject.set(problem.getCode(), problem);
        this.updateProblemCount();
        return problem;
    }

    removeProblem(problemCode: number): Problem | undefined {
        let deletedProblem = this.problemCollectionObject.get(problemCode);
        this.problemCollectionObject.delete(problemCode);
        this.updateProblemCount();
        return deletedProblem;
    }

    updateProblemCount(): void {
        let activeCount = 0, completeCount = 0, total = 0;

        for (let problem of this.problemCollectionObject.values()) {
            if (problem.isActive()) activeCount++;
            if (problem.isComplete()) completeCount++;
            total++;
        }
        
        this.activeProblemCount = activeCount;
        this.completeProblemCount = completeCount;
        this.totalProblemCount = total;
    }

    getActiveProblemCount(): number {
        this.updateProblemCount();
        return this.activeProblemCount;
    }

    getCompleteProblemCount(): number {
        this.updateProblemCount();
        return this.completeProblemCount;
    }

    getTotalProblemCount(): number {
        this.updateProblemCount();
        return this.totalProblemCount;
    }

    getChromeStorageCollection(): ChromeStorageProblemCollection {
        let csCollection: ChromeStorageProblemCollection = {};
        let problemUtils = new ProblemUtils();

        for (let problem of this.problemCollectionObject.values()) {
            csCollection[problem.getCode()] = problem.getChromeProblem();
        }

        return csCollection;
    }

    private contructProblemsMapFromChromeResult(storageResult: ChromeStorageResult): Map<number, Problem> {
        let chromeCollectionObject = storageResult[Constants.STORAGE_PROBLEM_COLLECTION];
        let pcObject = new Map<number, Problem>();

        for (let key in chromeCollectionObject) {
            if (!chromeCollectionObject.hasOwnProperty(key)) continue;

            let storageProblem = chromeCollectionObject[key];
            let problem = storageProblem.getProblem();

            pcObject.set(problem.getCode(), problem);
        }

        return pcObject;
    }
}


