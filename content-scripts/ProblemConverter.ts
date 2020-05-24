import { ChromeStorageSession, ChromeStorageProblem, ChromeStorageProblemCollection, Converter } from "./ChromeStorageTypes";
import { Session } from "./Session";
import { Constants } from "./Constants";
import { Problem } from "./Problem";
import { ProblemCollection } from "./ProblemCollection";

export class ProblemConverter implements Converter {
    problemCollectionMapToChromeCollection(pcMap: Map<number, Problem>): ChromeStorageProblemCollection {
        let csCollection: ChromeStorageProblemCollection = {};

        for (let problem of pcMap.values()) {
            csCollection[problem.getCode()] = this.problemToChromeStorageProblem(problem);
        }

        return csCollection;
    }

    chromeCollectionToProblemCollectionMap(chromeCollection: ChromeStorageProblemCollection): Map<number, Problem> {
        let pcMap = new Map<number, Problem>();

        for (var key in chromeCollection) {
            if (!chromeCollection.hasOwnProperty(key)) continue;

            let problem = this.chromeStorageProblemToProblem(chromeCollection[key]);
            pcMap.set(problem.getCode(), problem);
        }

        return pcMap;
    }

    chromeStorageProblemToProblem(csProblem: ChromeStorageProblem): Problem {
        let sessionList: Session[] = this.getSessionListFromChromeProblem(csProblem);
        return new Problem(csProblem[Constants.STORAGE_PROBLEM_CODE], 
                            csProblem[Constants.STORAGE_PROBLEM_NAME], 
                            new URL(csProblem[Constants.STORAGE_PROBLEM_URL]), 
                            sessionList);
    }
    
    private getSessionListFromChromeProblem(csProblem: ChromeStorageProblem): Session[] {
        let sessionList: Session[] = [];

        csProblem[Constants.STORAGE_PROBLEM_SESSION_LIST].forEach(csSession => {
            sessionList.push(this.chromeStorageSessionToSession(csSession));
        });

        return sessionList;
    }

    problemToChromeStorageProblem(p: Problem): ChromeStorageProblem {
        let csSessionList = this.getChromeProblemSessionList(p);

        return {
            [Constants.STORAGE_PROBLEM_CODE]: p.getCode(),
            [Constants.STORAGE_PROBLEM_NAME]: p.getName(),
            [Constants.STORAGE_PROBLEM_URL]: p.getUrl().toString(),
            [Constants.STORAGE_PROBLEM_SESSION_LIST]: csSessionList
        };
    }

    private getChromeProblemSessionList(problem: Problem): ChromeStorageSession[] {
        let csSessionList: ChromeStorageSession[] = [];

        problem.getSessionList().forEach(session => {
            csSessionList.push(this.sessionToChromeStorageSession(session));
        });

        return csSessionList;
    }

    sessionToChromeStorageSession(session: Session): ChromeStorageSession {
        return {
            [Constants.STORAGE_SESSION_ID]: session.getId(),
            [Constants.STORAGE_SESSION_STATUS]: session.getStatus(),
            [Constants.STORAGE_SESSION_INIT_TS]: session.getInitTimestamp(),
            [Constants.STORAGE_SESSION_END_TS]: session.getEndTimestamp()
        };
    }

    chromeStorageSessionToSession(csSession: ChromeStorageSession): Session {
        let session = new Session(csSession[Constants.STORAGE_SESSION_ID], 
                                    csSession[Constants.STORAGE_SESSION_INIT_TS], 
                                    csSession[Constants.STORAGE_SESSION_END_TS]);

        return session;
    }
}