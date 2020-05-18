import { Problem } from "./Problem";
import { Constants } from "./Constants";
import { Session } from "./Session";
import { ChromeStorageResult, ChromeStorageProblem } from "./ChromeStorageTypes";
import { ProblemUtils } from "./ProblemUtils";

interface ProblemCollectionObject {
    [key: string]: Problem;
}

export class ProblemCollection {
    private problemCollectionObject: ProblemCollectionObject;
    private activeProblemCount: number = 0;
    private completeProblemCount: number = 0;
    private totalProblemCount: number = 0;

    constructor(storageResult?: ChromeStorageResult) {
        this.problemCollectionObject = storageResult ? this.contructCollectionObjectFromChromeResult(storageResult) : {};
    }

    private contructCollectionObjectFromChromeResult(storageResult: ChromeStorageResult): ProblemCollectionObject {
        let chromeCollectionObject = storageResult[Constants.STORAGE_PROBLEM_COLLECTION];
        let pcObject: ProblemCollectionObject = {};
        let problemUtils = new ProblemUtils();

        for (let key in chromeCollectionObject) {
            if (!chromeCollectionObject.hasOwnProperty(key)) continue;

            let storageProblem = chromeCollectionObject[key];
            let code: number = problemUtils.getProblemCodeFromStorageProblem(storageProblem);
            let name: string = problemUtils.getProblemNameFromStorageProblem(storageProblem);
            let url: URL = problemUtils.getProblemUrlFromStorageProblem(storageProblem);
            let sessionsList: Array<Session> = problemUtils.getProblemSessionListFromStorageProblem(storageProblem);
            let problem = new Problem(code, name, url, sessionsList);

            pcObject[problem.getCode()] = problem;
        }

        return pcObject;
    }

    getProblemCollectionObject(): ProblemCollectionObject {
        return this.problemCollectionObject;
    }

    setProblemCollectionObject(storageResult: ChromeStorageResult): ProblemCollection {
    }

    getProblem(problemCode: number): Problem | undefined {
        return this.problemCollectionObject[problemCode];
    }

    addProblem(problem: Problem): Problem {
        this.problemCollectionObject[problem.getCode()] = problem;
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


