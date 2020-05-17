import { Session } from "./Session";
import { Constants } from "./Constants";
import { ProblemUtils } from "./ProblemUtils";

export class Problem {
    private code: number;
    private name: string;
    private url: URL;
    private sessionsList: Array<Session>;

    constructor(code: number, name: string, url: URL, sessionList: Array<Session> = []) {
        this.code = code;
        this.name = name;
        this.url = url;
        this.sessionsList = sessionList;
    }

    start(startTimestamp: number = Date.now()): Problem {
        if (this.getStatus() !== Constants.PROBLEM_STATUS_CREATED) throw new Error("Attempt to start a " + this.getStatus() + " problem");
        
        return this.startNewSession(startTimestamp);
    }

    private startNewSession(startTimestamp: number = Date.now()): Problem {
        let newSession = new Session(this.getNewSessionId()).start(startTimestamp);
        
        return this.addSession(newSession);
    }

    private getNewSessionId(): string {
        return this.code + '-' + (this.sessionsList.length + 1).toString();
    }

    private addSession(session: Session): Problem {
        this.sessionsList.push(session);
        
        return this;
    }

    complete(endTimestamp: number = Date.now()): Problem {
        if (this.getStatus() !== Constants.PROBLEM_STATUS_ACTIVE) throw new Error("Attempt to complete a " + this.getStatus() + " problem");
        let completedSession = this.getLatestSession()?.complete(endTimestamp) ?? undefined;
        if (!completedSession) throw new Error("Problem session list empty");
        
        return this;
    }

    getStatus(): string {
        return this.getLatestSession()?.getStatus() ?? Constants.PROBLEM_STATUS_CREATED;
    }

    getLatestSession(): Session | undefined {
        return this.sessionsList[this.sessionsList.length - 1];
    }

    isComplete(): boolean {
        return this.getStatus() === Constants.PROBLEM_STATUS_COMPLETE;
    }

    isActive(): boolean {
        return this.getStatus() === Constants.PROBLEM_STATUS_ACTIVE;
    }
}
