import { Constants } from "./Constants";
import { Problem } from "./Problem";
import { ChromeStorageProblem, ChromeStorageSession } from "./ChromeStorageTypes";
import { Session } from "./Session";

export class ProblemUtils {
    extractProblemCode(): number {
        return Number($( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[0].trim());
    }
    
    private extractProblemName(): string {
        return $( Constants.PROBLEM_TITLE_SELECTOR ).text().split('.')[1].trim();
    }
    
    private extractProblemUrl(): URL {
        return new URL(location.href);
    }
    
    createProblemFromContext(): Problem {
        return new Problem(this.extractProblemCode(), this.extractProblemName(), this.extractProblemUrl(), []);
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
}
