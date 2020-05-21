import { Constants } from "./Constants";
import { Problem } from "./Problem";
import { ChromeStorageProblem, ChromeStorageSession, ChromeStorageResult } from "./ChromeStorageTypes";
import { Session } from "./Session";

export class ProblemUtils {
    private extractProblemHeaderTextFromContext(): string | undefined {
        return $( Constants.PROBLEM_TITLE_SELECTOR )?.text();
    }

    private extractProblemCodeFromProblemHeaderString(problemHeader: string): number {
        if (!problemHeader.includes('.')) throw new Error('faulty input');
        return Number(problemHeader.split('.')[0].trim());
    }
    
    private extractProblemNameFromProblemHeaderString(problemHeader: string): string {
        if (!problemHeader.includes('.')) throw new Error('faulty input');
        return problemHeader.split('.')[1].trim();
    }
    
    private extractProblemUrlFromContext(): URL {
        try {
            return new URL(location.href);
        } catch(error) {
            throw error;
        }
    }
    
    createProblemFromContext(): Problem | null {
        let problemHeader = this.extractProblemHeaderTextFromContext();
        if (!problemHeader) return null;

        try {
            let currentProblemName = this.extractProblemNameFromProblemHeaderString(problemHeader);
            let currentProblemCode = this.extractProblemCodeFromProblemHeaderString(problemHeader);
            let currentProblemUrl = this.extractProblemUrlFromContext();

            return new Problem(currentProblemCode, currentProblemName, currentProblemUrl, []);
        } catch(error) {
            console.error('error getting problem details from context');
        } finally {
            return null;
        }
    }

    getProblemNameFromStorageProblem(storageProblem: ChromeStorageProblem): string {
        return storageProblem[Constants.STORAGE_PROBLEM_NAME];
    }

    getProblemCodeFromStorageProblem(storageProblem: ChromeStorageProblem): number {
        return storageProblem[Constants.STORAGE_PROBLEM_CODE];
    }

    getProblemUrlFromStorageProblem(storageProblem: ChromeStorageProblem): URL {
        return new URL(storageProblem[Constants.STORAGE_PROBLEM_URL]);
    }

    getProblemSessionListFromStorageProblem(storageProblem: ChromeStorageProblem): Array<Session> {
        let storageSessionList = storageProblem[Constants.STORAGE_PROBLEM_SESSION_LIST];
        return storageSessionList.map(this.getSessionFromStorageSession);
    }

    getSessionFromStorageSession(storageSession: ChromeStorageSession): Session {
        let sId = storageSession[Constants.STORAGE_SESSION_ID];
        let sInitTimestamp = storageSession[Constants.STORAGE_SESSION_INIT_TS];
        let sEndTimestamp = storageSession[Constants.STORAGE_SESSION_END_TS];
        
        return new Session(storageSession[Constants.STORAGE_SESSION_ID], sInitTimestamp, sEndTimestamp);
    }

    contructProblemsMapFromChromeResult(storageResult: ChromeStorageResult): Map<number, Problem> {
        let chromeCollectionObject = storageResult[Constants.STORAGE_PROBLEM_COLLECTION];
        let pcObject = new Map<number, Problem>();

        for (let key in chromeCollectionObject) {
            if (!chromeCollectionObject.hasOwnProperty(key)) continue;

            let storageProblem = chromeCollectionObject[key];
            let code = this.getProblemCodeFromStorageProblem(storageProblem);
            let name = this.getProblemNameFromStorageProblem(storageProblem);
            let url = this.getProblemUrlFromStorageProblem(storageProblem);
            let sessionsList = this.getProblemSessionListFromStorageProblem(storageProblem);
            let problem = new Problem(code, name, url, sessionsList);

            pcObject.set(problem.getCode(), problem);
        }

        return pcObject;
    }
}
