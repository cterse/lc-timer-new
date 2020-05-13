import { Session } from "./Session";
import { Constants } from "./Constants";
import { ProblemUtils } from "./problemUtils";

export class Problem {
    code: number;
    name: string;
    url: URL;
    sessionsList: Array<Session>;

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

    startNewSession(startTimestamp: number = Date.now()): Problem {
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

    getStatus(): string {
        return this.getLatestSession()?.status ?? Constants.PROBLEM_STATUS_CREATED;
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
