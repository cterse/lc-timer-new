import { Constants } from "./Constants";
import { Problem } from "./Problem";
import { ChromeStorageProblem, ChromeStorageSession, ChromeStorageResult } from "./ChromeStorageTypes";
import { Session } from "./Session";

export class ProblemUtils {
    
    extractProblemHeaderTextFromContext(): string {
        try {
            return $( Constants.PROBLEM_TITLE_SELECTOR ).text();
        } catch(error) {
            throw error;
        }
    }

    private extractProblemCodeFromProblemHeaderString(problemHeader: string): number {
        if (!problemHeader.includes('.')) throw new Error('faulty input');
        return Number(problemHeader.split('.')[0].trim());
    }
    
    private extractProblemNameFromProblemHeaderString(problemHeader: string): string {
        if (!problemHeader.includes('.')) throw new Error('faulty input');
        return problemHeader.split('.')[1].trim();
    }
    
    extractProblemUrlFromContext(): URL {
        try {
            return new URL(location.href);
        } catch (error) {
            throw error;
        }
    }
    
    createProblemFromContext(): Problem {
        try {
            let problemHeader = this.extractProblemHeaderTextFromContext();
            let currentProblemName = this.extractProblemNameFromProblemHeaderString(problemHeader);
            let currentProblemCode = this.extractProblemCodeFromProblemHeaderString(problemHeader);
            let currentProblemUrl = this.extractProblemUrlFromContext();

            return new Problem(currentProblemCode, currentProblemName, currentProblemUrl, []);
        } catch (error) {
            throw error;
        }
    }

    createChromeStorageSession(id: string, status: string, initTs?: number, endTs?: number) {
        return {
            [Constants.STORAGE_SESSION_ID]: id,
            [Constants.STORAGE_SESSION_STATUS]: status,
            [Constants.STORAGE_SESSION_INIT_TS]: initTs,
            [Constants.STORAGE_SESSION_END_TS]: endTs
        };
    }    
    
}
