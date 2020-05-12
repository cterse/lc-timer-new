import { Session } from "./Session";
import { Constants } from "./Constants";

export class Problem {
    code: number;
    name: string;
    url: URL;
    sessionsList: Array<Session>;

    constructor(code: number, name: string, url: URL, sessionList: Array<Session> = null) {
        this.code = code;
        this.name = name;
        this.url = url;
        this.sessionsList = sessionList;
    }

    start(startTimestamp: number = Date.now()): Problem {
        let newSession = this.createNewSession(Date.now(), Constants.SESSION_STATUS_ACTIVE);
        return this.addSession(newSession);
    }

    private createNewSession(startTimestamp: number = Date.now(), status: string = Constants.SESSION_STATUS_ACTIVE): Session {
        return new Session(this.getNewSessionId(), startTimestamp, status, null);
    }

    private getNewSessionId(): string {
        let sid = this.sessionsList ? (this.sessionsList.length + 1).toString() : '1';
        sid = this.code + '-' + sid;
        return sid;
    }

    private addSession(session: Session): Problem {
        if (!session) {
            console.error("Problem:addSession :: faulty session argument");
            return this;
        }
        
        if (this.sessionsList) this.sessionsList.push(session);
        else this.sessionsList = [session];

        return this;
    }
}

export class ProblemBuilder {
    private _code: number = -1;
    private _name: string = null;
    private _url: URL = null;
    private _sessionsList: Array<Session> = null;

    setCode(code: number): ProblemBuilder {
        this._code = code;
        return this;
    }

    setName(name: string): ProblemBuilder {
        this._name = name;
        return this;
    }

    setUrl(url: URL): ProblemBuilder {
        this._url = url;
        return this;
    }

    setSessionsList(list: Array<Session>): ProblemBuilder {
        this._sessionsList = list;
        return this;
    }

    build(): Problem {
        return new Problem(this._code, this._name, this._url, this._sessionsList);
    }
}